@echo off
title SmartWorkout Planner
echo Iniciando SmartWorkout Planner en http://localhost:4173 ...
start "" http://localhost:4173
npx serve "%~dp0." -l 4173
