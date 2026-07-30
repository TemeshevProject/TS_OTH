@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

cd /d "%~dp0"

if not "%~1"=="" goto :run

:menu
cls
echo.
echo   ========================================
echo     Сборка Word-файла ТС
echo   ========================================
echo.
echo   1. GIOTTO IMAGE 3DL
echo   2. PerfoX 3000B-1
echo   3. A7
echo   4. Navigator DR Care
echo   5. HyLED C8
echo   6. ENDODRY
echo.
echo   0. Выход
echo.
set /p CHOICE="   Выберите комплект (0-6): "

if "%CHOICE%"=="1" set "TARGET=giotto" & goto :run
if "%CHOICE%"=="2" set "TARGET=perfox" & goto :run
if "%CHOICE%"=="3" set "TARGET=a7" & goto :run
if "%CHOICE%"=="4" set "TARGET=navigator" & goto :run
if "%CHOICE%"=="5" set "TARGET=hyled" & goto :run
if "%CHOICE%"=="6" set "TARGET=endodry" & goto :run
if "%CHOICE%"=="0" exit /b 0
echo.
echo   Неверный выбор.
timeout /t 2 >nul
goto :menu

:run
if "%TARGET%"=="" set "TARGET=%~1"

set "SCRIPT="
if /I "%TARGET%"=="giotto" set "SCRIPT=run_fill_giotto.js"
if /I "%TARGET%"=="perfox" set "SCRIPT=run_fill_perfox.js"
if /I "%TARGET%"=="a7" set "SCRIPT=run_fill_a7.js"
if /I "%TARGET%"=="navigator" set "SCRIPT=run_fill_navigator.js"
if /I "%TARGET%"=="hyled" set "SCRIPT=run_fill_hyled.js"
if /I "%TARGET%"=="endodry" set "SCRIPT=run_fill_endodry.js"

if "%SCRIPT%"=="" (
  echo.
  echo   Неизвестный комплект: %TARGET%
  echo   Доступно: giotto, a7, navigator, hyled, endodry
  echo.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo.
  echo   Node.js не найден. Установите: https://nodejs.org
  echo.
  pause
  exit /b 1
)

if not exist "template\Шаблон.doc" (
  echo.
  echo   Не найден шаблон: template\Шаблон.doc
  echo   Скопируйте Шаблон.doc в папку template\
  echo.
  pause
  exit /b 1
)

echo.
echo   Закройте Word, если открыт...
echo   Сборка: %SCRIPT%
echo.

node "%SCRIPT%"
if errorlevel 1 (
  echo.
  echo   ОШИБКА при сборке. Проверьте, что в папке комплекта есть
  echo   *_main.json, *_components.json, block2.txt, section4.txt
  echo.
  pause
  exit /b 1
)

echo.
echo   ========================================
echo   Готово!
echo   Файл .doc лежит в папке комплекта.
echo   ========================================
echo.
pause
exit /b 0
