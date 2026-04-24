## n8n Workflow Architecture for MediCare Triage AI

This diagram visualizes the flow of data through an n8n automation pipeline from the perspective of a Medical Chatbot processing patient input.

```mermaid
graph TD
    %% Define styles for nodes
    classDef trigger fill:#F2645B,stroke:#333,stroke-width:2px,color:#fff;
    classDef ai fill:#2B6CB0,stroke:#333,stroke-width:2px,color:#fff;
    classDef db fill:#DD6B20,stroke:#333,stroke-width:2px,color:#fff;
    classDef logic fill:#D69E2E,stroke:#333,stroke-width:2px,color:#fff;
    classDef action fill:#38A169,stroke:#333,stroke-width:2px,color:#fff;

    %% Nodes
    Webhook((Webhook Trigger)):::trigger
    
    ExtractInfo[Extract Patient Info & Symptoms <br/> <i>Set Node</i>]:::logic
    
    CheckDB[(Database Query: Patient History)]:::db
    
    AITriage((AI Agent: LLM Triage)):::ai
    
    IdentifyRisk{Risk Level?}:::logic
    
    Escalate[Escalate to Doctor/Admin <br/> <i>HTTP Request Node</i>]:::action
    
    ScheduleAppt[Book Appointment <br/> <i>Database/API Node</i>]:::action
    
    SendAdvice[Send First-aid Advice]:::action
    
    RespondWeb[Respond to Client <br/> <i>Webhook Response Node</i>]:::action

    %% Flow
    Webhook --> ExtractInfo
    ExtractInfo --> CheckDB
    CheckDB -.-> AITriage
    ExtractInfo --> AITriage
    AITriage --> IdentifyRisk
    
    IdentifyRisk --"High/Emergency"--> Escalate
    IdentifyRisk --"Medium (Requires Doctor)"--> ScheduleAppt
    IdentifyRisk --"Low/Minor Issues"--> SendAdvice
    
    Escalate --> RespondWeb
    ScheduleAppt --> RespondWeb
    SendAdvice --> RespondWeb

```
