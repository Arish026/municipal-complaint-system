# Municipal Complaint Management System — System Diagrams & Modeling Specifications

**Course Reference**: University of Karachi — BS Computer Science — Database Management Systems (DBMS)  
**System**: Municipal Complaint Management System (MCMS)  
**Design Standard**: Crow's Foot Notation ERD, Occurrence-Level Semantic Net, and Gane-Sarson / Yourdon-DeMarco Data Flow Diagrams (Level 0, Level 1, Level 2).

---

## 📑 Individual Diagram Documents
For focused, in-depth study, each diagram is maintained in its own dedicated document with full attribute tables, mini-specifications, and formal semantics:

* 📊 **[Entity-Relationship Diagram (ERD)](erd.md)**: Full Crow's foot notation, cardinalities, attribute data types, and primary/foreign key definitions.
* 🕸️ **[Semantic Net (Occurrence Level)](semantic_net.md)**: Figures A & B depicting concrete entity instances, relationship paths, attribute valuation bindings, and relational formalization.
* 🌐 **[DFD Level 0 (Context Diagram)](dfd_level_0.md)**: Overall system boundary, external entities (`CITIZEN`, `ADMINISTRATION`, `STAFF`), and the 19 primary data flows.
* 🔀 **[DFD Level 1 (Diagram 0)](dfd_level_1.md)**: Main processes (`1.0` through `5.0`), persistent data stores (`D1` through `D5`), and Level 0 balancing verification.
* 🔍 **[DFD Level 2 (Process 2.0)](dfd_level_2.md)**: Detailed decomposition of `REGISTER COMPLAINTS` into sub-processes `2.1` to `2.6`, Structured English mini-specs, and error validation handling.

---

