@echo off
REM Medical AI Chatbot - Complete Startup Script for Windows

color 0A
echo.
echo ========================================
echo   Medical AI Chatbot - Startup Script
echo ========================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Starting Services
echo ========================================
echo.

REM Create new terminal for backend
echo Starting Backend API on port 8000...
start "Medical AI Backend" /d "%cd%" cmd /k "venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Create new terminal for frontend
echo Starting Streamlit GUI on port 8501...
start "Medical AI GUI" /d "%cd%" cmd /k "venv\Scripts\activate.bat && streamlit run streamlit_app.py"

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo Backend API:  http://localhost:8000
echo Streamlit GUI: http://localhost:8501
echo.
echo Both windows will open automatically.
echo Close this window when done.
echo.
pause
