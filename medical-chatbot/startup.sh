#!/bin/bash

# Medical AI Chatbot - Complete Startup Script for Linux/Mac

echo ""
echo "========================================"
echo "   Medical AI Chatbot - Startup Script"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "   Starting Services"
echo "========================================"
echo ""

# Start backend in background
echo "Starting Backend API on port 8000..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Streamlit
echo "Starting Streamlit GUI on port 8501..."
streamlit run streamlit_app.py

# Clean up
kill $BACKEND_PID 2>/dev/null
