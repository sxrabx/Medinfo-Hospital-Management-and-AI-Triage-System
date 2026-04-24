# 🏥 Medinfo — Comprehensive Project Overview

## 1. Executive Summary

**Medinfo** is an end-to-end healthcare technology solution designed to modernize the patient intake process and consolidate hospital management into a single, unified platform. By integrating a highly responsive React-based front-end with a powerful AI-driven triage backend, Medinfo fundamentally shifts how hospitals handle patient flow. 

The core value proposition lies in its **AI Medical Triage Engine**, which utilizes Retrieval-Augmented Generation (RAG) and local Large Language Models (LLMs) to instantly analyze patient symptoms, assign a severity score, and route the patient to the correct medical department. This reduces human error at the intake desk, drastically cuts down wait times, and ensures critical cases are immediately flagged for emergency care.

---

## 2. Problem Statement & Solution

### The Problem
- **Triage Bottlenecks:** Emergency departments often suffer from severe bottlenecks due to manual triage processes, leading to delayed care for critical patients.
- **Fragmented Systems:** Hospitals typically use disparate systems for appointments, medical records, test booking, and billing, leading to data silos and administrative overhead.
- **Data Privacy Concerns:** Sending sensitive medical symptoms to cloud-based LLMs (like OpenAI) poses significant HIPAA/GDPR compliance risks.

### The Solution
- **Automated AI Triage:** Medinfo provides a chatbot widget where patients input their symptoms. The AI instantly categorizes the severity (Critical, Urgent, Emergent, Non-emergent).
- **Unified Hospital Portal:** A sleek, centralized SPA (Single Page Application) that handles everything from doctor directories to billing and test bookings.
- **Local AI Inference:** By utilizing local LLMs via Ollama, Medinfo ensures that **no sensitive patient data leaves the hospital's internal network**, maintaining strict data privacy compliance.

---

## 3. Technical Specifications

### 3.1. Development Environment
* **Operating System Target:** Windows / Linux / macOS (via Docker)
* **Python Version:** `Python 3.10.x` or higher (tested on 3.10)
* **Node.js Version:** `v18.x.x` or higher
* **Database Engine:** PostgreSQL (via Supabase) & ChromaDB (Vector)

### 3.2. AI & Machine Learning Models
Medinfo relies on an offline, privacy-first RAG pipeline.

| Component | Model / Technology | Version / Specifics | Purpose |
|---|---|---|---|
| **Text Embeddings** | `sentence-transformers` | `all-MiniLM-L6-v2` | Converts symptom text and medical knowledge base documents into dense vector representations. |
| **Vector Database** | `ChromaDB` | `1.5.5` | Stores embedded medical knowledge and performs sub-millisecond semantic similarity searches to retrieve context. |
| **Primary LLM** | `Qwen2` (via Ollama) | `qwen2:7b` | General purpose medical reasoning and structuring the JSON response. |
| **Specialized LLM** | `Meditron` (via Ollama) | `meditron:latest` | (Optional) Domain-specific model fine-tuned entirely on clinical guidelines and PubMed data. |

### 3.3. Core Technology Stack

**Frontend Architecture (Client-Side)**
* **Framework:** React 18
* **Build Tool:** Vite 6
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **UI Components:** Radix UI primitives (fully accessible, ARIA-compliant)
* **Data Visualization:** Recharts
* **State Management:** React Hooks + Supabase Realtime

**Backend Architecture (Server-Side & AI)**
* **Framework:** FastAPI 0.104
* **Server:** Uvicorn 0.24.0
* **Data Validation:** Pydantic v2
* **Workflow Automation:** n8n (Node-based workflow automation for alerts and DB syncing)
* **Testing UI:** Streamlit 1.28+

---

## 4. Architectural Deep Dive

### 4.1. The RAG Pipeline (Retrieval-Augmented Generation)
1. **Ingestion:** Medical documents (stored in `data/medical_docs`) are parsed and chunked. The `sentence-transformers` model creates embeddings, which are stored in `ChromaDB`.
2. **Retrieval:** When a user enters a symptom (e.g., "crushing chest pain radiating to the left arm"), the symptom is embedded and queried against ChromaDB to find the 3 most clinically relevant documents.
3. **Generation:** The retrieved documents and the user's symptoms are injected into a highly specific system prompt.
4. **Inference:** The local Ollama LLM evaluates the prompt and outputs a strictly formatted JSON object containing the department routing and severity score.

### 4.2. Hospital Management Module
The React frontend acts as the control center. It communicates heavily with **Supabase**.
* **Authentication:** Handled via Supabase Auth (JWT tokens, session persistence).
* **Role-Based Access Control:** Differentiates views between Patients, Doctors, and Admins.
* **Emergency Override:** Features a persistent, global Emergency SOS state that bypasses standard queues.

---

## 5. Security & Compliance Strategy

* **Zero-Cloud Inference:** By running Ollama locally within the hospital intranet, patient symptom data is completely isolated.
* **Environment Isolation:** Configuration secrets (like database URLs and API keys) are strictly managed via `.env` files and never committed to version control.
* **Authentication:** Supabase provides industry-standard security policies (Row Level Security - RLS) to ensure patients can only access their own medical records.

---

## 6. Future Expansion Roadmap

Phase 2 of Medinfo development will focus on:
1. **HL7 / FHIR Integration:** Ensuring the system can natively communicate with legacy Electronic Health Record (EHR) systems used by major hospitals.
2. **Voice-to-Text Triage:** Implementing Web Speech API or Whisper to allow patients in distress to simply speak their symptoms.
3. **Predictive Resource Allocation:** Analyzing triage data over time to predict ICU bed shortages before they happen.
4. **Mobile Native Application:** Porting the React web application to React Native for iOS and Android deployment.
