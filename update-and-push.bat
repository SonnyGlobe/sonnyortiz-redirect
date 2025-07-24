@echo off
setlocal enabledelayedexpansion

echo [1/4] Updating index.html from Ngrok URL...
node update-index.js

IF %ERRORLEVEL% NEQ 0 (
    echo ❌ update-index.js failed. Aborting.
    pause
    exit /b 1
)

echo.
echo [2/4] Staging updated index.html...
git add index.html

echo.
echo [3/4] Committing changes...
FOR /F %%i IN ('powershell -command "Get-Date -Format yyyy-MM-dd_HH:mm:ss"') DO SET timestamp=%%i
git commit -m "🔁 Auto-update Ngrok URL - %timestamp%"

echo.
echo [4/4] Pushing to GitHub...
git push origin main

echo.
echo ✅ Done! GitHub index.html should now redirect to your latest Ngrok tunnel.
pause
