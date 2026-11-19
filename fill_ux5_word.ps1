$ErrorActionPreference = 'Stop'
. 'C:\Users\DELL\Desktop\Cursor\fill_ts_helpers.ps1'

$folder = $env:UX5_FOLDER
$template = $env:UX5_TEMPLATE
$output = $env:UX5_OUTPUT
if (-not $folder -or -not $template -or -not $output) { throw 'Missing UX5_FOLDER, UX5_TEMPLATE or UX5_OUTPUT environment variables' }

Copy-Item -LiteralPath $template -Destination $output -Force

$componentsFile = if ($env:UX5_COMPONENTS) { $env:UX5_COMPONENTS } else { Join-Path $folder 'ux5_instruments_components.json' }
$components = Get-Content $componentsFile -Raw -Encoding UTF8 | ConvertFrom-Json
$main = Get-Content (Join-Path $folder 'ux5_main.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$block1 = New-Block1FromMainJson -Main $main -ProducerName 'Shenzhen Mindray Bio-Medical Electronics Co., Ltd.' -CountryName ([char]0x041A + [char]0x0438 + [char]0x0442 + [char]0x0430 + [char]0x0439)
$section4 = ([char]0x0422 + [char]0x0435 + [char]0x043C + [char]0x043F + [char]0x0435 + [char]0x0440 + [char]0x0430 + [char]0x0442 + [char]0x0443 + [char]0x0440 + [char]0x043D + [char]0x044B + [char]0x0439 + ' ' + [char]0x0434 + [char]0x0438 + [char]0x0430 + [char]0x043F + [char]0x0430 + [char]0x0437 + [char]0x043E + [char]0x043D + ': -20 – 60 °C')

Get-Process WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($output)
$t = $doc.Tables.Item(1)

Set-Block1Cell -Table $t -WordApp $word -Block1 $block1
$block2Text = if ($env:UX5_BLOCK2_FILE -and (Test-Path -LiteralPath $env:UX5_BLOCK2_FILE)) {
    (Get-Content -LiteralPath $env:UX5_BLOCK2_FILE -Raw -Encoding UTF8).Trim()
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
