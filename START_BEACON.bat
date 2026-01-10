@echo off
title SOVEREIGN GUARD 🛡️
echo Starting Apache...
cd /d "C:\Apache24\bin"
httpd.exe -k start
echo.
echo [SECURE] The Beacon is Active.
echo Monitor: http://localhost/monitor.html
pause
