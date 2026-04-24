from sentence_transformers import SentenceTransformer
from fuzzywuzzy import fuzz
from typing import List, Tuple, Dict
import numpy as np

class EmbeddingService:
    """Service for semantic symptom matching using embeddings and fuzzy matching."""
    
    def __init__(self):
        """Initialize the embedding model."""
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Lightweight model
    
    def embed_text(self, text: str) -> np.ndarray:
        """Convert text to embedding vector."""
        return self.model.encode(text)
    
    def embed_symptoms(self, symptoms: List[str]) -> List[np.ndarray]:
        """Convert list of symptoms to embeddings."""
        return [self.embed_text(symptom) for symptom in symptoms]
    
    def semantic_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts (0-1)."""
        embedding1 = self.embed_text(text1)
        embedding2 = self.embed_text(text2)
        # Cosine similarity
        similarity = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )
        return float(max(0.0, similarity))  # Ensure non-negative
    
    def fuzzy_match(self, user_symptom: str, known_symptom: str) -> float:
        """Calculate fuzzy string similarity (0-1)."""
        score = fuzz.token_set_ratio(user_symptom.lower(), known_symptom.lower())
        return score / 100.0
    
    def find_best_matches(
        self,
        user_symptom: str,
        known_symptoms: List[str],
        fuzzy_threshold: float = 0.6,
        semantic_threshold: float = 0.5
    ) -> List[Tuple[str, float]]:
        """
        Find best matching symptoms from known symptoms.
        Uses both fuzzy matching and semantic similarity.
        Returns list of (symptom, combined_score) tuples sorted by score.
        """
        matches = []
        
        for known_symptom in known_symptoms:
            # Get fuzzy match score
            fuzzy_score = self.fuzzy_match(user_symptom, known_symptom)
            
            # Get semantic similarity score
            semantic_score = self.semantic_similarity(user_symptom, known_symptom)
            
            # Combined score (weighted average: 60% semantic, 40% fuzzy)
            combined_score = (semantic_score * 0.6) + (fuzzy_score * 0.4)
            
            # Only include if above threshold
            if combined_score >= max(fuzzy_threshold * 0.5, semantic_threshold * 0.5):
                matches.append((known_symptom, round(combined_score, 3)))
        
        # Sort by score descending
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches
    
    def match_symptoms_to_database(
        self,
        user_symptoms: List[str],
        symptom_database: Dict[str, List[str]]
    ) -> Dict[str, List[Tuple[str, float]]]:
        """
        Match user symptoms to all symptoms in the medical database.
        Returns matched symptoms grouped by department.
        """
        matches_by_dept = {}
        
        for dept, symptom_data in symptom_database.items():
            all_dept_symptoms = (
                symptom_data.get("critical_symptoms", []) +
                symptom_data.get("urgent_symptoms", []) +
                symptom_data.get("emergent_symptoms", [])
            )
            
            dept_matches = []
            for user_symptom in user_symptoms:
                best_matches = self.find_best_matches(user_symptom, all_dept_symptoms)
                dept_matches.extend(best_matches)
            
            # Remove duplicates and keep best score
            unique_matches = {}
            for symptom, score in dept_matches:
                if symptom not in unique_matches or score > unique_matches[symptom]:
                    unique_matches[symptom] = score
            
            if unique_matches:
                matches_by_dept[dept] = sorted(
                    [(s, score) for s, score in unique_matches.items()],
                    key=lambda x: x[1],
                    reverse=True
                )
        
        return matches_by_dept
