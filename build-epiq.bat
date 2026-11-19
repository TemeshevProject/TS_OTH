@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

title Build EPIQ TS

echo.
echo  Building EPIQ Word document...
echo  Close Microsoft Word before continue.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  ERROR: Node.js not found.
  pause
  exit /b 1
)

node run_fill_epiq.js
set ERR=!ERRORLEVEL!
if not "!ERR!"=="0" (
  echo  BUILD FAILED.
  pause
  exit /b !ERR!
)
echo  DONE.
pause
exit /b 0