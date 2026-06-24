@echo off
title The Echoes of the Past Server
echo Starting The Echoes of the Past...

:: Add portable Node to the PATH
set PATH=%~dp0node;%PATH%

:: Install dependencies if they don't exist
if not exist "node_modules\" (
    echo Installing dependencies for the first time. This may take a minute...
    call npm install
)

echo.
echo Starting the game server...
echo The game will open in your browser shortly! If it says "Site can't be reached", please wait a few seconds and refresh.
echo.

:: Open the browser
start http://localhost:3000

:: Run the dev server
call npm run dev
