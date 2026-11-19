$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'fill_ts_helpers.ps1')

$folder = $env:EXTRON5_FOLDER
$template = $env:EXTRON5_TEMPLATE
$output = $env:EXTRON5_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing EXTRON5_FOLDER, EXTRON5_TEMPLATE or EXTRON5_OUTPUT environment variables' }
if (-not $env:EXTRON5_TRADE_NAME) { throw 'Missing EXTRON5_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:EXTRON5_COMPONENTS) { $env:EXTRON5_COMPONENTS } else { Join-Path $folder 'extron5_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'extron5_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:EXTRON5_TRADE_NAME
    ProducerName = 'DRTECH Corporation'
    CountryName = (
        [char]0x0420 + [char]0x0415 + [char]0x0421 + [char]0x041F + [char]0x0423 + [char]0x0411 + [char]0x041B +
        [char]0x0418 + [char]0x041A + [char]0x0410 + [char]0x0020 +
        [char]0x041A + [char]0x041E + [char]0x0420 + [char]0x0415 + [char]0x042F
    )
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:EXTRON5_SECTION4_FILE) { $env:EXTRON5_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

$block4Row = Get-Block4Row -Table $t

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:EXTRON5_BLOCK2_FILE -and (Test-Path -LiteralPath $env:EXTRON5_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:EXTRON5_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
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
