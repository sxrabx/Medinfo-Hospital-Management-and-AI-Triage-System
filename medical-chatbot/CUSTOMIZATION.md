# 🎨 Streamlit GUI - Customization Guide

## Overview

The Streamlit app is fully customizable. This guide will help you modify colors, animations, features, and more.

---

## 🎨 Customizing Colors

### Edit the CSS in `streamlit_app.py`

Find the `st.markdown()` section with the custom CSS and modify:

```python
# Primary colors (gradient)
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
# Change to your preferred colors, e.g.:
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
```

### Severity Colors
```python
"Critical": "#ff4757",    # Red - change this
"Urgent": "#ffa502",      # Orange
"Emergent": "#ffc107",    # Yellow
"Non-emergent": "#2ed573" # Green
```

---

## ✨ Adding New Animations

### 1. Define animation in CSS

```python
st.markdown("""
<style>
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    .bounce-element {
        animation: bounce 0.5s ease-in-out;
    }
</style>
""", unsafe_allow_html=True)
```

### 2. Apply animation to element

```python
st.markdown("""
<div class="bounce-element">
    Your content here
</div>
""", unsafe_allow_html=True)
```

---

## 🧪 Adding New Preset Templates

In the "Quick Actions" section of `tab1`, add:

```python
if st.button("🌡️ Fever", use_container_width=True):
    symptoms = ["high fever", "headache", "body aches"]
    symptoms_input = "\n".join(symptoms)
```

---

## 📊 Customizing Result Display

Edit the `display_result()` function to change how results are shown:

```python
def display_result(result: dict):
    # Modify color scheme
    if result.get("confidence") > 0.9:
        color = "#2ed573"  # Green for high confidence
    else:
        color = "#ffc107"  # Yellow for medium
    
    # Add custom metrics
    st.metric("My Custom Metric", result.get("custom_field", "N/A"))
```

---

## 🔧 Changing Theme Settings

Edit `.streamlit/config.toml`:

```toml
[theme]
primaryColor = "#667eea"          # Main accent color
backgroundColor = "#f5f5f5"        # Main background
secondaryBackgroundColor = "#f0f2f6" # Card backgrounds
textColor = "#262730"             # Text color
font = "sans serif"               # Font family
```

### Pre-built color schemes:

**Dark Theme:**
```toml
backgroundColor = "#0e1117"
secondaryBackgroundColor = "#161b22"
textColor = "#c9d1d9"
primaryColor = "#58a6ff"
```

**Ocean Theme:**
```toml
primaryColor = "#0ea5e9"
backgroundColor = "#f0f9ff"
secondaryBackgroundColor = "#e0f2fe"
textColor = "#0c4a6e"
```

---

## 📱 Layout Customization

### Change column ratios:
```python
col1, col2 = st.columns([2, 1])  # 2:1 ratio
# or
col1, col2, col3 = st.columns([1, 1, 1])  # Equal
```

### Change spacing:
```python
st.columns([1, 1], gap="small")   # small, medium, large
```

---

## 🔌 Adding New API Endpoints

1. Add endpoint to your backend (app/main.py)
2. Create a function in streamlit app:

```python
def call_new_endpoint(param):
    try:
        response = requests.post(
            f"{get_api_url()}/new-endpoint",
            json={"param": param},
            timeout=10
        )
        return response.json()
    except Exception as e:
        st.error(f"Error: {str(e)}")
        return None
```

3. Use in your UI:
```python
if st.button("New Feature"):
    result = call_new_endpoint("value")
    if result:
        st.success("Success!")
        st.write(result)
```

---

## 📈 Adding Charts and Visualizations

### Using Plotly (recommended):
```python
import plotly.graph_objects as go

# Simple bar chart
fig = go.Figure(data=[
    go.Bar(x=['Critical', 'Urgent', 'Emergent'], y=[10, 15, 20])
])
st.plotly_chart(fig, use_container_width=True)
```

