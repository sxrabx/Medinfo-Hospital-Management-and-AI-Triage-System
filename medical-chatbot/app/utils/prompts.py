# Department and Emergency Classification System
DEPARTMENT_SYMPTOMS = {
    "Emergency/Trauma": {
        "critical_symptoms": [
            "chest pain", "severe chest pain", "difficulty breathing", "shortness of breath", "SOB",
            "unconscious", "severe bleeding", "unresponsive", "choking", "cardiac arrest",
            "heart attack", "stroke", "severe burn", "severe trauma"
        ],
        "urgent_symptoms": [
            "severe abdominal pain", "acute abdominal pain", "signs of stroke", "slurred speech",
            "facial drooping", "arm weakness", "severe allergic reaction"
        ]
    },
    "Cardiology": {
        "critical_symptoms": [
            "acute chest pain", "severe chest pressure", "chest tightness", "cardiac symptoms"
        ],
        "urgent_symptoms": [
            "irregular heartbeat", "palpitations", "chest discomfort", "heart palpitations",
            "arrhythmia", "hypertension crisis"
        ],
        "emergent_symptoms": [
            "elevated blood pressure", "chest heaviness", "shortness of breath with chest pain"
        ]
    },
    "Neurology": {
        "critical_symptoms": [
            "severe headache", "thunderclap headache", "sudden severe headache", "seizure", "seizures",
            "loss of consciousness", "severe head trauma"
        ],
        "urgent_symptoms": [
            "persistent headache", "migraine", "dizziness", "vertigo", "balance problems",
            "numbness", "tingling", "weakness in limbs"
        ],
        "emergent_symptoms": [
            "headache", "tension headache", "mild dizziness", "mild numbness"
        ]
    },
    "Gastroenterology": {
        "critical_symptoms": [
            "severe abdominal bleeding", "uncontrolled vomiting", "severe dehydration"
        ],
        "urgent_symptoms": [
            "severe abdominal pain", "acute stomach pain", "severe diarrhea", "persistent vomiting",
            "bloody vomit", "black stool", "melena"
        ],
        "emergent_symptoms": [
            "abdominal discomfort", "stomach pain", "nausea", "diarrhea", "constipation",
            "acid reflux", "indigestion", "heartburn"
        ]
    },
    "Orthopedics": {
        "urgent_symptoms": [
            "severe fracture", "compound fracture", "severe joint dislocation", "severe bone fracture",
            "multiple fractures"
        ],
        "emergent_symptoms": [
            "fracture", "broken bone", "sprain", "strain", "joint pain", "muscle pain",
            "sports injury", "fall injury"
        ]
    },
    "Psychiatry": {
        "critical_symptoms": [
            "suicidal ideation", "suicidal thoughts", "intent to harm", "severe depression",
            "acute psychosis", "hallucinations", "delusions"
        ],
        "urgent_symptoms": [
            "depression", "anxiety", "panic attack", "severe anxiety", "acute stress reaction"
        ],
        "emergent_symptoms": [
            "stress", "mild anxiety", "insomnia", "mood changes"
        ]
    },
    "Pulmonology": {
        "critical_symptoms": [
            "severe respiratory distress", "respiratory failure", "asthma attack severe"
        ],
        "urgent_symptoms": [
            "severe cough", "wheezing", "shortness of breath", "asthma attack", "bronchitis",
            "pneumonia symptoms", "persistent cough", "hemoptysis"
        ],
        "emergent_symptoms": [
            "mild cough", "cold", "congestion", "sore throat", "mild wheezing"
        ]
    },
    "Dermatology": {
        "emergent_symptoms": [
            "rash", "severe rash", "hives", "urticaria", "eczema", "psoriasis", "fungal infection",
            "severe itching", "skin infection", "allergic reaction", "contact dermatitis"
        ]
    },
    "Infectious Disease": {
        "urgent_symptoms": [
            "high fever", "severe fever", "fever with chills", "sepsis symptoms"
        ],
        "emergent_symptoms": [
            "fever", "flu symptoms", "cold symptoms", "infection signs", "wound infection",
            "mild fever"
        ]
    },
    "Ophthalmology": {
        "critical_symptoms": [
            "sudden vision loss", "eye trauma", "chemical eye burn", "retinal detachment"
        ],
        "urgent_symptoms": [
            "severe eye pain", "eye pain", "blurred vision", "floaters", "flashes of light",
            "severe redness"
        ]
    },
    "ENT (Otolaryngology)": {
        "emergent_symptoms": [
            "sore throat", "earache", "ear pain", "hearing loss", "tinnitus", "nasal congestion",
            "sinusitis", "hoarseness", "voice loss"
        ]
    },
    "Dentistry": {
        "urgent_symptoms": [
            "severe tooth pain", "severe dental pain", "dental abscess", "swollen jaw",
            "dental trauma", "tooth knocked out", "fractured tooth", "severe gum infection"
        ],
        "emergent_symptoms": [
            "tooth pain", "toothache", "cavities", "gum pain", "gum bleeding", "dental cavity",
            "broken tooth", "chipped tooth", "gum disease", "bleeding gums", "plaque buildup"
        ]
    },
    "General Medicine": {
        "emergent_symptoms": [
            "general illness", "fatigue", "weakness", "malaise", "general check-up"
        ]
    }
}

