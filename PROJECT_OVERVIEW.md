# 🏥 Medinfo — Comprehensive Project Overview & Architecture Blueprint

## 1. Executive Summary

**Medinfo** is an end-to-end healthcare technology solution designed to modernize the patient intake process and consolidate hospital management into a single, unified platform. By integrating a highly responsive React-based front-end with a powerful AI-driven triage backend, Medinfo fundamentally shifts how hospitals handle patient flow. 

The core value proposition lies in its **AI Medical Triage Engine**, which utilizes Retrieval-Augmented Generation (RAG) and local Large Language Models (LLMs) to instantly analyze patient symptoms, assign a severity score, and route the patient to the correct medical department. This reduces human error at the intake desk, drastically cuts down wait times, and ensures critical cases are immediately flagged for emergency care.

---

## 2. Advanced Project Directory Structure

The Medinfo monorepo is meticulously organized to separate the client-side Single Page Application (SPA) from the high-performance Python AI backend.

```text
Medinfo-Hospital-Management-and-AI-Triage-System/
│
├── Hospitalmanagementwebpage/       # 🟢 FRONTEND: React SPA
│   ├── package.json                 # Node dependencies (Vite, Radix UI, Tailwind)
│   ├── vite.config.ts               # Vite build configuration
│   └── src/
│       ├── App.tsx                  # Core routing & authentication guard
│       ├── supabaseClient.ts        # Database connection & auth layer
│       ├── index.css                # Global Tailwind CSS definitions
│       └── components/              # Modular UI Components
│           ├── Auth.tsx             # Supabase Login/Registration
│           ├── Dashboard.tsx        # High-level KPIs and hospital metrics
│           ├── Chatbot.tsx          # Floating AI Triage Widget
│           ├── MedicalRecords.tsx   # EHR Data Visualization
│           └── ui/                  # Reusable Radix UI Primitives
│
├── medical-chatbot/                 # 🔵 BACKEND: AI Triage Engine
│   ├── main.py                      # FastAPI App Initialization
│   ├── requirements.txt             # Python dependencies (FastAPI, ChromaDB)
│   ├── Dockerfile                   # Multi-stage build for FastAPI
│   ├── docker-compose.yml           # Core services (API + ChromaDB)
│   ├── docker-compose.full.yml      # Full stack including Streamlit GUI
│   ├── streamlit_app.py             # Internal testing UI for Triage validation
│   ├── app/
│   │   ├── config.py                # Pydantic Environment Settings
│   │   ├── models/schemas.py        # Pydantic Request/Response validation
│   │   ├── services/
│   │   │   ├── llm_service.py       # Ollama integration (Qwen2/Meditron)
│   │   │   ├── rag_service.py       # Context retrieval and prompt injection
│   │   │   └── embedding_service.py # Sentence-Transformers vectorization
│   │   ├── db/vector_db.py          # ChromaDB persistent client wrapper
│   │   └── utils/prompts.py         # Advanced system prompts for medical context
│   └── data/medical_docs/           # Raw medical context for RAG ingestion
│
├── n8n_workflow_diagram.md          # 🟠 AUTOMATION: Mermaid architecture diagram
├── README.md                        # Quickstart and overview
└── LICENSE                          # MIT License
```

---

## 3. Technical Specifications & Deep Dive

### 3.1. Environment & Infrastructure
* **Operating System Target:** Cross-platform (Windows / Linux / macOS) via Docker
* **Python Version:** `Python 3.10.x` or higher
* **Node.js Version:** `v18.x.x` or higher
* **Primary Databases:** PostgreSQL (Relational via Supabase) & ChromaDB (Vector/Semantic)

### 3.2. Advanced AI & Machine Learning Models
Medinfo relies on an offline, privacy-first RAG pipeline ensuring zero-trust data compliance.

