@echo off
title CodeReview AI — Servidor Local
color 0A

echo.
echo  ============================================
echo   CodeReview AI — Iniciando servidor local
echo  ============================================
echo.
echo  URL: http://localhost:3000
echo  Admin: http://localhost:3000/admin
echo.
echo  Pulsa Ctrl+C para detener el servidor.
echo.

cd /d "%~dp0"
call npm run dev

pause
