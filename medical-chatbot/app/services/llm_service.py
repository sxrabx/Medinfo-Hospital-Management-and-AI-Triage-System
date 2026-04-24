import requests
from app.config import Config

class LLMService:
    def __init__(self):
        self.base_url = Config.OLLAMA_BASE_URL
        self.default_model = Config.MODEL_NAME
        self.medical_model = Config.MEDICAL_MODEL_NAME

    def generate_response(self, prompt: str, model: str = None) -> str:
        """Call Ollama API to generate response."""
        if model is None:
            model = self.default_model
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data.get("response", "").strip()
        except requests.RequestException as e:
            print(f"Error calling Ollama API: {e}")
            return "I'm sorry, I couldn't generate a response at this time. Please try again later."