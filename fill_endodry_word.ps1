$ErrorActionPreference = 'Stop'
. 'C:\Users\DELL\Desktop\Cursor\fill_ts_helpers.ps1'

$folder = $env:ENDODRY_FOLDER
$template = $env:ENDODRY_TEMPLATE
$output = $env:ENDODRY_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing ENDODRY_FOLDER, ENDODRY_TEMPLATE or ENDODRY_OUTPUT environment variables' }
if (-not $env:ENDODRY_TRADE_NAME) { throw 'Missing ENDODRY_TRADE_NAME environment variable' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:ENDODRY_COMPONENTS) { $env:ENDODRY_COMPONENTS } else { Join-Path $folder 'endodry_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'endodry_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json

$block1 = @{
    TradeName = $env:ENDODRY_TRADE_NAME
    ProducerName = 'Cantel Medical (Italy) S.r.l.'
    CountryName = ([char]0x0418 + [char]0x0442 + [char]0x0430 + [char]0x043B + [char]0x0438 + [char]0x044F)
    RegNumber = $main.regNumber
    RegDate = $main.regDate
    ValidUntil = (Get-RegistryValidUntil $main)
}

$section4File = if ($env:ENDODRY_SECTION4_FILE) { $env:ENDODRY_SECTION4_FILE } else { Join-Path $folder 'section4.txt' }
$section4 = (Get-Content -LiteralPath $section4File -Raw -Encoding UTF8).Trim()

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:ENDODRY_BLOCK2_FILE -and (Test-Path -LiteralPath $env:ENDODRY_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:ENDODRY_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
} else {
    $main.purpose
}
Set-Block2Cell -Table $t -Purpose $block2Text
$t.Cell(27, 3).Range.Text = $section4
$t.Cell(27, 3).Range.HighlightColorIndex = 0

for ($r = 23; $r -ge 13; $r--) {
    $t.Cell($r, 4).Select() | Out-Null
    $word.Selection.Rows.Delete() | Out-Null
}

if ($components.Count -lt 5) {
    for ($r = 12; $r -gt (7 + $components.Count); $r--) {
        $t.Cell($r, 4).Select() | Out-Null
        $word.Selection.Rows.Delete() | Out-Null
    }
}

$extraRows = $components.Count - 5
for ($i = 0; $i -lt $extraRows; $i++) {
    $t.Cell(12, 4).Select() | Out-Null
    $word.Selection.InsertRowsBelow() | Out-Null
}

for ($i = 0; $i -lt $components.Count; $i++) {
    $row = 8 + $i
    $c = $components[$i]
    $t.Cell($row, 3).Range.Text = [string]$c.Num
    $t.Cell($row, 4).Range.Text = $c.Name
    $t.Cell($row, 5).Range.Text = $c.Spec.Trim()
    $qty = Get-RequiredQuantity -Name $c.Name -Spec $c.Spec
    $t.Cell($row, 6).Range.Text = $qty
    $t.Cell($row, 6).Range.HighlightColorIndex = 0
}

Clear-DocumentHighlight -Doc $doc
$doc.Save()
$doc.Close()
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output "Saved: $output"
