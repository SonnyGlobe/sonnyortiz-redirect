@echo off
cd /d C:\sonnyortiz-redirect
node update-index.js
git add index.html
git commit -m "Auto-update Ngrok URL"
git push origin main
pause