@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

set "LOG=%~dp0setup-log.txt"
echo === SETUP CHECK %DATE% %TIME% === > "%LOG%"
echo CD=%CD%>> "%LOG%"
echo.>> "%LOG%"
dir /b >> "%LOG%" 2>&1
echo.>> "%LOG%"

echo.
echo  ==========================================
echo    Проверка установки TS_OTH
echo  ==========================================
echo.
echo  Папка: %CD%
echo  Лог: setup-log.txt
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [НЕТ] Node.js - установите https://nodejs.org
  echo ERROR node>> "%LOG%"
) else (
  echo [OK] Node.js
  node -v
  node -v >> "%LOG%" 2>&1
)

if exist "run_fill_perfox.js" (echo [OK] run_fill_perfox.js) else (echo [НЕТ] run_fill_perfox.js & echo MISSING run_fill_perfox.js>> "%LOG%")
if exist "fill_perfox_word.ps1" (echo [OK] fill_perfox_word.ps1) else (echo [НЕТ] fill_perfox_word.ps1)
if exist "fill_ts_helpers.ps1" (echo [OK] fill_ts_helpers.ps1) else (echo [НЕТ] fill_ts_helpers.ps1)
if exist "build-perfox.bat" (echo [OK] build-perfox.bat) else (echo [НЕТ] build-perfox.bat)
if exist "template" (echo [OK] папка template) else (echo [НЕТ] папка template)

if exist "PerfoX 3000B-1 РК-МИ-026055\perfox_components.json" (
  echo [OK] PerfoX комплект
) else (
  echo [НЕТ] папка PerfoX 3000B-1 РК-МИ-026055
  echo MISSING perfox folder>> "%LOG%"
)

node -e "const fs=require('fs'),p=require('path');const d=p.join(process.cwd(),'template');let ok=false;if(fs.existsSync(d)){ok=fs.readdirSync(d).some(f=>f.toLowerCase().endsWith('.doc'))}console.log(ok?'[OK] Шаблон Word':'[НЕТ] Шаблон.doc в template\\');process.exit(ok?0:1)" 2>> "%LOG%"
if errorlevel 1 echo Положите Шаблон.doc в папку template\

echo.
echo  Если есть [НЕТ] - скачайте ZIP заново и распакуйте В ЭТУ папку.
echo  https://github.com/TemeshevProject/TS_OTH/archive/refs/heads/cursor/setup-ts-oth-project-ae1b.zip
echo.
pause
