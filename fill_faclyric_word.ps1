$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'fill_ts_helpers.ps1')

$folder = $env:FACLYRIC_FOLDER
$template = $env:FACLYRIC_TEMPLATE
$output = $env:FACLYRIC_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing FACLYRIC_FOLDER, FACLYRIC_TEMPLATE or FACLYRIC_OUTPUT environment variables' }
if (-not $env:FACLYRIC_TRADE_NAME) { throw 'Missing FACLYRIC_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:FACLYRIC_COMPONENTS) { $env:FACLYRIC_COMPONENTS } else { Join-Path $folder 'faclyric_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'faclyric_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:FACLYRIC_TRADE_NAME
    ProducerName = 'Becton, Dickinson and Company, BD Biosciences'
    CountryName = (
        [char]0x0421 + [char]0x043E + [char]0x0435 + [char]0x0434 + [char]0x0438 + [char]0x043D + [char]0x0451 +
        [char]0x043D + [char]0x043D + [char]0x044B + [char]0x0435 + [char]0x0020 +
        [char]0x0428 + [char]0x0442 + [char]0x0430 + [char]0x0442 + [char]0x044B + [char]0x0020 +
        [char]0x0410 + [char]0x043C + [char]0x0435 + [char]0x0440 + [char]0x0438 + [char]0x043A + [char]0x0438
    )
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:FACLYRIC_SECTION4_FILE) { $env:FACLYRIC_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

$block4Row = Get-Block4Row -Table $t

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:FACLYRIC_BLOCK2_FILE -and (Test-Path -LiteralPath $env:FACLYRIC_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:FACLYRIC_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
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
