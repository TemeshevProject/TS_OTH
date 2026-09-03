@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

title Build MAC-R32D TS

echo.
echo  Building MAC-R32D Word document...
echo  Close Microsoft Word before continue.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

if not exist "run_fill_macr32d.js" (
  echo  ERROR: run_fill_macr32d.js not found in this folder.
  pause
  exit /b 1
)

node run_fill_macr32d.js
set ERR=!ERRORLEVEL!

if not "!ERR!"=="0" (
  echo.
  echo  BUILD FAILED.
  pause
  exit /b !ERR!
)

echo.
echo  DONE.
echo.
pause
exit /b 0