| Component | Technology | Version / Specifics | Purpose |
|---|---|---|---|
| **Text Embeddings** | `sentence-transformers` | `all-MiniLM-L6-v2` | Converts symptom text into 384-dimensional dense vectors for semantic similarity mapping. |
| **Vector Database** | `ChromaDB` | `1.5.5` | Stores embedded medical knowledge and performs sub-millisecond Approximate Nearest Neighbor (ANN) search. |
| **Primary LLM** | `Qwen2` (via Ollama) | `qwen2:7b` | Primary reasoning engine. Extremely capable at following strict JSON-schema instructions for API responses. |
| **Specialized LLM** | `Meditron` (via Ollama) | `meditron:latest` | Open-source LLM specifically pre-trained on comprehensive medical data (PubMed, clinical guidelines). |

### 3.3. Triage Algorithm Payload (Pydantic Schema)
To ensure system stability, the LLM is constrained to return data matching the following JSON schema via the FastAPI endpoint:

```json
{
  "emergency_type": "Critical", // Enum: [Critical, Urgent, Emergent, Non-emergent]
  "department": "Cardiology",   // Enum based on hospital config
  "confidence": 0.94,           // Float: 0.0 to 1.0 representing vector distance + LLM certainty
  "symptoms_matched": ["chest pain", "diaphoresis"], // Extracted entities
  "recommendation": "Activate Code STEMI immediately." // Actionable directive
}
```

---

## 4. Architectural Workflows

### 4.1. The RAG Pipeline Mechanics
The Retrieval-Augmented Generation approach avoids LLM "hallucinations" by grounding responses in verified medical text.
1. **Vectorization:** User symptoms (e.g., "crushing chest pain") are vectorized in memory.
2. **L2 Distance Search:** The vector is compared against `ChromaDB` using Euclidean distance (L2) to retrieve the top-K matching clinical protocols.
3. **Prompt Orchestration:** A dynamic prompt is constructed combining the retrieved documents, the raw symptoms, and strict formatting rules.
4. **Local Inference:** The Ollama engine processes the prompt locally, keeping patient data off the public internet.

### 4.2. n8n Event Orchestration (Workflow Automation)
Medinfo utilizes **n8n** (Node-based automation) to act as the central nervous system connecting the frontend, the AI backend, and hospital staff.

**The Workflow Execution Path:**
1. **Webhook Trigger:** The frontend sends patient intake data to an n8n webhook.
2. **AI Node Request:** n8n sends the raw symptoms to the `POST /classify` FastAPI endpoint.
3. **Logic Gate (Switch Node):**
   * If `emergency_type == Critical`: n8n instantly triggers an SMS/Pager API to the on-call doctor.
   * If `emergency_type == Urgent`: n8n updates the Supabase database to bump the patient to the top of the queue.
   * If `emergency_type == Non-emergent`: n8n automatically schedules a standard appointment.

---

## 5. Security & Compliance Architecture

* **Zero-Cloud Inference:** By running Ollama locally within the hospital intranet, patient symptom data is completely isolated, inherently satisfying HIPAA / GDPR requirements regarding LLM usage.
* **Row Level Security (RLS):** Supabase PostgreSQL policies ensure patients can only execute `SELECT` and `UPDATE` queries on records where `auth.uid() = patient_id`.
* **Stateless API:** The FastAPI AI service is entirely stateless. No patient session data is written to disk by the backend; all state is securely maintained by the authenticated React client.

---

## 6. Future Expansion & Scalability Roadmap

Phase 2 of Medinfo development will focus on scaling the system for multi-tenant hospital networks:
1. **HL7 / FHIR Integration:** Upgrading the Supabase database schema to become fully FHIR compliant, allowing seamless data exchange with legacy Electronic Health Record (EHR) systems (like Epic or Cerner).
2. **Voice-to-Text Triage (Whisper API):** Implementing local audio transcription to allow patients in physical distress to simply speak their symptoms into a microphone or mobile device.
3. **Predictive Resource Allocation:** Implementing time-series forecasting (ARIMA / Prophet) on top of the triage data to predict ICU bed shortages or staffing needs based on seasonal illness trends.
4. **Kubernetes Orchestration:** Migrating from standard Docker Compose to a fully scalable Kubernetes (K8s) cluster, allowing the local Ollama LLM pods to auto-scale based on emergency room traffic.
