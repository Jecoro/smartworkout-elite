@echo off
title SmartWorkout - tunel para el movil
echo Este script publica la app temporalmente en Internet para instalarla en el movil.
echo 1) Se abrira el servidor local y un tunel de Cloudflare (gratis, sin cuenta).
echo 2) Busca en la ventana la URL https://xxxx.trycloudflare.com y abrela en el Chrome del movil.
echo 3) Menu de Chrome -^> "Anadir a pantalla de inicio". Una vez instalada, la app funciona sin conexion.
echo.
start "servidor" cmd /c npx serve "%~dp0." -l 4173
timeout /t 5 /nobreak >nul
cloudflared tunnel --url http://localhost:4173
