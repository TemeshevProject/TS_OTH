@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

if "%~1"=="" (
  echo.
  echo  Сборка Word-файла ТС
  echo  ====================
  echo.
  echo  Использование:
  echo    build-ts.bat giotto
  echo    build-ts.bat a7
  echo    build-ts.bat navigator
  echo    build-ts.bat hyled
  echo    build-ts.bat endodry
  echo.
  echo  Или дважды щёлкните по ярлыку:
  echo    "Собрать ТС GIOTTO.bat"
  echo.
  pause
  exit /b 1
)

set "TARGET=%~1"
set "SCRIPT="

if /I "%TARGET%"=="giotto" set "SCRIPT=run_fill_giotto.js"
if /I "%TARGET%"=="a7" set "SCRIPT=run_fill_a7.js"
if /I "%TARGET%"=="navigator" set "SCRIPT=run_fill_navigator.js"
if /I "%TARGET%"=="hyled" set "SCRIPT=run_fill_hyled.js"
if /I "%TARGET%"=="endodry" set "SCRIPT=run_fill_endodry.js"

if "%SCRIPT%"=="" (
  echo Неизвестный комплект: %TARGET%
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js не найден. Установите с https://nodejs.org
  pause
  exit /b 1
)

echo.
echo Закройте Word, если он открыт...
echo Сборка: %SCRIPT%
echo.

node "%SCRIPT%"
if errorlevel 1 (
  echo.
  echo ОШИБКА при сборке.
  pause
  exit /b 1
)

echo.
echo Готово. Файл .doc лежит в папке комплекта.
echo.
pause
