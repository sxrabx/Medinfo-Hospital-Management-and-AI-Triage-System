import streamlit as st
import requests
import json
from typing import List
import time
from datetime import datetime
import pandas as pd

# Set page config
st.set_page_config(
    page_title="Medical AI Chatbot - Test Interface",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for animations and styling
st.markdown("""
<style>
    /* Main background */
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Smooth animations */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    .animated-title {
        animation: fadeIn 0.8s ease-in-out;
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1rem;
    }
    
    .card-container {
        animation: slideInLeft 0.6s ease-out;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 2rem;
        margin: 1rem 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
        transition: all 0.3s ease;
    }
    
    .card-container:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .result-card {
        animation: slideInRight 0.6s ease-out;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        padding: 2rem;
        margin: 1rem 0;
        color: white;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    .severity-critical {
        animation: pulse 1.5s infinite;
        border-left: 5px solid #ff4757;
    }
    
    .severity-urgent {
        border-left: 5px solid #ffa502;
    }
    
    .severity-emergent {
        border-left: 5px solid #ffc107;
    }
    
    .severity-non-emergent {
        border-left: 5px solid #2ed573;
    }
    
    .metric-box {
        animation: fadeIn 0.8s ease-in-out;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        border-radius: 10px;
        padding: 1.5rem;
        text-align: center;
        margin: 0.5rem;
        border: 1px solid rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
    }
    
    .metric-box:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: bold;
        color: #667eea;
        margin: 0.5rem 0;
    }
    
    .metric-label {
        font-size: 0.9rem;
        color: #666;
        font-weight: 600;
    }
    
    .loading-spinner {
        display: inline-block;
        animation: rotate 1.5s linear infinite;
    }
    
    .success-badge {
        display: inline-block;
        background: linear-gradient(135deg, #2ed573, #26de81);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        animation: slideInLeft 0.5s ease-out;
    }
    
    .symptom-tag {
        display: inline-block;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        margin: 0.3rem;
        font-weight: 500;
        animation: fadeIn 0.5s ease-out;
    }
    
    .sidebar .sidebar-content {
        background: rgba(255, 255, 255, 0.95);
    }
    
    .stTabs [data-baseweb="tab-list"] {
        gap: 2rem;
    }
    
    .stTabs [data-baseweb="tab"] {
        border-radius: 10px 10px 0 0;
    }
    
    /* Input styling */
    .stMultiSelect, .stSelectbox, .stTextInput {
        border-radius: 10px !important;
    }
    
    /* Button styling */
    .stButton > button {
        animation: fadeIn 0.8s ease-out !important;
        border-radius: 10px !important;
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        color: white !important;
        font-weight: 600 !important;
        padding: 0.75rem 2rem !important;
        transition: all 0.3s ease !important;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4) !important;
    }
    
    /* Header styling */
    h1, h2, h3 {
        animation: fadeIn 0.8s ease-in-out;
    }
</style>
""", unsafe_allow_html=True)

# Session state initialization
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "last_response" not in st.session_state:
    st.session_state.last_response = None

# API configuration
try:
    API_BASE_URL = st.secrets.get("API_BASE_URL", "http://localhost:8000")
except:
    API_BASE_URL = "http://localhost:8000"

def get_api_url():
    """Get API URL from sidebar settings"""
    return st.session_state.get("api_url", API_BASE_URL)

def test_api_connection():
    """Test connection to the backend API"""
    try:
        response = requests.get(f"{get_api_url()}/", timeout=5)
        return response.status_code == 200
    except:
        return False

def get_departments():
    """Fetch available departments from API"""
    try:
        response = requests.get(f"{get_api_url()}/departments", timeout=10)
        if response.status_code == 200:
            return response.json().get("departments", [])
    except:
        pass
    return []

def classify_symptoms(symptoms: List[str]):
    """Send symptoms to the backend for classification"""
    try:
        payload = {"symptoms": symptoms}
        response = requests.post(
            f"{get_api_url()}/classify",
            json=payload,
            timeout=60
        )
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"API Error: {response.status_code}")
            return None
    except requests.exceptions.ConnectionError:
        st.error(f"❌ Cannot connect to API at {get_api_url()}")
        st.info("Make sure the backend server is running: `uvicorn app.main:app --reload`")
        return None
    except requests.exceptions.Timeout:
        st.error("⏱️ Request timeout. The server is taking too long to respond.")
        return None
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")
        return None

def get_severity_color(severity: str) -> str:
    """Get color code for severity level"""
    colors = {
        "Critical": "#ff4757",
        "Urgent": "#ffa502",
        "Emergent": "#ffc107",
        "Non-emergent": "#2ed573"
    }
    return colors.get(severity, "#667eea")

def get_severity_emoji(severity: str) -> str:
    """Get emoji for severity level"""
    emojis = {
        "Critical": "🚨",
        "Urgent": "⚠️",
        "Emergent": "⏰",
        "Non-emergent": "✅"
    }
    return emojis.get(severity, "❓")

