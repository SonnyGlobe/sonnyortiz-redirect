@echo off
cd /d C:\sonnyortiz-redirect

REM Run node script
node update-index.js

REM Stage updated files
git add index.html update-and-push.bat

REM Commit if there’s anything staged
git diff --cached --quiet || git commit -m "Auto-update Ngrok URL"

REM Pull latest from origin
git pull --rebase
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Rebase failed. Please resolve manually.
    pause
    exit /b %ERRORLEVEL%
)

REM Push changes
git push origin main

pause
