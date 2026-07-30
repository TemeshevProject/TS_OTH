@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

set "LOG=%~dp0build-perfox-log.txt"
echo === START %DATE% %TIME% === > "%LOG%"
echo CD=%CD%>> "%LOG%"
dir /b >> "%LOG%" 2>&1

title Build PerfoX TS

echo.
echo  Building PerfoX Word document...
echo  Log file: build-perfox-log.txt
echo  Close Microsoft Word before continue.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found>> "%LOG%"
  echo  ERROR: Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

node -v >> "%LOG%" 2>&1

if not exist "run_fill_perfox.js" (
  echo ERROR: run_fill_perfox.js missing>> "%LOG%"
  echo  ERROR: run_fill_perfox.js not found in this folder.
  echo  Run START-HERE.bat first or re-download project ZIP.
  pause
  exit /b 1
)

echo STEP: node run_fill_perfox.js>> "%LOG%"
node run_fill_perfox.js >> "%LOG%" 2>&1
set ERR=!ERRORLEVEL!
echo EXIT_CODE=!ERR!>> "%LOG%"

if not "!ERR!"=="0" (
  echo.
  echo  BUILD FAILED. Log:
  echo  ----------------------
  type "%LOG%"
  echo  ----------------------
  pause
  exit /b !ERR!
)

echo.
echo  DONE. Check output folder PerfoX 3000B-1
echo.
pause
exit /b 0
