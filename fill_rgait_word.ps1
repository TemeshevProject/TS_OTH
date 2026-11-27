$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'fill_ts_helpers.ps1')

$folder = $env:RGAIT_FOLDER
$template = $env:RGAIT_TEMPLATE
$output = $env:RGAIT_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing RGAIT_FOLDER, RGAIT_TEMPLATE or RGAIT_OUTPUT environment variables' }
if (-not $env:RGAIT_TRADE_NAME) { throw 'Missing RGAIT_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:RGAIT_COMPONENTS) { $env:RGAIT_COMPONENTS } else { Join-Path $folder 'rgait_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'rgait_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:RGAIT_TRADE_NAME
    ProducerName = 'BTL Industries Limited'
    CountryName = (
        [char]0x0412 + [char]0x0415 + [char]0x041B + [char]0x0418 + [char]0x041A + [char]0x041E + [char]0x0411 +
        [char]0x0420 + [char]0x0418 + [char]0x0422 + [char]0x0410 + [char]0x041D + [char]0x0418 + [char]0x042F
    )
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:RGAIT_SECTION4_FILE) { $env:RGAIT_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

$block4Row = Get-Block4Row -Table $t

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:RGAIT_BLOCK2_FILE -and (Test-Path -LiteralPath $env:RGAIT_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:RGAIT_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
} else {
    $main.purpose
}
Set-Block2Cell -Table $t -Purpose $block2Text
Set-Block4Cell -Table $t -Text $section4 | Out-Null

Remove-ExtraComponentTemplateRows -Table $t -WordApp $word -Block4Row $block4Row
Remove-UnusedComponentRows -Table $t -WordApp $word -ComponentCount $components.Count
Add-ExtraComponentRows -Table $t -WordApp $word -ComponentCount $components.Count
Fill-ComponentRows -Table $t -Components $components

Clear-DocumentHighlight -Doc $doc
$doc.Save()
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output "Saved: $output"
