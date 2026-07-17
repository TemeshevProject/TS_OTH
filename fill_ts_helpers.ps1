# Общие функции для заполнения шаблона ТС.
#
# Описания комплектующих (раздел 3, поле Spec в *_components.json):
#   1. Связный текст (2–4 предложения) + маркированный список технических параметров.
#   2. Не указывать «Модель», «Модель/марка», производителя — идентификатор в Name.
#   3. Источники: реестр NDDA и эксплуатационный PDF; при неполноте — открытые проверенные источники.

function Get-RegistryValidUntil {
    param($Main)
    if ($Main.unlimitedSign) { return 'бессрочно' }
    if ($Main.expireDate) { return ([datetime]$Main.expireDate).ToString('dd.MM.yyyy') }
    return 'бессрочно'
}

function Format-RegistryBlock1Text {
    param(
        [string]$TradeName,
        [string]$ProducerName,
        [string]$CountryName,
        [string]$RegNumber,
        [string]$RegDate,
        [string]$ValidUntil
    )
    $dateStr = if ($RegDate -match '^\d{4}-\d{2}-\d{2}') {
        ([datetime]$RegDate).ToString('dd.MM.yyyy')
    } else { $RegDate }
    $lines = @(
        "Наименование: $TradeName"
        "Производитель: `"$ProducerName`", $CountryName"
        "Регистрационное удостоверение: $RegNumber"
        "Дата регистрации: $dateStr"
        "Действительно до: $ValidUntil"
    )
    return ($lines -join [char]13)
}

function Get-RequiredQuantity {
    param([string]$Name, [string]$Spec)
    $text = "$Name $Spec"
    if ($text -match '(?i)(в\s+комплекте\s+\d+|комплект\s+из\s+\d+\s*шт|\d+\s*шт\.?\s+в\s+комплекте)') {
        return '1 комплект'
    }
    if ($text -match '(?i)(в\s+упаковке|упаковк[аеи]\s+\d+|\(упа\s+\d+|\d+\s*шт\.?\s+в\s+упаковке|комплектация:\s*\d+\s*шт|\d+\s*шт\.?\s+в\s+уп\.|уп\.?\s*\d+\s*шт)') {
        return '1 упаковка'
    }
    if ($Name -match '(?i)\d+\s*шт\.?\s*$' -and $Spec -match '(?i)(упаковк|комплектация:\s*\d+)') {
        return '1 упаковка'
    }
    return '1 шт'
}

function Clear-DocumentHighlight {
    param($Doc)
    $Doc.Content.HighlightColorIndex = 0
    foreach ($table in @($Doc.Tables)) {
        $table.Range.HighlightColorIndex = 0
    }
}

function Set-Block1Cell {
    param($Table, $WordApp, [hashtable]$Block1)
    $text = Format-RegistryBlock1Text @Block1
    $cell = $Table.Cell(3, 3)
    $cell.Range.Text = $text
    $cell.Range.HighlightColorIndex = 0
    $labels = @('Наименование:', 'Производитель:', 'Регистрационное удостоверение:', 'Дата регистрации:', 'Действительно до:')
    foreach ($label in $labels) {
        $find = $cell.Range.Find
        $find.ClearFormatting()
        $find.Text = $label
        $find.Forward = $true
        $find.Wrap = 0
        $find.Format = $false
        $find.Highlight = $false
        if ($find.Execute()) {
            $WordApp.Selection.Font.Bold = $true
            $WordApp.Selection.Range.HighlightColorIndex = 0
        }
    }
    $cell.Range.HighlightColorIndex = 0
}

function Set-Block2Cell {
    param($Table, [string]$Purpose)
    $cell = $Table.Cell(4, 3)
    $cell.Range.Text = $Purpose.Trim()
    $cell.Range.HighlightColorIndex = 0
}

function New-Block1FromMainJson {
    param($Main, [string]$ProducerName, [string]$CountryName)
    return @{
        TradeName = $Main.tradeName
        ProducerName = $ProducerName
        CountryName = $CountryName
        RegNumber = $Main.regNumber
        RegDate = $Main.regDate
        ValidUntil = (Get-RegistryValidUntil $Main)
    }
}

function Find-TableRow {
    param($Table, [int]$Column = 2, [string]$MatchText)
    for ($r = 1; $r -le $Table.Rows.Count; $r++) {
        try {
            $txt = $Table.Cell($r, $Column).Range.Text -replace "`r|`a", ''
            if ($txt -like "*$MatchText*") { return $r }
        } catch {}
    }
    throw "Строка не найдена: '$MatchText' (строк в таблице: $($Table.Rows.Count))"
}

function Set-Block4Cell {
    param($Table, [string]$Text)
    $row = Find-TableRow -Table $Table -MatchText 'Требования условиям эксплуатации'
    $cell = $Table.Cell($row, 3)
    $cell.Range.Text = $Text.Trim()
    $cell.Range.HighlightColorIndex = 0
    return $row
}

function Remove-ExtraComponentTemplateRows {
    param($Table, $WordApp, [int]$Block4Row)
    $lastCompRow = $Block4Row - 4
    if ($lastCompRow -lt 13) { return }
    for ($r = $lastCompRow; $r -ge 13; $r--) {
        $Table.Cell($r, 4).Select() | Out-Null
        $WordApp.Selection.Rows.Delete() | Out-Null
    }
}

function Remove-UnusedComponentRows {
    param($Table, $WordApp, [int]$ComponentCount)
    if ($ComponentCount -ge 5) { return }
    for ($r = 12; $r -gt (7 + $ComponentCount); $r--) {
        $Table.Cell($r, 4).Select() | Out-Null
        $WordApp.Selection.Rows.Delete() | Out-Null
    }
}

function Add-ExtraComponentRows {
    param($Table, $WordApp, [int]$ComponentCount)
    $extraRows = $ComponentCount - 5
    for ($i = 0; $i -lt $extraRows; $i++) {
        $Table.Cell(12, 4).Select() | Out-Null
        $WordApp.Selection.InsertRowsBelow() | Out-Null
    }
}

function Fill-ComponentRows {
    param($Table, $Components)
    for ($i = 0; $i -lt $Components.Count; $i++) {
        $row = 8 + $i
        $c = $Components[$i]
        $Table.Cell($row, 3).Range.Text = [string]$c.Num
        $Table.Cell($row, 4).Range.Text = $c.Name
        $Table.Cell($row, 5).Range.Text = $c.Spec.Trim()
        $qty = Get-RequiredQuantity -Name $c.Name -Spec $c.Spec
        $Table.Cell($row, 6).Range.Text = $qty
        $Table.Cell($row, 6).Range.HighlightColorIndex = 0
    }
}