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
echo  9. BD FACSLyric
echo  10. EXTRON 5
echo  11. uCT 550 (komplekt 2)
echo  12. CASP-50
echo  13. CASP-50 (komplekt 2)
echo  14. Avanttron Pro
echo  15. Magnitoturbotron Pro
echo  16. R-GAIT
echo  17. NeuroHelper
echo  18. EP-6000
echo  19. uCT 550 (komplekt 3)
echo  20. MAC-R32D
echo  0. Exit
echo.
set /p CHOICE=Select 0-20: 

if "%CHOICE%"=="1" set TARGET=giotto& goto run
if "%CHOICE%"=="2" set TARGET=perfox& goto run
if "%CHOICE%"=="3" set TARGET=opera& goto run
if "%CHOICE%"=="4" set TARGET=a7& goto run
if "%CHOICE%"=="5" set TARGET=navigator& goto run
if "%CHOICE%"=="6" set TARGET=hyled& goto run
if "%CHOICE%"=="7" set TARGET=endodry& goto run
if "%CHOICE%"=="8" set TARGET=uct550& goto run
if "%CHOICE%"=="9" set TARGET=faclyric& goto run
if "%CHOICE%"=="10" set TARGET=extron5& goto run
if "%CHOICE%"=="11" set TARGET=uct550kit2& goto run
if "%CHOICE%"=="12" set TARGET=casp50& goto run
if "%CHOICE%"=="13" set TARGET=casp50kit2& goto run
if "%CHOICE%"=="14" set TARGET=avanttron& goto run
if "%CHOICE%"=="15" set TARGET=magnitoturbotron& goto run
if "%CHOICE%"=="16" set TARGET=rgait& goto run
if "%CHOICE%"=="17" set TARGET=neurohelper& goto run
if "%CHOICE%"=="18" set TARGET=ep6000& goto run
if "%CHOICE%"=="19" set TARGET=uct550kit3& goto run
if "%CHOICE%"=="20" set TARGET=macr32d& goto run
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
if /I "%TARGET%"=="faclyric" set SCRIPT=run_fill_faclyric.js
if /I "%TARGET%"=="extron5" set SCRIPT=run_fill_extron5.js
if /I "%TARGET%"=="uct550kit2" set SCRIPT=run_fill_uct550_kit2.js
if /I "%TARGET%"=="casp50" set SCRIPT=run_fill_casp50.js
if /I "%TARGET%"=="casp50kit2" set SCRIPT=run_fill_casp50_kit2.js
if /I "%TARGET%"=="avanttron" set SCRIPT=run_fill_avanttron.js
if /I "%TARGET%"=="magnitoturbotron" set SCRIPT=run_fill_magnitoturbotron.js
if /I "%TARGET%"=="rgait" set SCRIPT=run_fill_rgait.js
if /I "%TARGET%"=="neurohelper" set SCRIPT=run_fill_neurohelper.js
if /I "%TARGET%"=="ep6000" set SCRIPT=run_fill_ep6000.js
if /I "%TARGET%"=="uct550kit3" set SCRIPT=run_fill_uct550_kit3.js
if /I "%TARGET%"=="macr32d" set SCRIPT=run_fill_macr32d.js

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

if /I "%TARGET%"=="faclyric" (
  call build-faclyric.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="extron5" (
  call build-extron5.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="uct550kit2" (
  call build-uct550-kit2.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="casp50" (
  call build-casp50.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="casp50kit2" (
  call build-casp50-kit2.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="avanttron" (
  call build-avanttron.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="magnitoturbotron" (
  call build-magnitoturbotron.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="rgait" (
  call build-rgait.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="neurohelper" (
  call build-neurohelper.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="ep6000" (
  call build-ep6000.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="uct550kit3" (
  call build-uct550-kit3.bat
  exit /b %ERRORLEVEL%
)

if /I "%TARGET%"=="macr32d" (
  call build-macr32d.bat
  exit /b %ERRORLEVEL%
)

echo Close Word. Running %SCRIPT% ...
node "%SCRIPT%"
if errorlevel 1 pause
if not errorlevel 1 pause
exit /b %ERRORLEVEL%
