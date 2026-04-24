from app.db.vector_db import VectorDB
from app.services.llm_service import LLMService
from app.utils.prompts import classify_symptoms_to_department, get_emergency_recommendation
from typing import Dict, Any, List

class RAGService:
    def __init__(self, vector_db: VectorDB, llm_service: LLMService):
        self.vector_db = vector_db
        self.llm_service = llm_service

    def process_symptoms(self, symptoms: List[str]) -> Dict[str, Any]:
        """Process symptoms through the emergency classification pipeline using RAG."""
        
        if not symptoms or len(symptoms) == 0:
            return {
                "emergency_type": "Non-emergent",
                "department": "General Medicine",
                "symptoms_matched": [],
                "confidence": 0.0,
                "recommendation": "Please provide symptoms for assessment."
            }

        # First, use built-in classification function for accurate symptom matching
        department, emergency_type, matched_symptoms, base_confidence = classify_symptoms_to_department(symptoms)
        
        # Combine symptoms into a query for semantic search
        query = " ".join(symptoms)
        
        # Search for relevant medical documents
        relevant_docs = self.vector_db.search_docs(query, top_k=3)
        
        # Extract document contents
        doc_contents = [doc for doc, score in relevant_docs if score > 0.5]  # Filter by similarity threshold
        
        # Create prompt for LLM to enhance recommendation
        context = "\n".join(doc_contents) if doc_contents else "No specific medical context available."
        
        prompt = f"""
Based on the following medical context and symptoms, provide a brief clinical recommendation.

Medical Context:
{context}

Symptoms: {", ".join(symptoms)}
Classified Department: {department}
Emergency Type: {emergency_type}

Provide a brief, clear recommendation (1-2 sentences) for the patient.
"""
        
        # Get LLM recommendation
        recommendation = get_emergency_recommendation(emergency_type)
        try:
            llm_response = self.llm_service.generate_response(prompt, model=self.llm_service.medical_model)
            # Only use LLM response if it's not an error message and has meaningful content
            if llm_response and len(llm_response.strip()) > 10 and "couldn't generate" not in llm_response.lower():
                recommendation = llm_response.strip()
        except:
            pass  # Fall back to default recommendation
        
        # Use base_confidence from symbol matching, boost to 0.7+ if we got good matches
        confidence = max(base_confidence, 0.7) if matched_symptoms else 0.5
        
        # Validate emergency type
        valid_types = ["Critical", "Urgent", "Emergent", "Non-emergent"]
        if emergency_type not in valid_types:
            emergency_type = "Non-emergent"
        
        return {
            "emergency_type": emergency_type,
            "department": department,
            "symptoms_matched": matched_symptoms if matched_symptoms else symptoms,
            "confidence": round(confidence, 2),
            "recommendation": recommendation
        }