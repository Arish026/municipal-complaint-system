# Data Flow Diagram (DFD) — Level 1 (Diagram 0)

**Project**: Municipal Complaint Management System (MCMS)  
**Standard**: Gane-Sarson / Yourdon-DeMarco Decomposition Modeling  
**Course Reference**: University of Karachi — BS Computer Science — Database Management Systems (DBMS)

---

## 1. Overview & Decomposition

The **Level 1 Data Flow Diagram (Diagram 0)** decomposes the central system (`Process 0`) into five specialized core processes and introduces the five persistent relational data stores (`D1` through `D5`). All external inputs and outputs strictly balance with the Level 0 Context Diagram.

---

## 2. Visual Level 1 Diagram

```mermaid
flowchart TB
    %% External Entities
    subgraph ENTITIES ["External Stakeholders"]
        CITIZEN["👤 CITIZEN"]
        STAFF["👷 MUNICIPAL STAFF"]
        ADMIN["🏛️ MUNICIPAL ADMINISTRATION"]
    end

    %% Internal Processes
    subgraph PROCESSES ["Core System Processes"]
        P1(("1.0<br/>MANAGE<br/>CITIZENS"))
        P2(("2.0<br/>REGISTER<br/>COMPLAINTS"))
        P3(("3.0<br/>ASSIGN<br/>DEPT & WORK"))
        P4(("4.0<br/>UPDATE<br/>COMPLAINT<br/>STATUS"))
        P5(("5.0<br/>GENERATE<br/>REPORTS"))
    end

    %% Data Stores
    subgraph STORES ["Persistent Data Stores"]
        D1[("D1: CITIZEN RECORDS")]
        D2[("D2: COMPLAINT RECORDS")]
        D3[("D3: DEPARTMENT RECORDS")]
        D4[("D4: STAFF RECORDS")]
        D5[("D5: WORK ORDER RECORDS")]
    end

    %% Process 1.0 Flows
    CITIZEN -- "REGISTRATION DETAILS" --> P1
    P1 -- "NEW CITIZEN" --> D1

    %% Process 2.0 Flows
    CITIZEN -- "COMPLAINT DETAILS" --> P2
    D1 -. "CITIZEN DETAILS" .-> P2
    D3 -. "DEPT DETAILS" .-> P2
    P2 -- "NEW COMPLAINT" --> D2
    P2 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>CORRECTION MESSAGE" --> CITIZEN

    %% Process 3.0 Flows
    D2 -. "COMPLAINT" .-> P3
    D3 -. "DEPT DETAILS" .-> P3
    D4 -. "STAFF DETAILS" .-> P3
    ADMIN -- "DEPARTMENT & STAFF INFORMATION" --> P3
    P3 -- "WORK ORDER" --> D5
    P3 -- "ASSIGNED COMPLAINTS,<br/>WORK ORDERS, TASK DETAILS" --> STAFF

    %% Process 4.0 Flows
    STAFF -- "WORK UPDATES, ACTION TAKEN,<br/>COMPLETION INFORMATION" --> P4
    CITIZEN -- "COMPLAINT INQUIRY" --> P4
    P4 -- "STATUS" --> D2
    P4 -- "WORK PROGRESS" --> D5
    P4 -- "STATUS INFORMATION,<br/>RESOLUTION INFORMATION" --> CITIZEN

    %% Process 5.0 Flows
    ADMIN -- "REPORTING REQUESTS" --> P5
    D1 -. "REPORT DATA" .-> P5
    D2 -. "REPORT DATA" .-> P5
    D3 -. "REPORT DATA" .-> P5
    D4 -. "REPORT DATA" .-> P5
    D5 -. "REPORT DATA" .-> P5
    P5 -- "COMPLAINT REPORTS,<br/>DEPARTMENT PERFORMANCE,<br/>PENDING WORK SUMMARY" --> ADMIN

    %% Custom Styling
    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef store fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;

    class CITIZEN,STAFF,ADMIN entity;
    class P1,P2,P3,P4,P5 process;
    class D1,D2,D3,D4,D5 store;
```

---

## 3. Process Directory (1.0 - 5.0)

| Process ID | Process Name | Objectives & Core Responsibilities | Inbound Flows | Outbound Flows | Data Stores Accessed |
|---|---|---|---|---|---|
| **1.0** | **MANAGE CITIZENS** | Validates and registers new citizen profiles; prevents duplicate mobile accounts. | `REGISTRATION DETAILS` (from Citizen) | `NEW CITIZEN` | **Writes** `D1: CITIZEN RECORDS` |
| **2.0** | **REGISTER COMPLAINTS** | Validates complaint narrative, determines category, binds department, issues tracking ticket ID. | `COMPLAINT DETAILS`, `CITIZEN DETAILS`, `DEPT DETAILS` | `NEW COMPLAINT`, `COMPLAINT NUMBER & ACKNOWLEDGMENT`, `CORRECTION MESSAGE` | **Reads** `D1`, `D3`<br/>**Writes** `D2: COMPLAINT RECORDS` |
| **3.0** | **ASSIGN DEPARTMENT AND WORK** | Evaluates pending complaints, matches qualified technician, generates work orders, updates staff roster. | `COMPLAINT`, `DEPT DETAILS`, `STAFF DETAILS`, `ADMIN INFO` | `WORK ORDER`, `ASSIGNED COMPLAINTS`, `WORK ORDERS`, `TASK DETAILS` | **Reads** `D2`, `D3`, `D4`<br/>**Writes** `D5: WORK ORDER RECORDS` |
| **4.0** | **UPDATE COMPLAINT STATUS** | Logs field progress, records actions taken, completes tickets, answers citizen live tracking requests. | `WORK UPDATES`, `ACTION TAKEN`, `COMPLETION INFO`, `COMPLAINT INQUIRY` | `STATUS`, `WORK PROGRESS`, `STATUS INFORMATION`, `RESOLUTION INFORMATION` | **Reads/Writes** `D2`, `D5` |
| **5.0** | **GENERATE REPORTS** | Aggregates municipal performance, SLA compliance, pending work backlogs, and departmental metrics. | `REPORTING REQUESTS`, records from `D1` through `D5` | `COMPLAINT REPORTS`, `DEPARTMENT PERFORMANCE`, `PENDING WORK SUMMARY` | **Reads** `D1`, `D2`, `D3`, `D4`, `D5` |

