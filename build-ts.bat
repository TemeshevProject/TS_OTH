@echo off
setlocal EnableDelayedExpansion
cd /d "%~dp0"

if not "%~1"=="" goto run

:menu
cls
echo.
echo  TS_OTH - Build Word document
echo  ===========================
echo.
echo  1. GIOTTO
echo  2. PerfoX
echo  3. A7
echo  4. Navigator
echo  5. HyLED
echo  6. ENDODRY
echo  0. Exit
echo.
set /p CHOICE=Select 0-6: 

if "%CHOICE%"=="1" set TARGET=giotto& goto run
if "%CHOICE%"=="2" set TARGET=perfox& goto run
if "%CHOICE%"=="3" set TARGET=a7& goto run
if "%CHOICE%"=="4" set TARGET=navigator& goto run
if "%CHOICE%"=="5" set TARGET=hyled& goto run
if "%CHOICE%"=="6" set TARGET=endodry& goto run
if "%CHOICE%"=="0" exit /b 0
goto menu

:run
if "%TARGET%"=="" set TARGET=%~1

set SCRIPT=
if /I "%TARGET%"=="giotto" set SCRIPT=run_fill_giotto.js
if /I "%TARGET%"=="perfox" set SCRIPT=run_fill_perfox.js
if /I "%TARGET%"=="a7" set SCRIPT=run_fill_a7.js
if /I "%TARGET%"=="navigator" set SCRIPT=run_fill_navigator.js
if /I "%TARGET%"=="hyled" set SCRIPT=run_fill_hyled.js
if /I "%TARGET%"=="endodry" set SCRIPT=run_fill_endodry.js

if "%SCRIPT%"=="" (
  echo Unknown target: %TARGET%
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js not found
  pause
  exit /b 1
)

if /I "%TARGET%"=="perfox" (
  call build-perfox.bat
  exit /b %ERRORLEVEL%
)

echo Close Word. Running %SCRIPT% ...
node "%SCRIPT%"
if errorlevel 1 pause
if not errorlevel 1 pause
exit /b %ERRORLEVEL%
