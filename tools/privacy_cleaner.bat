@echo off
title SOVEREIGN CLEANER 🧹
echo [HUMANITY PROTECTION PROTOCOL]
echo.
echo Cleaning Tracking Cookies...
RunDll32.exe InetCpl.cpl,ClearMyTracksByProcess 2
echo.
echo Flushing DNS Cache (Stopping Trackers)...
ipconfig /flushdns
echo.
echo ✅ YOUR DIGITAL FOOTPRINT IS CLEANER NOW.
pause