EMERGENCY_SEVERITY = {
    "Critical": {
        "description": "Life-threatening condition requiring immediate emergency intervention",
        "action": "Call 911 immediately or go to nearest ER"
    },
    "Urgent": {
        "description": "Serious condition requiring urgent medical evaluation",
        "action": "Visit ER or urgent care immediately"
    },
    "Emergent": {
        "description": "Condition requiring prompt medical evaluation",
        "action": "Visit urgent care or schedule same-day appointment"
    },
    "Non-emergent": {
        "description": "Condition that can be evaluated at primary care",
        "action": "Schedule appointment with primary care physician"
    }
}

def classify_emergency_level(matched_critical: bool, matched_urgent: bool, matched_emergent: bool) -> str:
    """Classify emergency severity based on matched symptoms."""
    if matched_critical:
        return "Critical"
    elif matched_urgent:
        return "Urgent"
    elif matched_emergent:
        return "Emergent"
    else:
        return "Non-emergent"

def get_emergency_recommendation(emergency_type: str) -> str:
    """Get recommendation based on emergency type."""
    return EMERGENCY_SEVERITY.get(emergency_type, EMERGENCY_SEVERITY["Non-emergent"])["action"]

def classify_symptoms_to_department(symptoms: list) -> tuple:
    """
    Classify symptoms to appropriate department using enhanced string matching.
    Returns: (department, emergency_level, matched_symptoms, confidence)
    """
    if not symptoms:
        return "General Medicine", "Non-emergent", [], 0.0
    
    def simple_similarity(s1: str, s2: str) -> float:
        """Calculate simple string similarity using token overlap."""
        s1_tokens = set(s1.lower().split())
        s2_tokens = set(s2.lower().split())
        
        if not s1_tokens or not s2_tokens:
            return 0.0
        
        intersection = len(s1_tokens & s2_tokens)
        union = len(s1_tokens | s2_tokens)
        return intersection / union if union > 0 else 0.0
    
    department_scores = {}
    
    # Score each department based on string matching
    for dept, symptom_data in DEPARTMENT_SYMPTOMS.items():
        critical_match = False
        urgent_match = False
        emergent_match = False
        matched_symptoms_dict = {}
        total_score = 0
        
        # Get all symptoms for this department
        critical_symptoms = symptom_data.get("critical_symptoms", [])
        urgent_symptoms = symptom_data.get("urgent_symptoms", [])
        emergent_symptoms = symptom_data.get("emergent_symptoms", [])
        
        # Match each user symptom to department symptoms
        for user_symptom in symptoms:
            user_symptom_lower = user_symptom.lower()
            
            # Check critical symptoms (threshold 0.5)
            for dept_symptom in critical_symptoms:
                # Check for substring match or token overlap
                if user_symptom_lower in dept_symptom.lower() or dept_symptom.lower() in user_symptom_lower:
                    similarity = 0.9
                else:
                    similarity = simple_similarity(user_symptom, dept_symptom)
                
                if similarity > 0.5:
                    if dept_symptom not in matched_symptoms_dict:
                        matched_symptoms_dict[dept_symptom] = similarity
                    total_score += 3 * similarity
                    critical_match = True
            
            # Check urgent symptoms (threshold 0.45)
            for dept_symptom in urgent_symptoms:
                if user_symptom_lower in dept_symptom.lower() or dept_symptom.lower() in user_symptom_lower:
                    similarity = 0.9
                else:
                    similarity = simple_similarity(user_symptom, dept_symptom)
                
                if similarity > 0.45:
                    if dept_symptom not in matched_symptoms_dict:
                        matched_symptoms_dict[dept_symptom] = similarity
                    total_score += 2 * similarity
                    urgent_match = True
            
            # Check emergent symptoms (threshold 0.4)
            for dept_symptom in emergent_symptoms:
                if user_symptom_lower in dept_symptom.lower() or dept_symptom.lower() in user_symptom_lower:
                    similarity = 0.9
                else:
                    similarity = simple_similarity(user_symptom, dept_symptom)
                
                if similarity > 0.4:
                    if dept_symptom not in matched_symptoms_dict:
                        matched_symptoms_dict[dept_symptom] = similarity
                    total_score += 1 * similarity
                    emergent_match = True
        
        if total_score > 0:
            emergency_level = classify_emergency_level(critical_match, urgent_match, emergent_match)
            # Sort matched symptoms by score
            sorted_matches = sorted(matched_symptoms_dict.items(), key=lambda x: x[1], reverse=True)
            department_scores[dept] = {
                "score": total_score,
                "matched_symptoms": [symptom for symptom, score in sorted_matches],
                "emergency_level": emergency_level
            }
    
    # Get best matching department
    if not department_scores:
        return "General Medicine", "Non-emergent", [], 0.0
    
    best_dept = max(department_scores, key=lambda x: department_scores[x]["score"])
    best_match = department_scores[best_dept]
    
    # Calculate confidence (0-1)
    max_possible_score = 3 * len(symptoms) * 5  # Max is critical symptoms × users symptoms
    confidence = min(1.0, best_match["score"] / max_possible_score if max_possible_score > 0 else 0)
    
    return best_dept, best_match["emergency_level"], best_match["matched_symptoms"], confidence