@echo off
cd /d "%~dp0"
echo Starting local server at http://localhost:8001
D:\Programme\miniconda\envs\pyth11\python -m http.server 8001
pause
