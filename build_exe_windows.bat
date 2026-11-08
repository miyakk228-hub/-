@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo        MANUL KOMBAT 2.3.3 - BUILD EXE
echo ========================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org/
  pause
  exit /b 1
)
echo Installing build dependencies. This requires internet access...
call npm install
if errorlevel 1 goto error
echo Building Windows installer and portable EXE...
call npm run dist
if errorlevel 1 goto error
echo.
echo SUCCESS! Check the dist folder.
echo Installer and portable build files are listed in the dist folder.
pause
exit /b 0
:error
echo.
echo BUILD FAILED. Copy the error text and send it here.
pause
exit /b 1
