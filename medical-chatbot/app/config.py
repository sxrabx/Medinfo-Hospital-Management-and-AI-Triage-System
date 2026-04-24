import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "qwen2")
    MEDICAL_MODEL_NAME: str = os.getenv("MEDICAL_MODEL_NAME", "meditron:latest")
    VECTOR_DB_PATH: str = os.getenv("VECTOR_DB_PATH", "./data/vector_db")