## Table of Contents
1. [Entity-Relationship Diagram (ERD)](#1-entity-relationship-diagram-erd)
   - [Visual Diagram](#11-erd-visual-diagram)
   - [Entity Definitions & Attribute Directory](#12-entity-definitions--attribute-directory)
   - [Cardinality & Relationship Rules](#13-cardinality--relationship-rules)
2. [Semantic Net (Occurrence Level)](#2-semantic-net-occurrence-level)
   - [Figure A: 1:N Submits Relationship](#21-figure-a-1n-submits-relationship)
   - [Figure B: 1:N Generates Relationship](#22-figure-b-1n-generates-relationship)
   - [Formal Relational Mappings & Valuation Tables](#23-formal-relational-mappings--valuation-tables)
3. [Data Flow Diagram (DFD) — Level 0 (Context Diagram)](#3-data-flow-diagram-dfd--level-0-context-diagram)
   - [Context Diagram Overview](#31-context-diagram-overview)
   - [Level 0 Flow Specification](#32-level-0-flow-specification)
4. [Data Flow Diagram (DFD) — Level 1 (Diagram 0)](#4-data-flow-diagram-dfd--level-1-diagram-0)
   - [Decomposition Architecture](#41-decomposition-architecture)
   - [Process Directory (1.0 - 5.0)](#42-process-directory-10---50)
   - [Data Store Directory (D1 - D5)](#43-data-store-directory-d1---d5)
   - [Level 1 Flow Specifications](#44-level-1-flow-specifications)
5. [Data Flow Diagram (DFD) — Level 2 (Process 2.0: Register Complaints)](#5-data-flow-diagram-dfd--level-2-process-20-register-complaints)
   - [Functional Decomposition (2.1 - 2.6)](#51-functional-decomposition-21---26)
   - [Level 2 Process Specifications (Mini-Specs)](#52-level-2-process-specifications-mini-specs)
   - [Balancing Proof with Level 1](#53-balancing-proof-with-level-1)
6. [Complete Data Dictionary](#6-complete-data-dictionary)

---

## 1. Entity-Relationship Diagram (ERD)

### 1.1 ERD Visual Diagram

```mermaid
erDiagram
    CITIZEN ||--o{ COMPLAINT : "submits"
    DEPARTMENT ||--o{ COMPLAINT : "handles"
    DEPARTMENT ||--o{ STAFF : "employs"
    STAFF ||--o{ WORK_ORDER : "performs"
    COMPLAINT ||--o{ WORK_ORDER : "generates"

    CITIZEN {
        int Citizen_ID PK "Unique identifier for citizen"
        string Name "Full name of citizen"
        string Phone UK "Primary contact phone number"
        text Address "Residential physical address"
    }

    DEPARTMENT {
        int Department_ID PK "Unique identifier for department"
        string Department_Name UK "Name of municipal department"
        string Office_Location "Building/floor/office address"
    }

    STAFF {
        int Staff_ID PK "Unique identifier for staff member"
        int Department_ID FK "Parent department reference"
        string Name "Staff full name"
        string Phone "Direct contact number"
        string Designation "Official job title / rank"
    }

    COMPLAINT {
        int Complaint_ID PK "Unique complaint ticket ID"
        int Citizen_ID FK "Citizen submitter reference"
        int Department_ID FK "Assigned department reference"
        datetime Complaint_Date "Timestamp of submission"
        string Category "Classification of grievance"
        text Description "Detailed citizen narrative"
        string Location "Physical incident address / zone"
        string Status "Current complaint lifecycle state"
    }

    WORK_ORDER {
        int WorkOrder_ID PK "Unique work order reference"
        int Complaint_ID FK "Parent complaint reference"
        int Staff_ID FK "Assigned staff member"
        datetime Assigned_Date "Dispatch timestamp"
        datetime Completion_Date "Resolution timestamp (nullable)"
        string Work_Status "Operational work status"
        text Action_Taken "Remedial action summary"
    }
```

### 1.2 Entity Definitions & Attribute Directory

| Entity | Attribute Name | Key | Type | Nullable | Description & Domain |
|---|---|---|---|---|---|
| **CITIZEN** | `Citizen_ID` | **PK** | Integer (Serial) | No | Unique surrogate key identifying each registered citizen. |
| | `Name` | | Varchar(100) | No | Full legal name of the resident. |
| | `Phone` | **UK** | Varchar(20) | No | Unique telephone/mobile number used for tracking lookups. |
| | `Address` | | Text | No | Physical street address, ward, or residence identifier. |
| **DEPARTMENT** | `Department_ID` | **PK** | Integer (Serial) | No | Unique surrogate key for each civic department. |
| | `Department_Name` | **UK** | Varchar(100) | No | E.g., Water Supply, Sanitation, Roads, Streetlights. |
| | `Office_Location` | | Varchar(200) | No | Office location (building, floor, depot number). |
| **STAFF** | `Staff_ID` | **PK** | Integer (Serial) | No | Unique surrogate key for each municipal employee. |
| | `Department_ID` | **FK** | Integer | No | Reference to `DEPARTMENT.Department_ID`. |
| | `Name` | | Varchar(100) | No | Staff member's full name. |
| | `Phone` | | Varchar(20) | No | Contact phone number for work dispatch. |
| | `Designation` | | Varchar(100) | No | Role title (e.g., Senior Inspector, Field Technician). |
| **COMPLAINT** | `Complaint_ID` | **PK** | Integer (Serial) | No | Unique tracking number issued upon complaint registration. |
| | `Citizen_ID` | **FK** | Integer | No | Reference to `CITIZEN.Citizen_ID` (mandatory ownership). |
| | `Department_ID` | **FK** | Integer | No | Reference to `DEPARTMENT.Department_ID` (routing). |
| | `Complaint_Date` | | Timestamp | No | Timestamp of submission (defaults to `CURRENT_TIMESTAMP`). |
| | `Category` | | Varchar(100) | No | Domain classification (e.g., Pothole, Water Burst, Trash). |
| | `Description` | | Text | No | Citizen-provided description of the incident. |
| | `Location` | | Varchar(255) | No | Geographical landmark, street name, or ward. |
| | `Status` | | Varchar(50) | No | `Submitted`, `Categorized`, `Assigned`, `In Progress`, `Resolved`, `Verified`, `Closed`. |
| **WORK_ORDER** | `WorkOrder_ID` | **PK** | Integer (Serial) | No | Unique job order ticket number. |
| | `Complaint_ID` | **FK** | Integer | No | Reference to `COMPLAINT.Complaint_ID`. |
| | `Staff_ID` | **FK** | Integer | No | Reference to `STAFF.Staff_ID` assigned to execute. |
| | `Assigned_Date` | | Timestamp | No | Work assignment and dispatch date. |
| | `Completion_Date` | | Timestamp | Yes | Nullable completion date, populated when status is `Completed`. |
| | `Work_Status` | | Varchar(50) | No | `Assigned`, `In Progress`, `Completed`, `On Hold`, `Cancelled`. |
| | `Action_Taken` | | Text | Yes | Summary of field diagnosis, materials used, and repairs made. |

### 1.3 Cardinality & Relationship Rules

```
Legend:
||       = Mandatory Exactly One (1..1)
|{ or >o = Optional Zero-or-Many (0..N)
```

1. **CITIZEN submits COMPLAINT (`1 : N`)**:
   - **Participation**: Mandatory on Complaint side (a complaint *must* be submitted by exactly 1 citizen).
   - **Optionality**: A citizen may register and have zero or many complaints ($0 \dots N$).
   - **Constraint**: `ON DELETE RESTRICT` (a citizen with active complaints cannot be deleted).
2. **DEPARTMENT handles COMPLAINT (`1 : N`)**:
   - **Participation**: Mandatory on Complaint side (every complaint *must* be assigned to exactly 1 department).
   - **Optionality**: A department handles zero or many complaints ($0 \dots N$).
   - **Constraint**: `ON DELETE RESTRICT`.
3. **DEPARTMENT employs STAFF (`1 : N`)**:
   - **Participation**: Mandatory on Staff side (staff member belongs to exactly 1 department).
   - **Optionality**: A department employs zero or many staff members ($0 \dots N$).
   - **Constraint**: `ON DELETE RESTRICT`.
4. **COMPLAINT generates WORK_ORDER (`1 : N`)**:
   - **Participation**: Mandatory on Work Order side (a work order is generated for exactly 1 complaint).
   - **Optionality**: A complaint has $0$ work orders upon initial submission; work orders exist only after supervisor assignment ($0 \dots N$).
   - **Constraint**: `ON DELETE CASCADE` (deleting a complaint purges linked work orders).
5. **STAFF performs WORK_ORDER (`1 : N`)**:
   - **Participation**: Mandatory on Work Order side (a work order is assigned to exactly 1 staff member).
   - **Optionality**: A staff member performs zero or many work orders ($0 \dots N$).
   - **Constraint**: `ON DELETE RESTRICT`.

---

## 2. Semantic Net (Occurrence Level)

The Semantic Network models concrete data occurrences (instances) rather than abstract types, illustrating how individual entities connect across relationship sets.

### 2.1 Figure A: 1:N Submits Relationship
*Sample occurrence demonstrating that citizen $c_1$ submits two complaints ($k_1, k_2$), while citizen $c_2$ submits complaint $k_3$. Each complaint belongs to exactly one citizen.*

```mermaid
flowchart LR
    %% Citizen Values & Attributes
    subgraph CITIZEN_VALUES ["Citizen Data"]
        v_c1["Citizen_ID: C01<br/>Name: Ali Raza"]
        v_c2["Citizen_ID: C02<br/>Name: Sara Khan"]
    end

    %% Citizen Entity Instances
    subgraph CITIZEN_ENTITIES ["CITIZEN Entities"]
        c1((c1))
        c2((c2))
    end

    %% Submits Relationship Instances
    subgraph SUBMITS_REL ["SUBMITS Relationship"]
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    %% Complaint Entity Instances
    subgraph COMPLAINT_ENTITIES ["COMPLAINT Entities"]
        k1((k1))
        k2((k2))
        k3((k3))
    end

    %% Complaint Values & Attributes
    subgraph COMPLAINT_VALUES ["Complaint Data"]
        v_k1["Complaint_ID: K101<br/>Category: Sanitation"]
        v_k2["Complaint_ID: K102<br/>Category: Water Supply"]
        v_k3["Complaint_ID: K103<br/>Category: Streetlights"]
    end

    %% Bindings
    v_c1 -.- c1
    v_c2 -.- c2

    %% Paths
    c1 ==> r1 ==> k1
    c1 ==> r2 ==> k2
    c2 ==> r3 ==> k3

    k1 -.- v_k1
    k2 -.- v_k2
    k3 -.- v_k3

    classDef citizen fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef complaint fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:12px;

    class c1,c2 citizen;
    class r1,r2,r3 rel;
    class k1,k2,k3 complaint;
    class v_c1,v_c2,v_k1,v_k2,v_k3 data;
```

---

### 2.2 Figure B: 1:N Generates Relationship
*Sample occurrence demonstrating that complaint $k_1$ has generated two work orders ($w_1, w_2$), complaint $k_2$ has generated one work order ($w_3$), and newly-submitted complaint $k_3$ has generated zero work orders.*

```mermaid
flowchart LR
    %% Complaint Values & Attributes
    subgraph COMPLAINT_VALS ["Complaint Data"]
        v_k1["Complaint_ID: K101<br/>Status: In Progress"]
        v_k2["Complaint_ID: K102<br/>Status: Assigned"]
        v_k3["Complaint_ID: K103<br/>Status: Submitted"]
    end

    %% Complaint Entity Instances
    subgraph COMPLAINT_SET ["COMPLAINT Entities"]
        k1((k1))
        k2((k2))
        k3((k3))
    end

    %% Generates Relationship Instances
    subgraph GENERATES_REL ["GENERATES Relationship"]
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    %% Work Order Entity Instances
    subgraph WORK_ORDER_SET ["WORK ORDER Entities"]
        w1((w1))
        w2((w2))
        w3((w3))
    end

    %% Work Order Values & Attributes
    subgraph WO_VALS ["Work Order Data"]
        v_w1["WorkOrder_ID: WO11<br/>Work_Status: Completed"]
        v_w2["WorkOrder_ID: WO12<br/>Work_Status: In Progress"]
        v_w3["WorkOrder_ID: WO21<br/>Work_Status: Assigned"]
    end

    %% Bindings
    v_k1 -.- k1
    v_k2 -.- k2
    v_k3 -.- k3

    %% Paths
    k1 ==> r1 ==> w1
    k1 ==> r2 ==> w2
    k2 ==> r3 ==> w3

    w1 -.- v_w1
    w2 -.- v_w2
    w3 -.- v_w3

    classDef complaint fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef wo fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:12px;

    class k1,k2,k3 complaint;
    class r1,r2,r3 rel;
    class w1,w2,w3 wo;
    class v_k1,v_k2,v_k3,v_w1,v_w2,v_w3 data;
```

---

### 2.3 Formal Relational Mappings & Valuation Tables

#### Entity Instance Set 1: Citizen
| Occurrence | `Citizen_ID` | `Name` | `Phone` | `Address` |
|---|---|---|---|---|
| $c_1$ | `C01` | Ali Raza | +1-555-0101 | 14-B Clifton Block 5 |
| $c_2$ | `C02` | Sara Khan | +1-555-0102 | 88 Gulshan-e-Iqbal Block 10 |

#### Entity Instance Set 2: Complaint
| Occurrence | `Complaint_ID` | `Citizen_ID` | `Department_ID` | `Category` | `Status` | Description |
|---|---|---|---|---|---|---|
| $k_1$ | `K101` | `C01` | `D03` | Sanitation | In Progress | Overflowing commercial dumpster |
| $k_2$ | `K102` | `C01` | `D01` | Water Supply | Assigned | Main pipeline ruptured |
| $k_3$ | `K103` | `C02` | `D04` | Streetlights | Submitted | Non-functional streetlight |

#### Entity Instance Set 3: Work Order
| Occurrence | `WorkOrder_ID` | `Complaint_ID` | `Staff_ID` | `Work_Status` | `Action_Taken` |
|---|---|---|---|---|---|
| $w_1$ | `WO11` | `K101` | `S05` | Completed | Initial site cleared, extra bin placed |
| $w_2$ | `WO12` | `K101` | `S06` | In Progress | Daily monitoring route active |
| $w_3$ | `WO21` | `K102` | `S02` | Assigned | Excavation scheduled |

---

## 3. Data Flow Diagram (DFD) — Level 0 (Context Diagram)

### 3.1 Context Diagram Overview
The Level 0 Context Diagram establishes the global boundary of the system:
- **One single process**: `0 MUNICIPAL MANAGEMENT SYSTEM`.
- **External entities**: `CITIZEN`, `MUNICIPAL ADMINISTRATION`, `MUNICIPAL STAFF`.
- **No internal data stores** appear at this level.

```mermaid
flowchart TD
    ADMIN["🏛️ MUNICIPAL ADMINISTRATION"]
    CITIZEN["👤 CITIZEN"]
    STAFF["👷 MUNICIPAL STAFF"]

    SYSTEM(("⚙️ 0<br/>MUNICIPAL<br/>MANAGEMENT<br/>SYSTEM"))

    CITIZEN -- "1. REGISTRATION DETAILS<br/>2. COMPLAINT DETAILS<br/>3. COMPLAINT INQUIRY" --> SYSTEM
    SYSTEM -- "1. COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>2. CORRECTION MESSAGE<br/>3. STATUS INFORMATION<br/>4. RESOLUTION INFORMATION" --> CITIZEN

    ADMIN -- "1. DEPARTMENT INFORMATION<br/>2. STAFF INFORMATION<br/>3. REPORTING REQUESTS" --> SYSTEM
    SYSTEM -- "1. COMPLAINT REPORTS<br/>2. DEPARTMENT PERFORMANCE<br/>3. PENDING WORK SUMMARY" --> ADMIN

    STAFF -- "1. WORK UPDATES<br/>2. ACTION TAKEN<br/>3. COMPLETION INFORMATION" --> SYSTEM
    SYSTEM -- "1. ASSIGNED COMPLAINTS<br/>2. WORK ORDERS<br/>3. TASK DETAILS" --> STAFF

    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:3px,color:#0369a1,font-weight:bold;

    class ADMIN,CITIZEN,STAFF entity;
    class SYSTEM process;
```

---

## 4. Data Flow Diagram (DFD) — Level 1 (Diagram 0)

### 4.1 Decomposition Architecture
Level 1 decomposes the central system into five core functional processes and five persistent data stores while preserving exact balancing with Level 0 inputs and outputs.

```mermaid
flowchart TB
    subgraph ENTITIES ["External Stakeholders"]
        CITIZEN["👤 CITIZEN"]
        STAFF["👷 MUNICIPAL STAFF"]
        ADMIN["🏛️ MUNICIPAL ADMINISTRATION"]
    end

    subgraph PROCESSES ["Core System Processes"]
        P1(("1.0<br/>MANAGE<br/>CITIZENS"))
        P2(("2.0<br/>REGISTER<br/>COMPLAINTS"))
        P3(("3.0<br/>ASSIGN<br/>DEPT & WORK"))
        P4(("4.0<br/>UPDATE<br/>COMPLAINT<br/>STATUS"))
        P5(("5.0<br/>GENERATE<br/>REPORTS"))
    end

    subgraph STORES ["Persistent Data Stores"]
        D1[("D1: CITIZEN RECORDS")]
        D2[("D2: COMPLAINT RECORDS")]
        D3[("D3: DEPARTMENT RECORDS")]
        D4[("D4: STAFF RECORDS")]
        D5[("D5: WORK ORDER RECORDS")]
    end

    CITIZEN -- "REGISTRATION DETAILS" --> P1
    P1 -- "NEW CITIZEN" --> D1

    CITIZEN -- "COMPLAINT DETAILS" --> P2
    D1 -. "CITIZEN DETAILS" .-> P2
    D3 -. "DEPT DETAILS" .-> P2
    P2 -- "NEW COMPLAINT" --> D2
    P2 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>CORRECTION MESSAGE" --> CITIZEN

    D2 -. "COMPLAINT" .-> P3
    D3 -. "DEPT DETAILS" .-> P3
    D4 -. "STAFF DETAILS" .-> P3
    ADMIN -- "DEPARTMENT & STAFF INFORMATION" --> P3
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

    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef store fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;

    class CITIZEN,STAFF,ADMIN entity;
    class P1,P2,P3,P4,P5 process;
    class D1,D2,D3,D4,D5 store;
```

---

## 5. Data Flow Diagram (DFD) — Level 2 (Process 2.0: Register Complaints)

### 5.1 Functional Decomposition (2.1 - 2.6)

```mermaid
flowchart TD
    subgraph P2 ["PROCESS 2.0: REGISTER COMPLAINTS"]
        P2_1(("2.1<br/>RECEIVE<br/>COMPLAINT"))
        P2_2(("2.2<br/>VALIDATE CITIZEN<br/>& COMPLAINT DETAILS"))
        P2_3(("2.3<br/>DETERMINE<br/>COMPLAINT CATEGORY"))
        P2_4(("2.4<br/>IDENTIFY<br/>RESPONSIBLE DEPT"))
        P2_5(("2.5<br/>SAVE<br/>COMPLAINT RECORD"))
        P2_6(("2.6<br/>GENERATE NUMBER<br/>& ACKNOWLEDGMENT"))
    end

    CITIZEN["👤 CITIZEN"]
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
    P2_4 -- "COMPLAINT WITH DEPARTMENT" --> P2_5
    P2_5 -- "COMPLAINT RECORD" --> D2
    P2_5 -- "SAVED COMPLAINT ID" --> P2_6
    P2_6 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT" --> CITIZEN

    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef store fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;

    class CITIZEN entity;
    class P2_1,P2_2,P2_3,P2_4,P2_5,P2_6 process;
    class D1,D2,D3 store;
```

---

## 6. Complete Data Dictionary

### 6.1 Data Flows
```
Data Flow Name: REGISTRATION DETAILS
Composition:    Citizen_Name + Citizen_Phone + Citizen_Address
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT DETAILS
Composition:    Citizen_Phone + Complaint_Category + Description + Incident_Location
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT NUMBER & ACKNOWLEDGMENT
Composition:    Complaint_ID + Submission_Date + Initial_Status + Responsible_Department + Acknowledgment_Text
Type:           Payload (Outbound)

Data Flow Name: CORRECTION MESSAGE
Composition:    Error_Code + Error_Field + User_Guidance_Message
Type:           Payload (Outbound)

Data Flow Name: WORK ORDER
Composition:    WorkOrder_ID + Complaint_ID + Staff_ID + Assigned_Date + Target_SLA + Work_Status
Type:           Record (Intersystem / Store)

Data Flow Name: WORK UPDATES
Composition:    WorkOrder_ID + New_Work_Status + Action_Taken_Summary + [Completion_Timestamp]
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT INQUIRY
Composition:    Complaint_ID | Citizen_Phone
Type:           Query (Inbound)

Data Flow Name: STATUS & RESOLUTION INFORMATION
Composition:    Complaint_ID + Current_Status + Department_Name + Assigned_Staff_Name + Work_Status + Action_Taken + [Completion_Date]
Type:           Payload (Outbound)
```

### 6.2 Data Stores
- **D1: CITIZEN RECORDS** = $\{ \underline{\text{Citizen\_ID}} + \text{Name} + \text{Phone} + \text{Address} + \text{created\_at} \}$
- **D2: COMPLAINT RECORDS** = $\{ \underline{\text{Complaint\_ID}} + \text{Citizen\_ID} + \text{Department\_ID} + \text{Complaint\_Date} + \text{Category} + \text{Description} + \text{Location} + \text{Status} \}$
- **D3: DEPARTMENT RECORDS** = $\{ \underline{\text{Department\_ID}} + \text{Department\_Name} + \text{Office\_Location} \}$
- **D4: STAFF RECORDS** = $\{ \underline{\text{Staff\_ID}} + \text{Department\_ID} + \text{Name} + \text{Phone} + \text{Designation} + \text{is\_active} \}$
- **D5: WORK ORDER RECORDS** = $\{ \underline{\text{WorkOrder\_ID}} + \text{Complaint\_ID} + \text{Staff\_ID} + \text{Assigned\_Date} + \text{Completion\_Date} + \text{Work\_Status} + \text{Action\_Taken} \}$