### Using Matplotlib:
```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [1, 2, 3])
st.pyplot(fig)
```

---

## 🔐 Adding Authentication

Add to the top of `streamlit_app.py`:

```python
import streamlit_authenticator as stauth

authenticator = stauth.Authenticate(
    # ... configuration
)

name, authentication_status, username = authenticator.login()

if authentication_status:
    # Your app here
    pass
elif authentication_status is False:
    st.error('Username/password is incorrect')
else:
    st.warning('Please enter your username and password')
```

Install: `pip install streamlit-authenticator`

---

## 🌍 Internationalization (i18n)

Add language support:

```python
TRANSLATIONS = {
    "en": {
        "title": "Medical AI Chatbot",
        "symptoms": "Enter symptoms",
    },
    "es": {
        "title": "Chatbot de IA Médica",
        "symptoms": "Ingrese síntomas",
    }
}

language = st.selectbox("Language", list(TRANSLATIONS.keys()))
st.title(TRANSLATIONS[language]["title"])
```

---

## 🎯 Performance Optimization

### 1. Cache expensive functions:
```python
@st.cache_data
def get_departments():
    """Fetch departments (cached for 1 hour)"""
    return requests.get(f"{get_api_url()}/departments").json()
```

### 2. Use session state efficiently:
```python
if "expensive_result" not in st.session_state:
    st.session_state.expensive_result = compute_expensive_operation()
```

### 3. Lazy load content:
```python
with st.expander("Advanced Options"):
    # Only loaded when expanded
    st.write("Advanced settings here")
```

---

## 🧪 Testing Your Changes

1. **Hot Reload**: Streamlit automatically reloads when you save
2. **Debug Mode**: Add print statements
3. **Browser Console**: Check for JavaScript errors (F12)

```python
# Debug output
st.write("Debug:", st.session_state)
```

---

## 📚 Directory Structure After Customization

```
medical-chatbot/
├── streamlit_app.py          # Main app
├── custom_components.py      # (New) Custom widgets
├── styles.py                 # (New) Style definitions
├── config.py                 # (New) App configuration
├── .streamlit/
│   ├── config.toml          # Theme settings
│   └── secrets.toml         # (Optional) API keys
├── app/                     # Backend
└── data/                    # Data files
```

---

## 🚀 Advanced Features to Add

1. **Real-time Chat**: Replace button with input streaming
2. **Patient History**: Store and retrieve patient records
3. **Analytics Dashboard**: Track metrics over time
4. **PDF Report Generation**: Export detailed reports
5. **Multi-language Support**: Support multiple languages
6. **Voice Input**: Add speech-to-text for symptoms
7. **Image Upload**: Analyze medical images
8. **Database Integration**: Store results persistently

---

## 📖 Useful Streamlit Resources

- Official Docs: https://docs.streamlit.io
- Component Gallery: https://streamlit.io/components
- Cheat Sheet: https://docs.streamlit.io/library/cheatsheet

---

## 💡 Tips & Tricks

1. **Use columns for layout** - Better than hardcoding widths
2. **Cache everything possible** - Improves performance
3. **Use expanders for options** - Keeps UI clean
4. **Test on mobile** - Use `st.query_params` for responsive design
5. **Monitor logs** - Check terminal for errors

---

## 🐛 Common Issues & Solutions

### Issue: CSS not applying
**Solution**: Use `unsafe_allow_html=True` in `st.markdown()`

### Issue: State not persisting
**Solution**: Use `st.session_state` instead of global variables

### Issue: Slow performance
**Solution**: Add `@st.cache_data` decorators to expensive functions

### Issue: API calls too frequent
**Solution**: Add rate limiting or caching

---

## 📞 Support

For issues or questions:
1. Check Streamlit documentation
2. Review the app code comments
3. Check API endpoint responses
4. Monitor browser console (F12)

**Happy Customizing! 🎨**
