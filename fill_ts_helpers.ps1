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