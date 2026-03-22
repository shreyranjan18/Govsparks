@echo off
TITLE GovSpark Connect - Auto Setup & Run
CLS

ECHO ========================================================
ECHO       GovSpark Connect - Automatic Setup Script
ECHO ========================================================
ECHO.

:: 1. Check for Node.js
ECHO [1/4] Checking for Node.js...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO [ERROR] Node.js is NOT installed!
    ECHO Please install Node.js from: https://nodejs.org/
    ECHO Then run this script again.
    PAUSE
    EXIT
)
ECHO Node.js is installed.
ECHO.

:: 2. Setup Environment Variables (.env)
ECHO [2/4] Configuring Environment...
IF NOT EXIST "server\.env" (
    ECHO Creating default configuration file...
    (
        ECHO PORT=5000
        ECHO MONGO_URI=mongodb://localhost:27017/govspark
        ECHO JWT_SECRET=secret_key_for_friends_demo
    ) > "server\.env"
    ECHO Configuration created successfully.
) ELSE (
    ECHO Configuration already exists.
)
ECHO.

:: 3. Install Dependencies (only if missing)
ECHO [3/4] Checking & Installing Dependencies (This may take a few minutes)...
IF NOT EXIST "node_modules" (
    ECHO Installing Root Dependencies...
    call npm install
)

IF NOT EXIST "client\node_modules" (
    ECHO Installing Client Dependencies...
    cd client
    call npm install
    cd ..
)

IF NOT EXIST "server\node_modules" (
    ECHO Installing Server Dependencies...
    cd server
    call npm install
    cd ..
)
ECHO Dependencies are ready.
ECHO.

:: 4. Start the Application
ECHO ========================================================
ECHO [4/4] Starting GovSpark Connect!
ECHO.
ECHO The App will open in your browser shortly...
ECHO If MongoDB is not running, the backend might fail.
ECHO Make sure MongoDB is installed and running!
ECHO ========================================================
ECHO.

call npm run dev

PAUSE
