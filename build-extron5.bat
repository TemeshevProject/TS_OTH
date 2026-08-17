@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

title Build EXTRON 5 TS

echo.
echo  Building EXTRON 5 Word document...
echo  Close Microsoft Word before continue.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

if not exist "run_fill_extron5.js" (
  echo  ERROR: run_fill_extron5.js not found in this folder.
  pause
  exit /b 1
)

node run_fill_extron5.js
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
