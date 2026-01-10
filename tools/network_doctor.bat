@echo off
title NETWORK DOCTOR 🩺
echo [DIAGNOSING CONNECTION HEALTH...]
echo.
echo 1. Checking Gateway...
ping 192.168.1.1 -n 2
echo.
echo 2. Checking DNS Censorship (Pinging 1.1.1.1)...
ping 1.1.1.1 -n 2
echo.
echo 3. Checking Local Ports...
netstat -an | find "80"
echo.
echo ✅ DIAGNOSIS COMPLETE. IF PING FAILS, THEY MIGHT BE WATCHING.
pause
