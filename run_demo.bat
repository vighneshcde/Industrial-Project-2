@echo off
title AegisFlow - Bill, Tax & Notice Assistant
cd /d "%~dp0"
echo ===================================================================
echo   Starting AegisFlow locally at http://localhost:8000
echo ===================================================================
start "" "http://localhost:8000"
node server.js
pause
