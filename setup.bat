@echo off
REM Script para setup local rápido no Windows

echo 🎮 FACEIT OBS Widget - Setup Local
echo ==================================

REM Backend
echo.
echo 📦 Instalando Backend...
cd server
call npm install
echo ✅ Backend instalado!

REM Frontend
echo.
echo 📦 Instalando Frontend...
cd ..\client
call npm install
echo ✅ Frontend instalado!

echo.
echo 🚀 Para rodar:
echo    PowerShell Terminal 1: cd server; npm start
echo    PowerShell Terminal 2: cd client; npm run dev
echo.
echo Abra no navegador: http://localhost:3000
pause
