@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Build PerfoX TS

echo.
echo  ==========================================
echo    Сборка ТС PerfoX 3000B-1
echo  ==========================================
echo.
echo  Закройте Word, если открыт.
echo  Лог ошибок: build-perfox-log.txt
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo  ОШИБКА: Node.js не найден.
  echo  Установите с https://nodejs.org и перезапустите.
  echo.
  pause
  exit /b 1
)

if not exist "run_fill_perfox.js" (
  echo  ОШИБКА: нет файла run_fill_perfox.js
  echo  Скачайте обновлённый ZIP проекта с GitHub.
  echo.
  pause
  exit /b 1
)

node run_fill_perfox.js
set ERR=%ERRORLEVEL%

if not "%ERR%"=="0" (
  echo.
  echo  Сборка не удалась. См. build-perfox-log.txt
  if exist build-perfox-log.txt type build-perfox-log.txt
  echo.
  pause
  exit /b %ERR%
)

echo.
pause
exit /b 0
