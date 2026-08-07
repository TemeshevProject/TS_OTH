$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'fill_ts_helpers.ps1')

$folder = $env:MACR32D_FOLDER
$template = $env:MACR32D_TEMPLATE
$output = $env:MACR32D_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing MACR32D_FOLDER, MACR32D_TEMPLATE or MACR32D_OUTPUT environment variables' }
if (-not $env:MACR32D_TRADE_NAME) { throw 'Missing MACR32D_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:MACR32D_COMPONENTS) { $env:MACR32D_COMPONENTS } else { Join-Path $folder 'macr32d_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'macr32d_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:MACR32D_TRADE_NAME
    ProducerName = 'General Medical Merate S.p.A.'
    CountryName = ([char]0x0418 + [char]0x0442 + [char]0x0430 + [char]0x043B + [char]0x0438 + [char]0x044F)
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:MACR32D_SECTION4_FILE) { $env:MACR32D_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

$block4Row = Get-Block4Row -Table $t

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:MACR32D_BLOCK2_FILE -and (Test-Path -LiteralPath $env:MACR32D_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:MACR32D_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
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
