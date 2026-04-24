from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    symptoms: List[str]  # List of symptoms provided by user

class ChatResponse(BaseModel):
    emergency_type: str  # Severity level: Critical, Urgent, Emergent, Non-emergent
    department: str  # Department to route to
    symptoms_matched: List[str]  # Symptoms matched in the database
    confidence: float  # Confidence score (0-1)
    recommendation: str  # Medical recommendation