# Municipal Complaint Management System (MCMS)

[![CI Workflow](https://github.com/Asad101001/municipal-complaint-system/actions/workflows/ci.yml/badge.svg)](https://github.com/Asad101001/municipal-complaint-system/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?logo=next.js)](frontend/)
[![Django REST Framework](https://img.shields.io/badge/Backend-Django%20REST-red?logo=django)](backend/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-blue?logo=postgresql)](database/)

**Academic & Engineering Standard**: University of Karachi — BS Computer Science — Database Management Systems (DBMS)  
A centralized, three-tier enterprise database and municipal management system designed to track public complaints from submission to verified resolution. Built with **Next.js**, **Django REST Framework (DRF)**, and **PostgreSQL**, complete with a rule-based **Decision-Support Agent** for proactive backlog alerting and workload rebalancing.

> 📚 **Complete Documentation**:
> - 📊 [Entity-Relationship Diagram (ERD)](docs/erd.md)
> - 🕸️ [Semantic Net (Occurrence Level)](docs/semantic_net.md)
> - 🌐 [DFD Level 0 (Context Diagram)](docs/dfd_level_0.md)
> - 🔀 [DFD Level 1 (Diagram 0)](docs/dfd_level_1.md)
> - 🔍 [DFD Level 2 (Process 2.0)](docs/dfd_level_2.md)
> - 📑 [Master System Diagrams & Data Dictionary](docs/SYSTEM_DIAGRAMS.md)
> - 📋 [Software Requirements Specification (SRS)](docs/SRS.md)
> - 🏗️ [System Design Specification (SDS)](docs/SDS.md)
> - 🎯 [Product Requirements Document (PRD)](docs/PRD.md)

---

## 1. System Architecture

```mermaid
graph TD
    subgraph Client Tier
        UI["Next.js Web Portal (Port 3000)<br/>Citizens • Municipal Staff • Administration"]
    end

    subgraph Application Tier
        API["Django REST Framework API (Port 8000)"]
        Agent["Decision-Support Agent (Rules & Alerts)"]
    end

    subgraph Data Tier
        DB[("PostgreSQL 16 Database (Port 5432)")]
        Audit[("Audit Log & Snapshots")]
    end

    UI <-->|REST / JSON| API
    API <-->|ORM / Transactions| DB
    API <-->|Workload & SLA Checks| Agent
    Agent -->|Log Flags & Recommendations| Audit
```

---

## 2. Entity-Relationship Diagram (ERD)

Core five-entity design using Crow's foot notation:

```mermaid
erDiagram
    CITIZEN ||--o{ COMPLAINT : "submits"
    DEPARTMENT ||--o{ COMPLAINT : "handles"
    DEPARTMENT ||--o{ STAFF : "employs"
    STAFF ||--o{ WORK_ORDER : "performs"
    COMPLAINT ||--o{ WORK_ORDER : "generates"

    CITIZEN {
        int Citizen_ID PK
        string Name
        string Phone UK
        text Address
    }

    DEPARTMENT {
        int Department_ID PK
        string Department_Name UK
        string Office_Location
    }

    STAFF {
        int Staff_ID PK
        int Department_ID FK
        string Name
        string Phone
        string Designation
    }

    COMPLAINT {
        int Complaint_ID PK
        int Citizen_ID FK
        int Department_ID FK
        datetime Complaint_Date
        string Category
        text Description
        string Location
        string Status
    }

    WORK_ORDER {
        int WorkOrder_ID PK
        int Complaint_ID FK
        int Staff_ID FK
        datetime Assigned_Date
        datetime Completion_Date
        string Work_Status
        text Action_Taken
    }
```

### Cardinality Matrix
- **1 Citizen submits N Complaints** (`1 : N`): Mandatory on Complaint side (`||` Exactly One).
- **1 Department handles N Complaints** (`1 : N`): Mandatory on Complaint side.
- **1 Department employs N Staff** (`1 : N`): Mandatory on Staff side.
- **1 Complaint generates N Work Orders** (`1 : N`): Optional on Complaint side (0..N, work orders exist only after work is assigned).
- **1 Staff member performs N Work Orders** (`1 : N`): Mandatory on Work Order side.

---

## 3. Semantic Net (Occurrence Level)

Illustrates declared `1:N` relationships through sample populations rather than abstract rules:

### Figure A: 1:N Submits Relationship
*Citizen `c1` submits two complaints (`k1`, `k2`); citizen `c2` submits complaint `k3`. Each complaint has exactly one citizen.*

```mermaid
graph LR
    subgraph Citizen Occurrences
        c1["c1 (C01: Ali Raza)"]
        c2["c2 (C02: Sara Khan)"]
    end

    subgraph Submits Relationships
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    subgraph Complaint Occurrences
        k1["k1 (K101: Sanitation)"]
        k2["k2 (K102: Water Supply)"]
        k3["k3 (K103: Streetlights)"]
    end

    c1 --> r1 --> k1
    c1 --> r2 --> k2
    c2 --> r3 --> k3
```

### Figure B: 1:N Generates Relationship
*Complaint `k1` has generated two work orders (`w1`, `w2`); `k2` has generated one work order (`w3`); newly-submitted complaint `k3` has none yet.*

```mermaid
graph LR
    subgraph Complaint Occurrences
        k1["k1 (K101: In Progress)"]
        k2["k2 (K102: Assigned)"]
        k3["k3 (K103: Submitted)"]
    end

    subgraph Generates Relationships
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    subgraph Work Order Occurrences
        w1["w1 (WO11: Completed)"]
        w2["w2 (WO12: In Progress)"]
        w3["w3 (WO21: Assigned)"]
    end

    k1 --> r1 --> w1
    k1 --> r2 --> w2
    k2 --> r3 --> w3
```

---

## 4. Data Flow Diagrams (DFD)

### Level 0: Context Diagram
*Global boundary with one central process, external entities only, and no data stores.*

```mermaid
flowchart TD
    ADMIN["MUNICIPAL ADMINISTRATION"]
    CITIZEN["CITIZEN"]
    STAFF["MUNICIPAL STAFF"]

    SYSTEM(("0<br/>MUNICIPAL<br/>MANAGEMENT<br/>SYSTEM"))

    CITIZEN -- "REGISTRATION DETAILS<br/>COMPLAINT DETAILS<br/>COMPLAINT INQUIRY" --> SYSTEM
    SYSTEM -- "COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>CORRECTION MESSAGE<br/>STATUS & RESOLUTION INFORMATION" --> CITIZEN

    ADMIN -- "DEPARTMENT INFORMATION<br/>STAFF INFORMATION<br/>REPORTING REQUESTS" --> SYSTEM
    SYSTEM -- "COMPLAINT REPORTS<br/>DEPARTMENT PERFORMANCE<br/>PENDING WORK SUMMARY" --> ADMIN

    STAFF -- "WORK UPDATES<br/>ACTION TAKEN<br/>COMPLETION INFORMATION" --> SYSTEM
    SYSTEM -- "ASSIGNED COMPLAINTS<br/>WORK ORDERS<br/>TASK DETAILS" --> STAFF
```

---

### Level 1: Diagram 0 (Main Processes & Data Stores)
*Decomposes the system into 5 main processes and 5 persistent stores with balanced flows.*

```mermaid
flowchart TB
    CITIZEN["CITIZEN"]
    STAFF["MUNICIPAL STAFF"]
    ADMIN["MUNICIPAL ADMINISTRATION"]

    P1(("1.0<br/>MANAGE<br/>CITIZENS"))
    P2(("2.0<br/>REGISTER<br/>COMPLAINTS"))
    P3(("3.0<br/>ASSIGN<br/>DEPT & WORK"))
    P4(("4.0<br/>UPDATE<br/>COMPLAINT<br/>STATUS"))
    P5(("5.0<br/>GENERATE<br/>REPORTS"))

    D1[("D1: CITIZEN RECORDS")]
    D2[("D2: COMPLAINT RECORDS")]
    D3[("D3: DEPARTMENT RECORDS")]
    D4[("D4: STAFF RECORDS")]
    D5[("D5: WORK ORDER RECORDS")]

    CITIZEN -- "REGISTRATION DETAILS" --> P1
    P1 -- "NEW CITIZEN" --> D1

    CITIZEN -- "COMPLAINT DETAILS" --> P2
    D1 -- "CITIZEN DETAILS" --> P2
    D3 -- "DEPT DETAILS" --> P2
    P2 -- "NEW COMPLAINT" --> D2
    P2 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>CORRECTION MESSAGE" --> CITIZEN

    D2 -- "COMPLAINT" --> P3
    D3 -- "DEPT DETAILS" --> P3
    D4 -- "STAFF DETAILS" --> P3
    ADMIN -- "DEPARTMENT & STAFF INFO" --> P3
    P3 -- "WORK ORDER" --> D5
    P3 -- "ASSIGNED COMPLAINTS, WORK ORDERS" --> STAFF

    STAFF -- "WORK UPDATES, ACTION TAKEN" --> P4
    CITIZEN -- "COMPLAINT INQUIRY" --> P4
    P4 -- "STATUS" --> D2
    P4 -- "WORK PROGRESS" --> D5
    P4 -- "STATUS & RESOLUTION INFORMATION" --> CITIZEN

    ADMIN -- "REPORTING REQUESTS" --> P5
    D1 -. "REPORT DATA" .-> P5
    D2 -. "REPORT DATA" .-> P5
    D3 -. "REPORT DATA" .-> P5
    D4 -. "REPORT DATA" .-> P5
    D5 -. "REPORT DATA" .-> P5
    P5 -- "COMPLAINT REPORTS, PENDING WORK" --> ADMIN
```

---

### Level 2: Decomposition of Process 2.0 (Register Complaints)
*Shows sub-processes 2.1 to 2.6 with input validation error branches and store interactions.*

```mermaid
flowchart TD
    subgraph P2["PROCESS 2.0 REGISTER COMPLAINTS"]
        P2_1(("2.1<br/>RECEIVE<br/>COMPLAINT"))
        P2_2(("2.2<br/>VALIDATE CITIZEN<br/>& COMPLAINT DETAILS"))
        P2_3(("2.3<br/>DETERMINE<br/>COMPLAINT CATEGORY"))
        P2_4(("2.4<br/>IDENTIFY<br/>RESPONSIBLE DEPT"))
        P2_5(("2.5<br/>SAVE<br/>COMPLAINT RECORD"))
        P2_6(("2.6<br/>GENERATE NUMBER<br/>& ACKNOWLEDGMENT"))
    end

    CITIZEN["CITIZEN"]
    D1[("D1: CITIZEN RECORDS")]
    D3[("D3: DEPARTMENT RECORDS")]
    D2[("D2: COMPLAINT RECORDS")]

    CITIZEN -- "COMPLAINT DETAILS" --> P2_1
    P2_1 -- "RECEIVED DETAILS" --> P2_2
    D1 -. "CITIZEN DETAILS" .-> P2_2

    P2_2 -- "CORRECTION MESSAGE (FAILED)" --> CITIZEN
    P2_2 -- "VALIDATED DETAILS" --> P2_3
    P2_3 -- "COMPLAINT CATEGORY" --> P2_4
    D3 -. "DEPARTMENT DETAILS" .-> P2_4
    P2_4 -- "COMPLAINT WITH DEPT" --> P2_5
    P2_5 -- "COMPLAINT RECORD" --> D2
    P2_5 -- "SAVED COMPLAINT ID" --> P2_6
    P2_6 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT" --> CITIZEN
```

---

## 5. Repository Structure

```
├── .github/
│   ├── workflows/
│   │   └── ci.yml                     # Continuous integration workflow
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml             # GitHub bug report issue template
│   │   └── feature_request.yml        # Feature request issue template
│   └── pull_request_template.md       # Standardized PR template
├── backend/                           # Django REST Framework backend
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── frontend/                          # Next.js web application
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── database/
│   ├── schema.sql                     # PostgreSQL DDL schema with constraints & indexes
│   └── seed_data.sql                  # Pre-generated synthetic municipal dataset
├── docs/                              # Project specifications & briefing materials
│   ├── Briefing Docs.pdf              # Original project briefing document
│   ├── erd.md                         # Entity-Relationship Diagram (Crow's foot)
│   ├── semantic_net.md                # Semantic Net (Occurrence Level - Fig A & B)
│   ├── dfd_level_0.md                 # DFD Level 0 (Context Diagram)
│   ├── dfd_level_1.md                 # DFD Level 1 (Diagram 0)
│   ├── dfd_level_2.md                 # DFD Level 2 (Process 2.0 Decomposition)
│   ├── SYSTEM_DIAGRAMS.md             # Master System Diagrams & Data Dictionary
│   ├── PRD.md                         # Product Requirements Document
│   ├── SRS.md                         # Software Requirements Specification
│   └── SDS.md                         # System Design Specification
├── scripts/
│   └── seed_synthetic_data.py         # Synthetic data generator script
├── .editorconfig
├── .gitattributes
├── .gitignore
├── docker-compose.yml                 # Multi-container orchestration (DB, API, UI)
├── LICENSE                            # MIT License
└── README.md
```

---

## 6. Functional Requirements Matrix

| Requirement | Module | DFD Process | Implementation Target |
|---|---|---|---|
| **FR-01** | Citizens | `1.0 MANAGE CITIZENS` | `POST/GET /api/citizens/` |
| **FR-02** | Validation | `2.2 VALIDATE DETAILS` | DRF Serializers & Next.js form errors |
| **FR-03** | Categorization | `2.3 & 2.4 CATEGORIZE` | `POST /api/complaints/categorize/` |
| **FR-04** | Registration | `2.5 & 2.6 SAVE & ACK` | `POST /api/complaints/` |
| **FR-05** | Work Orders | `3.0 ASSIGN DEPT & WORK` | `POST /api/work-orders/` |
| **FR-06** | Status Updates | `4.0 UPDATE STATUS` | `PATCH /api/work-orders/{id}/` |
| **FR-07** | Inquiry | `4.0 LIVE TRACKING` | `GET /api/complaints/track/?id=...` |
| **FR-08** | Reporting | `5.0 GENERATE REPORTS` | `GET /api/reports/` |
| **FR-09** | Decision Support | Agent / Rules Engine | `GET /api/agent/alerts/` |

---

## 7. Quickstart Guide

### Option A: One-Command Start (Docker Compose)

```bash
git clone https://github.com/Asad101001/municipal-complaint-system.git
cd municipal-complaint-system

# Copy environment template
cp .env.example .env

# Build and start all services (PostgreSQL 16, Django DRF, Next.js 15)
docker compose up --build
```

- **Frontend Portal**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **PostgreSQL**: `localhost:5432` (`municipal_db`)

---

### Option B: Local Setup

#### 1. Database Setup
```bash
psql -U postgres -d municipal_db -f database/schema.sql
psql -U postgres -d municipal_db -f database/seed_data.sql
```

#### 2. Backend Setup (DRF)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # On Windows
# source venv/bin/activate  # On Linux/macOS

pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

#### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

---

## 8. Synthetic Data Generator

Generate fresh synthetic test data across Citizens, Departments, Staff, Complaints, Work Orders, and Audit Logs:

```bash
python scripts/seed_synthetic_data.py database/seed_data.sql
```

---

## License
Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
