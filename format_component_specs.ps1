# Formats Spec in *_components.json: restores bullet newlines, removes Model/Model-brand/Compatibility lines.
# Run from Cursor root when batch-updating existing component JSON files.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$linePattern = '(?m)^\s*-\s*(Модель|Модель/марка|Совместимость):.*(\r?\n)?'

function Format-ComponentSpec {
    param([string]$Spec)
    if (-not $Spec) { return $Spec }
    $s = $Spec -replace '(?<=[^\r\n])-\s(?=[А-ЯA-ZЁ])', "`n`n- "
    $s = [regex]::Replace($s, $linePattern, '')
    $s = [regex]::Replace($s, '(\r?\n){3,}', "`n`n")
    $s = $s.Trim()
    if ($s -match '\n\n- ') {
        $parts = $s -split '\n\n-', 2
        if ($parts.Count -eq 2) {
            $list = ($parts[1] -replace '\n\n- ', "`n- ")
            $s = $parts[0].TrimEnd() + "`n`n- " + $list.Trim()
        }
    }
    $s = $s -replace '\.\n- ', ".`n`n- "
    return $s.Trim()
}

Get-ChildItem -Path $root -Recurse -Filter '*_components.json' | ForEach-Object {
    $items = [IO.File]::ReadAllText($_.FullName, [Text.Encoding]::UTF8) | ConvertFrom-Json
    $changed = $false
    foreach ($item in $items) {
        $new = Format-ComponentSpec $item.Spec
        if ($new -ne $item.Spec) {
            $item.Spec = $new
            $changed = $true
        }
    }
    if ($changed) {
        $json = $items | ConvertTo-Json -Depth 6
        [IO.File]::WriteAllText($_.FullName, $json, [Text.UTF8Encoding]::new($false))
        Write-Output "Updated: $($_.Name)"
    }
}
