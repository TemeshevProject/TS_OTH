$ErrorActionPreference = 'Stop'
$folder = (Get-ChildItem 'C:\Users\DELL\Desktop\Cursor' -Directory | Where-Object { $_.Name -like 'UX5*030869*' -and $_.Name.Contains('(') } | Select-Object -First 1).FullName
if (-not $folder) { throw 'UX5 instruments folder not found' }
& (Join-Path $folder 'fill_ux5_instruments.ps1')
