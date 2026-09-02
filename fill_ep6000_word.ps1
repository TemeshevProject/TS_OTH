$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'fill_ts_helpers.ps1')

$folder = $env:EP6000_FOLDER
$template = $env:EP6000_TEMPLATE
$output = $env:EP6000_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing EP6000_FOLDER, EP6000_TEMPLATE or EP6000_OUTPUT environment variables' }
if (-not $env:EP6000_TRADE_NAME) { throw 'Missing EP6000_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:EP6000_COMPONENTS) { $env:EP6000_COMPONENTS } else { Join-Path $folder 'ep6000_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'ep6000_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:EP6000_TRADE_NAME
    ProducerName = 'FUJIFILM Corporation'
    CountryName = (
        [char]0x042F + [char]0x041F + [char]0x041E + [char]0x041D + [char]0x0418 + [char]0x042F
    )
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:EP6000_SECTION4_FILE) { $env:EP6000_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

$block4Row = Get-Block4Row -Table $t

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:EP6000_BLOCK2_FILE -and (Test-Path -LiteralPath $env:EP6000_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:EP6000_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
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
