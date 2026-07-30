@echo off
setlocal
cd /d "%~dp0"

set "LOG=%~dp0setup-log.txt"
echo === SETUP CHECK %DATE% %TIME% === > "%LOG%"
echo CD=%CD%>> "%LOG%"
dir /b >> "%LOG%" 2>&1

echo.
echo  TS_OTH setup check
echo  Folder: %CD%
echo  Log: setup-log.txt
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  [FAIL] Node.js not found - install from https://nodejs.org
  echo FAIL node>> "%LOG%"
) else (
  echo  [ OK ] Node.js
  node -v
)

if exist "run_fill_perfox.js" (echo  [ OK ] run_fill_perfox.js) else (echo  [FAIL] run_fill_perfox.js)
if exist "fill_perfox_word.ps1" (echo  [ OK ] fill_perfox_word.ps1) else (echo  [FAIL] fill_perfox_word.ps1)
if exist "fill_ts_helpers.ps1" (echo  [ OK ] fill_ts_helpers.ps1) else (echo  [FAIL] fill_ts_helpers.ps1)
if exist "build-perfox.bat" (echo  [ OK ] build-perfox.bat) else (echo  [FAIL] build-perfox.bat)
if exist "template" (echo  [ OK ] template folder) else (echo  [FAIL] template folder)

if exist "PerfoX 3000B-1 РК-МИ-026055\perfox_components.json" (
  echo  [ OK ] PerfoX data folder
) else (
  echo  [FAIL] PerfoX data folder
)

node check-perfox.js
echo.
echo  If any FAIL above, re-download ZIP:
echo  https://github.com/TemeshevProject/TS_OTH/archive/refs/heads/cursor/setup-ts-oth-project-ae1b.zip
echo.
pause
