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
echo  3. OPERA
echo  4. A7
echo  5. Navigator
echo  6. HyLED
echo  7. ENDODRY
echo  8. uCT 550
echo  9. EP-6000
echo  10. Logiq P9
echo  11. CU-5000
echo  12. MEDIVATORS ISA
echo  13. EcoView 9
echo  14. CompaX 500A
echo  0. Exit
echo.
set /p CHOICE=Select 0-14: 

if "%CHOICE%"=="1" set TARGET=giotto& goto run
if "%CHOICE%"=="2" set TARGET=perfox& goto run
if "%CHOICE%"=="3" set TARGET=opera& goto run
if "%CHOICE%"=="4" set TARGET=a7& goto run
if "%CHOICE%"=="5" set TARGET=navigator& goto run
if "%CHOICE%"=="6" set TARGET=hyled& goto run
if "%CHOICE%"=="7" set TARGET=endodry& goto run
if "%CHOICE%"=="8" set TARGET=uct550& goto run
if "%CHOICE%"=="9" set TARGET=ep6000& goto run
if "%CHOICE%"=="10" set TARGET=logiqp9& goto run
if "%CHOICE%"=="11" set TARGET=cu5000& goto run
if "%CHOICE%"=="12" set TARGET=isa& goto run
if "%CHOICE%"=="13" set TARGET=ecoview9& goto run
if "%CHOICE%"=="14" set TARGET=compact500a& goto run
if "%CHOICE%"=="0" exit /b 0
goto menu

:run
if "%TARGET%"=="" set TARGET=%~1

set SCRIPT=
if /I "%TARGET%"=="giotto" set SCRIPT=run_fill_giotto.js
if /I "%TARGET%"=="perfox" set SCRIPT=run_fill_perfox.js
if /I "%TARGET%"=="opera" set SCRIPT=run_fill_opera.js
if /I "%TARGET%"=="a7" set SCRIPT=run_fill_a7.js
if /I "%TARGET%"=="navigator" set SCRIPT=run_fill_navigator.js
if /I "%TARGET%"=="hyled" set SCRIPT=run_fill_hyled.js
if /I "%TARGET%"=="endodry" set SCRIPT=run_fill_endodry.js
if /I "%TARGET%"=="uct550" set SCRIPT=run_fill_uct550.js
if /I "%TARGET%"=="ep6000" set SCRIPT=run_fill_ep6000.js
if /I "%TARGET%"=="logiqp9" set SCRIPT=run_fill_logiqp9.js
if /I "%TARGET%"=="cu5000" set SCRIPT=run_fill_cu5000.js
if /I "%TARGET%"=="isa" set SCRIPT=run_fill_isa.js
if /I "%TARGET%"=="ecoview9" set SCRIPT=run_fill_ecoview9.js
if /I "%TARGET%"=="compact500a" set SCRIPT=run_fill_compact500a.js

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

if /I "%TARGET%"=="opera" (
  call build-opera.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="uct550" (
  call build-uct550.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="ep6000" (
  call build-ep6000.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="logiqp9" (
  call build-logiqp9.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="cu5000" (
  call build-cu5000.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="isa" (
  call build-isa.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="ecoview9" (
  call build-ecoview9.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="compact500a" (
  call build-compact500a.bat
  exit /b %ERRORLEVEL%
)

echo Close Word. Running %SCRIPT% ...
node "%SCRIPT%"
if errorlevel 1 pause
if not errorlevel 1 pause
exit /b %ERRORLEVEL%
