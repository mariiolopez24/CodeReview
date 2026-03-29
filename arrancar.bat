@echo off
chcp 65001 >nul
title CodeReview AI — Dev Server

echo.
echo ╔══════════════════════════════════════╗
echo ║   CodeReview AI — Arrancar           ║
echo ╚══════════════════════════════════════╝
echo.

:: Ir a la carpeta del proyecto
cd /d "%~dp0"

:: Comprobar Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no encontrado. Instala Node 18+ desde nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo [OK] Node.js %%i

:: Comprobar .env.local
if not exist ".env.local" (
    echo [ERROR] .env.local no encontrado
    pause
    exit /b 1
)
echo [OK] .env.local encontrado

:: Instalar dependencias si no existen
if not exist "node_modules" (
    echo.
    echo Instalando dependencias por primera vez...
    echo Esto puede tardar un par de minutos.
    echo.
    npm install
    if errorlevel 1 (
        echo [ERROR] Fallo al instalar dependencias
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas
) else (
    echo [OK] Dependencias presentes
)

:: Mostrar rutas
echo.
echo ┌─────────────────────────────────────────┐
echo │  Rutas disponibles:                     │
echo │                                         │
echo │  http://localhost:3000          Landing  │
echo │  http://localhost:3000/dashboard         │
echo │  http://localhost:3000/blog              │
echo │  http://localhost:3000/admin             │
echo │  http://localhost:3000/pricing           │
echo │  http://localhost:3000/comparar          │
echo │  http://localhost:3000/account           │
echo └─────────────────────────────────────────┘
echo.
echo Arrancando servidor... (cierra esta ventana para parar)
echo.

:: Abrir el navegador tras 4 segundos
start "" cmd /c "timeout /t 4 >nul && start http://localhost:3000"

:: Arrancar Next.js
npm run dev