---

## 4. Data Store Directory (D1 - D5)

| Store ID | Physical Entity Name | Description | Key Attributes Stored | Accessing Processes |
|---|---|---|---|---|
| **D1** | `CITIZEN` | Master registry of verified municipal citizens. | `Citizen_ID (PK)`, `Name`, `Phone (UK)`, `Address`, `created_at` | Written by `1.0`; Read by `2.0`, `5.0` |
| **D2** | `COMPLAINT` | Primary transaction store of citizen complaints and lifecycle states. | `Complaint_ID (PK)`, `Citizen_ID`, `Department_ID`, `Complaint_Date`, `Category`, `Description`, `Location`, `Status` | Written by `2.0`; Read/Updated by `3.0`, `4.0`, `5.0` |
| **D3** | `DEPARTMENT` | Official municipal department definitions and physical locations. | `Department_ID (PK)`, `Department_Name (UK)`, `Office_Location` | Updated by `3.0`; Read by `2.0`, `3.0`, `5.0` |
| **D4** | `STAFF` | Directory of departmental personnel, roles, and status. | `Staff_ID (PK)`, `Department_ID`, `Name`, `Phone`, `Designation`, `is_active` | Updated by `3.0`; Read by `3.0`, `5.0` |
| **D5** | `WORK_ORDER` | Operational work orders dispatched to field crews. | `WorkOrder_ID (PK)`, `Complaint_ID`, `Staff_ID`, `Assigned_Date`, `Completion_Date`, `Work_Status`, `Action_Taken` | Written by `3.0`; Read/Updated by `4.0`, `5.0` |

---

## 5. Balancing Verification with Level 0

| Level 0 Boundary Flow | Source → Destination (Level 0) | Level 1 Implementation | Balancing Status |
|---|---|---|---|
| `REGISTRATION DETAILS` | `CITIZEN` → Process 0 | `CITIZEN` → Process `1.0` | **BALANCED** |
| `COMPLAINT DETAILS` | `CITIZEN` → Process 0 | `CITIZEN` → Process `2.0` | **BALANCED** |
| `COMPLAINT INQUIRY` | `CITIZEN` → Process 0 | `CITIZEN` → Process `4.0` | **BALANCED** |
| `COMPLAINT NUMBER & ACKNOWLEDGMENT` | Process 0 → `CITIZEN` | Process `2.0` → `CITIZEN` | **BALANCED** |
| `CORRECTION MESSAGE` | Process 0 → `CITIZEN` | Process `2.0` → `CITIZEN` | **BALANCED** |
| `STATUS INFORMATION` | Process 0 → `CITIZEN` | Process `4.0` → `CITIZEN` | **BALANCED** |
| `RESOLUTION INFORMATION` | Process 0 → `CITIZEN` | Process `4.0` → `CITIZEN` | **BALANCED** |
| `DEPARTMENT INFORMATION` | `ADMIN` → Process 0 | `ADMIN` → Process `3.0` | **BALANCED** |
| `STAFF INFORMATION` | `ADMIN` → Process 0 | `ADMIN` → Process `3.0` | **BALANCED** |
| `REPORTING REQUESTS` | `ADMIN` → Process 0 | `ADMIN` → Process `5.0` | **BALANCED** |
| `COMPLAINT REPORTS` | Process 0 → `ADMIN` | Process `5.0` → `ADMIN` | **BALANCED** |
| `DEPARTMENT PERFORMANCE` | Process 0 → `ADMIN` | Process `5.0` → `ADMIN` | **BALANCED** |
| `PENDING WORK SUMMARY` | Process 0 → `ADMIN` | Process `5.0` → `ADMIN` | **BALANCED** |
| `WORK UPDATES` | `STAFF` → Process 0 | `STAFF` → Process `4.0` | **BALANCED** |
| `ACTION TAKEN` | `STAFF` → Process 0 | `STAFF` → Process `4.0` | **BALANCED** |
| `COMPLETION INFORMATION` | `STAFF` → Process 0 | `STAFF` → Process `4.0` | **BALANCED** |
| `ASSIGNED COMPLAINTS` | Process 0 → `STAFF` | Process `3.0` → `STAFF` | **BALANCED** |
| `WORK ORDERS` | Process 0 → `STAFF` | Process `3.0` → `STAFF` | **BALANCED** |
| `TASK DETAILS` | Process 0 → `STAFF` | Process `3.0` → `STAFF` | **BALANCED** |

---

## Related Diagrams
- [Entity-Relationship Diagram (ERD)](erd.md)
- [Semantic Net (Occurrence Level)](semantic_net.md)
- [DFD Level 0 (Context Diagram)](dfd_level_0.md)
- [DFD Level 2 (Process 2.0)](dfd_level_2.md)
