@echo off
cd /d "%~dp0"
echo Starting local server at http://localhost:8000
D:\Programme\miniconda\envs\pyth11\python -m http.server 8000
pause
