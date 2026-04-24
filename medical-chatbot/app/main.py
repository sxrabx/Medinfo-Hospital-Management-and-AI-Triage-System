from fastapi import FastAPI, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_service import RAGService
from app.services.llm_service import LLMService
from app.db.vector_db import VectorDB
import os

app = FastAPI(title="Medical Emergency Chatbot API", version="1.0.0")

# Initialize services
vector_db = VectorDB()
vector_db.load_documents("./data/medical_docs")  # Load docs on startup
llm_service = LLMService()
rag_service = RAGService(vector_db, llm_service)

@app.post("/classify", response_model=ChatResponse)
async def classify_symptoms(request: ChatRequest):
    """Endpoint for symptom classification and department routing."""
    try:
        result = rag_service.process_symptoms(request.symptoms)
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Medical Emergency Classification API",
        "usage": "POST /classify with JSON body: {'symptoms': ['symptom1', 'symptom2', ...]}"
    }

@app.get("/departments")
async def get_departments():
    """Get list of all supported departments."""
    from app.utils.prompts import DEPARTMENT_SYMPTOMS
    return {
        "departments": list(DEPARTMENT_SYMPTOMS.keys())
    }