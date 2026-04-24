# 🚀 Quick Start Guide - Medical AI Chatbot GUI

## 30 Second Setup

### Windows
1. Navigate to the `medical-chatbot` folder
2. Double-click `startup.bat`
3. Both services will start automatically
4. Browser windows will open to:
   - Backend: http://localhost:8000
   - GUI: http://localhost:8501

### Linux/Mac
1. Navigate to the `medical-chatbot` folder
2. Run: `chmod +x startup.sh && ./startup.sh`
3. Services will start and the GUI will open

---

## Manual Setup (If Preferred)

### Terminal 1 - Backend API
```bash
cd medical-chatbot
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Terminal 2 - Streamlit GUI
```bash
cd medical-chatbot
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
streamlit run streamlit_app.py
```

---

## Using Docker

### Option 1: Original Setup
```bash
docker-compose up
```

### Option 2: With Streamlit GUI
```bash
docker-compose -f docker-compose.full.yml up
```

Services will be available at:
- Backend API: http://localhost:8000
- Streamlit GUI: http://localhost:8501
- Ollama (LLM): http://localhost:11434

---

## First Run

1. The Streamlit GUI will open automatically in your browser
2. Configuration section in the sidebar will verify API connection
3. Try one of the preset symptom templates (💔 Heart Attack, 🤕 Headache, etc.)
4. Click "🚀 Classify Symptoms" to test

---

## Features Overview

✨ **Beautiful Animated UI** - Smooth gradients and transitions
🔄 **Live API Testing** - Test your backend endpoints
📊 **Result Visualization** - Color-coded severity levels and metrics
📈 **Test History** - Track all classifications with statistics
📥 **Export Data** - Download results as JSON or CSV
🎨 **Dark/Light Mode** - Automatic theme support

---

## Troubleshooting

**GUI won't connect to API?**
- Make sure backend is running on http://localhost:8000
- Check API URL in the sidebar settings

**GUI not starting?**
- Make sure streamlit is installed: `pip install streamlit`
- Try: `streamlit run streamlit_app.py --logger.level=debug`

**Slow response?**
- First query loads models (can take 30+ seconds)
- Subsequent queries are faster (5-10 seconds)

---

## Next Steps

1. Review STREAMLIT_README.md for detailed documentation
2. Customize API endpoint in settings if needed
3. Explore different symptom combinations
4. Export results for analysis

**Happy Testing! 🏥**