def display_result(result: dict):
    """Display classification result with beautiful formatting"""
    col1, col2, col3, col4 = st.columns(4)
    
    # Severity indicator
    severity = result.get("emergency_type", "Unknown")
    with col1:
        st.markdown(f"""
        <div class="metric-box">
            <div style="font-size: 2rem;">{get_severity_emoji(severity)}</div>
            <div class="metric-label">Severity</div>
            <div class="metric-value" style="color: {get_severity_color(severity)};">
                {severity}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Department
    with col2:
        st.markdown(f"""
        <div class="metric-box">
            <div style="font-size: 2rem;">🏥</div>
            <div class="metric-label">Department</div>
            <div class="metric-value" style="color: #667eea;">
                {result.get('department', 'N/A')}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Confidence
    confidence = result.get("confidence", 0)
    confidence_pct = round(confidence * 100, 1)
    with col3:
        st.markdown(f"""
        <div class="metric-box">
            <div style="font-size: 2rem;">📊</div>
            <div class="metric-label">Confidence</div>
            <div class="metric-value" style="color: #667eea;">
                {confidence_pct}%
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Symptoms Matched
    with col4:
        matched_count = len(result.get("symptoms_matched", []))
        st.markdown(f"""
        <div class="metric-box">
            <div style="font-size: 2rem;">✓</div>
            <div class="metric-label">Symptoms Matched</div>
            <div class="metric-value" style="color: #667eea;">
                {matched_count}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Recommendation
    st.markdown("---")
    recommendation = result.get("recommendation", "No recommendation available")
    severity_class = f"severity-{severity.lower()}"
    st.markdown(f"""
    <div class="result-card {severity_class}">
        <h3>📋 Clinical Recommendation</h3>
        <p style="font-size: 1.1em; line-height: 1.6;">{recommendation}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Matched symptoms
    if result.get("symptoms_matched"):
        st.markdown("##### 🏷️ Detected Symptoms")
        symptom_html = "".join([f'<span class="symptom-tag">{symptom}</span>' for symptom in result.get("symptoms_matched", [])])
        st.markdown(f"<div>{symptom_html}</div>", unsafe_allow_html=True)

# Main layout
st.markdown('<div class="animated-title">🏥 Medical AI Chatbot - Testing Interface</div>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### ⚙️ Settings")
    
    # API Configuration
    with st.expander("API Configuration", expanded=False):
        api_url = st.text_input(
            "API Base URL",
            value=API_BASE_URL,
            help="Enter the backend API URL"
        )
        st.session_state.api_url = api_url
        
        if st.button("🔗 Test Connection", use_container_width=True, key="test_conn"):
            if test_api_connection():
                st.success("✅ Connected successfully!")
            else:
                st.error("❌ Connection failed")
    
    # Information
    st.markdown("---")
    st.markdown("### ℹ️ Information")
    st.write("""
    **Medical AI Chatbot** v1.0.0
    
    A RAG-powered symptom classification system that:
    - Analyzes patient symptoms
    - Routes to appropriate departments
    - Assesses emergency severity
    - Provides clinical recommendations
    """)
    
    # Sidebar metrics
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Test History", len(st.session_state.chat_history))
    with col2:
        st.metric("Session Active", "✓" if test_api_connection() else "✗")

# Main content
tab1, tab2, tab3 = st.tabs(["🧪 Test Chatbot", "📊 History", "📚 Documentation"])

with tab1:
    col1, col2 = st.columns([3, 1], gap="large")
    
    with col1:
        st.markdown('<div class="card-container">', unsafe_allow_html=True)
        st.markdown("## Test the Medical Chatbot")
        
        # Symptoms input
        st.markdown("### Enter Patient Symptoms")
        
        symptoms_input = st.text_area(
            "Enter symptoms (one per line)",
            placeholder="chest pain\nshortness of breath\ndiaphoresis",
            height=120,
            label_visibility="collapsed"
        )
        
        # Parse symptoms
        symptoms = [s.strip().lower() for s in symptoms_input.split('\n') if s.strip()]
        
        # Display symptom tags
        if symptoms:
            st.markdown("##### Selected Symptoms:")
            symptom_html = "".join([f'<span class="symptom-tag">{symptom}</span>' for symptom in symptoms])
            st.markdown(f"<div>{symptom_html}</div>", unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="card-container">', unsafe_allow_html=True)
        st.markdown("### Quick Actions")
        
        # Preset templates
        if st.button("💔 Heart Attack", use_container_width=True, key="btn_heart"):
            symptoms = ["chest pain", "shortness of breath", "diaphoresis"]
            symptoms_input = "\n".join(symptoms)
        
        if st.button("🤕 Headache", use_container_width=True, key="btn_headache"):
            symptoms = ["severe headache", "neck stiffness", "fever"]
            symptoms_input = "\n".join(symptoms)
        
        if st.button("🤢 GI Issues", use_container_width=True, key="btn_gi"):
            symptoms = ["stomach pain", "nausea", "vomiting"]
            symptoms_input = "\n".join(symptoms)
        
        if st.button("🦷 Dental", use_container_width=True, key="btn_dental"):
            symptoms = ["tooth pain", "swelling", "difficulty chewing"]
            symptoms_input = "\n".join(symptoms)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Submit button
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        if st.button("🚀 Classify Symptoms", use_container_width=True, type="primary", key="btn_classify"):
            if not symptoms:
                st.warning("⚠️ Please enter at least one symptom")
            else:
                with st.spinner("🔍 Analyzing symptoms..."):
                    result = classify_symptoms(symptoms)
                    
                    if result:
                        st.session_state.last_response = result
                        st.session_state.chat_history.append({
                            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                            "symptoms": symptoms,
                            "result": result
                        })
                        
                        time.sleep(0.3)  # Small delay for animation
                        st.success("✅ Classification completed!")
                        st.markdown("---")
                        display_result(result)
    
    # Export result
    if st.session_state.last_response:
        st.markdown("---")
        col1, col2 = st.columns(2)
        with col1:
            json_str = json.dumps(st.session_state.last_response, indent=2)
            st.download_button(
                label="📥 Download JSON",
                data=json_str,
                file_name=f"classification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json",
                use_container_width=True,
                key="dl_json"
            )
        with col2:
            csv_data = pd.DataFrame([{
                "Symptom": ", ".join(symptoms),
                "Emergency Type": st.session_state.last_response.get("emergency_type"),
                "Department": st.session_state.last_response.get("department"),
                "Confidence": st.session_state.last_response.get("confidence"),
                "Recommendation": st.session_state.last_response.get("recommendation")
            }])
            st.download_button(
                label="📊 Download CSV",
                data=csv_data.to_csv(index=False),
                file_name=f"classification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv",
                use_container_width=True,
                key="dl_csv"
            )

with tab2:
    st.markdown("## 📊 Test History")
    
    if st.session_state.chat_history:
        # Summary metrics
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Tests", len(st.session_state.chat_history))
        with col2:
            avg_confidence = sum([h["result"].get("confidence", 0) for h in st.session_state.chat_history]) / len(st.session_state.chat_history)
            st.metric("Avg Confidence", f"{round(avg_confidence * 100, 1)}%")
        with col3:
            departments = set([h["result"].get("department", "Unknown") for h in st.session_state.chat_history])
            st.metric("Departments Routed", len(departments))
        
        st.markdown("---")
        
        # History table
        history_data = []
        for entry in st.session_state.chat_history:
            history_data.append({
                "Time": entry["timestamp"],
                "Symptoms": ", ".join(entry["symptoms"]),
                "Department": entry["result"].get("department"),
                "Severity": entry["result"].get("emergency_type"),
                "Confidence": f"{round(entry['result'].get('confidence', 0) * 100, 1)}%"
            })
        
        df = pd.DataFrame(history_data)
        st.dataframe(df, use_container_width=True, hide_index=True, key="history_df")
        
        # Clear history
        if st.button("🗑️ Clear History", use_container_width=True, key="btn_clear"):
            st.session_state.chat_history = []
            st.rerun()
    else:
        st.info("📝 No test history yet. Run some tests to see them here!")

with tab3:
    st.markdown("## 📚 API Documentation")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### Endpoints
        
        #### POST /classify
        Classify patient symptoms and get routing recommendations.
        
        **Request:**
        ```json
        {
            "symptoms": ["chest pain", "shortness of breath"]
        }
        ```
        
        **Response:**
        ```json
        {
            "emergency_type": "Critical",
            "department": "Cardiology",
            "symptoms_matched": ["chest pain"],
            "confidence": 0.95,
            "recommendation": "..."
        }
        ```
        """)
    
    with col2:
        st.markdown("""
        ### Response Fields
        
        - **emergency_type**: Severity level
          - 🚨 Critical
          - ⚠️ Urgent
          - ⏰ Emergent
          - ✅ Non-emergent
        
        - **department**: Recommended department
        - **symptoms_matched**: Symptoms found in database
        - **confidence**: Confidence score (0-1)
        - **recommendation**: Clinical guidance
        """)
    
    st.markdown("---")
    st.markdown("### Severity Levels")
    
    severity_info = {
        "🚨 Critical": "Immediate life-threatening situation requiring emergency intervention",
        "⚠️ Urgent": "Serious condition requiring prompt medical evaluation",
        "⏰ Emergent": "Significant condition requiring evaluation within hours",
        "✅ Non-emergent": "Condition suitable for routine medical care"
    }
    
    for severity, description in severity_info.items():
        st.info(f"**{severity}** - {description}")
