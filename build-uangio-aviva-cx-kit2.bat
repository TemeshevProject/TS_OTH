@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"
title Build uAngio AVIVA CX TS (komplekt 2)
echo.
echo  Building uAngio AVIVA CX (komplekt 2)...
echo  Close Microsoft Word before continue.
echo.
where node >nul 2>&1 || (echo Node.js not found & pause & exit /b 1)
node run_fill_uangio_aviva_cx_kit2.js
set ERR=!ERRORLEVEL!
if not "!ERR!"=="0" (echo BUILD FAILED & pause & exit /b !ERR!)
echo DONE.
pause
exit /b 0