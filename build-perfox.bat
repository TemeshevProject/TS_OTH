@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"

set "LOG=%~dp0build-perfox-log.txt"
echo === START %DATE% %TIME% === > "%LOG%"
echo CD=%CD%>> "%LOG%"
echo.>> "%LOG%"
echo FILES:>> "%LOG%"
dir /b >> "%LOG%" 2>&1
echo.>> "%LOG%"

title Build PerfoX TS

echo.
echo  Сборка ТС PerfoX
echo  Лог: %LOG%
echo.

echo STEP: check node>> "%LOG%"
where node >> "%LOG%" 2>&1
if errorlevel 1 (
  echo ERROR: node not found>> "%LOG%"
  echo.
  echo  Node.js не найден. Установите: https://nodejs.org
  echo  После установки ПЕРЕЗАГРУЗИТЕ компьютер.
  echo.
  pause
  exit /b 1
)

node -v >> "%LOG%" 2>&1

if not exist "run_fill_perfox.js" (
  echo ERROR: run_fill_perfox.js missing>> "%LOG%"
  echo.
  echo  Нет файла run_fill_perfox.js
  echo  Вы в правильной папке? Должна быть папка TS_OTH с bat-файлами.
  echo  Скачайте ZIP заново:
  echo  https://github.com/TemeshevProject/TS_OTH/archive/refs/heads/cursor/setup-ts-oth-project-ae1b.zip
  echo.
  pause
  exit /b 1
)

if not exist "build-perfox.bat" (
  echo WARN: old project copy>> "%LOG%"
)

echo STEP: run node>> "%LOG%"
echo.
echo  Закройте Word. Запуск...
echo.

node run_fill_perfox.js >> "%LOG%" 2>&1
set ERR=!ERRORLEVEL!
echo EXIT_CODE=!ERR!>> "%LOG%"

if not "!ERR!"=="0" (
  echo.
  echo  ОШИБКА. Содержимое лога:
  echo  ----------------------
  type "%LOG%"
  echo  ----------------------
  echo.
  pause
  exit /b !ERR!
)

echo.
echo  Готово! См. папку PerfoX 3000B-1 РК-МИ-026055
echo.
pause
exit /b 0
