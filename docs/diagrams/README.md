# Municipal Complaint Management System — System Diagrams & Modeling Specifications

**University of Karachi — Department of Computer Science (UBIT)**  
**Degree Program**: BS Computer Science  
**Course Title**: Database Management Systems (DBMS)  
**Instructor & Course Material Compiler**: Dr. S. M. Khalid  
**Course Textbook**: *Database Systems Textbook*, Chapter 4 (Database Design)  
**System Application**: Municipal Complaint Management System (MCMS)

---

## 📑 Individual Diagram Specifications & Deliverables

Each system diagram is maintained in its own dedicated, thoroughly documented artifact containing full attribute catalogs, formal relational predicates, and Structured English mini-specifications:

* 📊 **[Entity-Relationship Diagram (ERD)](erd.md)**: Full Crow's Foot / Information Engineering (IE) notation and Chen-style conceptual modeling, attribute data types, primary/foreign keys, structural constraints `(min, max)`, weak entities, and connection traps audit.
* 🕸️ **[Semantic Net (Occurrence Level)](semantic_net.md)**: Occurrence-level reasoning per Section 4.5; Figures A, B, and C depicting concrete entity instances, relationship paths, attribute valuation bindings, partial participation demonstrations, and diagnostic query traversals.
* 🌐 **[DFD Level 0 (Context Diagram)](dfd_level_0.md)**: Global system boundary, external entities (`CITIZEN`, `MUNICIPAL ADMINISTRATION`, `MUNICIPAL STAFF`), and 19 primary boundary data flows. Strict exclusion of internal data stores per Section 4.2.5.1.
* 🔀 **[DFD Level 1 (Diagram 0)](dfd_level_1.md)**: Core functional processes (`1.0` through `5.0`), five persistent data stores (`D1` through `D5`), quality rules (no direct entity-to-store flows), and complete parent-child balancing proofs.
* 🔍 **[DFD Level 2 (Process 2.0)](dfd_level_2.md)**: Controlled explosion of `2.0 REGISTER & ROUTE COMPLAINTS` into sub-processes `2.1` to `2.6`, Structured English mini-specifications, validation error feedback loops, and balancing verification.
* 📚 **[Course Work & Handouts Master Guide](../../course-work/README.md)**: Master syllabus, lecture notes index, and chapter summaries (`Chapter #1` to `Chapter #4`).

---

## Table of Contents
1. [Entity-Relationship Conceptual Design (ERD)](#1-entity-relationship-conceptual-design-erd)
   - [Visual ER Diagram (Crow's Foot)](#11-visual-er-diagram-crows-foot-notation)
   - [Conceptual Chen-Style Representation](#12-conceptual-chen-style-representation)
   - [Entity Definitions & Attribute Directory](#13-entity-definitions--attribute-directory)
   - [Structural Constraints & Business Invariants](#14-structural-constraints--business-invariants)
2. [Connection Traps Audit (Fan Trap & Chasm Trap)](#2-connection-traps-audit-fan-trap--chasm-trap)
   - [Fan Trap Audit & Resolution](#21-fan-trap-audit--resolution-section-475)
   - [Chasm Trap Audit & Resolution](#22-chasm-trap-audit--resolution-section-476)
3. [Semantic Net (Occurrence Level)](#3-semantic-net-occurrence-level)
   - [Figure A: 1:N Submits Relationship](#31-figure-a-1n-submits-relationship)
   - [Figure B: 1:N Generates Relationship & Partial Participation](#32-figure-b-1n-generates-relationship--partial-participation)
   - [Figure C: Master Multi-Entity Occurrence Network](#33-figure-c-master-multi-entity-occurrence-network)
   - [Diagnostic Query Path Validations](#34-diagnostic-query-path-validations)
4. [Data Flow Diagrams (DFDs)](#4-data-flow-diagrams-dfds)
   - [Level 0 (Context Diagram)](#41-level-0-context-diagram)
   - [Level 1 (Diagram 0)](#42-level-1-diagram-0)
   - [Level 2 (Process 2.0: Register & Route Complaints)](#43-level-2-process-20-register--route-complaints)
   - [Parent-Child Balancing Verification](#44-parent-child-balancing-verification)
5. [Complete System Data Dictionary](#5-complete-system-data-dictionary)
   - [Data Flow Compositions](#51-data-flow-compositions)
   - [Data Store Specifications](#52-data-store-specifications)

---

## 1. Entity-Relationship Conceptual Design (ERD)

### 1.1 Visual ER Diagram (Crow's Foot Notation)

```mermaid
erDiagram
    CITIZEN ||--o{ COMPLAINT : "submits"
    DEPARTMENT ||--o{ COMPLAINT : "handles"
    DEPARTMENT ||--o{ STAFF : "employs"
    STAFF ||--o{ WORK_ORDER : "performs"
    COMPLAINT ||--o{ WORK_ORDER : "generates"

    CITIZEN {
        int Citizen_ID PK "Primary Key (Auto-Increment)"
        string Name "Resident legal name"
        string Phone UK "Unique contact telephone number"
        text Address "Residential street address"
    }

    DEPARTMENT {
        int Department_ID PK "Primary Key (Auto-Increment)"
        string Department_Name UK "Standardized department name"
        string Office_Location "Depot / administrative headquarters"
    }

    STAFF {
        int Staff_ID PK "Primary Key (Auto-Increment)"
        int Department_ID FK "Foreign Key -> DEPARTMENT"
        string Name "Staff employee name"
        string Phone "Direct contact telephone number"
        string Designation "Official rank / role title"
    }

    COMPLAINT {
        int Complaint_ID PK "Primary Key (Auto-Increment)"
        int Citizen_ID FK "Foreign Key -> CITIZEN (Mandatory)"
        int Department_ID FK "Foreign Key -> DEPARTMENT (Mandatory)"
        datetime Complaint_Date "Submission timestamp"
        string Category "Classification of grievance"
        text Description "Detailed citizen narrative"
        string Location "Physical incident address"
        string Status "Current lifecycle state"
    }

    WORK_ORDER {
        int WorkOrder_ID PK "Primary Key (Auto-Increment)"
        int Complaint_ID FK "Foreign Key -> COMPLAINT (Mandatory)"
        int Staff_ID FK "Foreign Key -> STAFF (Mandatory)"
        datetime Assigned_Date "Dispatch timestamp"
        datetime Completion_Date "Resolution timestamp (Nullable)"
        string Work_Status "Operational execution state"
        text Action_Taken "Remedial repair summary (Nullable)"
    }
```

---

### 1.2 Conceptual Chen-Style Representation

```mermaid
flowchart TD
    E_CIT["CITIZEN"]
    E_COMP["COMPLAINT"]
    E_DEPT["DEPARTMENT"]
    E_STAFF["STAFF"]
    E_WO["WORK_ORDER"]

    R_SUB{"Submits"}
    R_HAND{"Handles"}
    R_EMP{"Employs"}
    R_GEN{"Generates"}
    R_PERF{"Performs"}

    E_CIT ===|"(0, N)"| R_SUB
    R_SUB ===|"(1, 1)"| E_COMP

    E_DEPT ===|"(0, N)"| R_HAND
    R_HAND ===|"(1, 1)"| E_COMP

    E_DEPT ===|"(0, N)"| R_EMP
    R_EMP ===|"(1, 1)"| E_STAFF

    E_COMP ===|"(0, N)"| R_GEN
    R_GEN ===|"(1, 1)"| E_WO

    E_STAFF ===|"(0, N)"| R_PERF
    R_PERF ===|"(1, 1)"| E_WO

    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;

    class E_CIT,E_COMP,E_DEPT,E_STAFF,E_WO entity;
    class R_SUB,R_HAND,R_EMP,R_GEN,R_PERF rel;
```

---

### 1.3 Entity Definitions & Attribute Directory

| Entity | Attribute Name | Key | Data Type | Nullable | Description & Domain |
|---|---|---|---|---|---|
| **CITIZEN** | `Citizen_ID` | **PK** | Integer (Serial) | No | Surrogate primary key identifying each resident. |
| | `Name` | | Varchar(100) | No | Resident full legal name. |
| | `Phone` | **UK** | Varchar(20) | No | Unique contact mobile number used for tracking. |
| | `Address` | | Text | No | Physical residential street address, landmark, or ward. |
| **DEPARTMENT** | `Department_ID` | **PK** | Integer (Serial) | No | Surrogate primary key for municipal service branch. |
| | `Department_Name` | **UK** | Varchar(100) | No | E.g., Water Supply, Sanitation, Roads, Street Lighting. |
| | `Office_Location` | | Varchar(200) | No | Physical depot or administrative headquarters address. |
| **STAFF** | `Staff_ID` | **PK** | Integer (Serial) | No | Surrogate primary key for municipal personnel. |
| | `Department_ID` | **FK** | Integer | No | Foreign key referencing parent `DEPARTMENT(Department_ID)`. |
| | `Name` | | Varchar(100) | No | Employee full name. |
| | `Phone` | | Varchar(20) | No | Direct staff telephone number for dispatch. |
| | `Designation` | | Varchar(100) | No | Official role title (e.g., Senior Inspector, Field Technician). |
| **COMPLAINT** | `Complaint_ID` | **PK** | Integer (Serial) | No | Unique tracking ticket number issued upon submission. |
| | `Citizen_ID` | **FK** | Integer | No | Mandatory foreign key referencing `CITIZEN(Citizen_ID)`. |
| | `Department_ID` | **FK** | Integer | No | Mandatory foreign key referencing `DEPARTMENT(Department_ID)`. |
| | `Complaint_Date` | | Timestamp | No | Submission timestamp (defaults to `CURRENT_TIMESTAMP`). |
| | `Category` | | Varchar(100) | No | Civic category (e.g., Pothole, Water Leak, Garbage Dumpster). |
| | `Description` | | Text | No | Detailed narrative describing the grievance (>= 10 chars). |
| | `Location` | | Varchar(255) | No | Physical street, intersection, or landmark of incident. |
| | `Status` | | Varchar(50) | No | `Submitted`, `Categorized`, `Assigned`, `In Progress`, `Resolved`, `Closed`. |
| **WORK_ORDER** | `WorkOrder_ID` | **PK** | Integer (Serial) | No | Unique field job ticket number. |
| | `Complaint_ID` | **FK** | Integer | No | Mandatory foreign key referencing `COMPLAINT(Complaint_ID)`. |
| | `Staff_ID` | **FK** | Integer | No | Mandatory foreign key referencing assigned `STAFF(Staff_ID)`. |
| | `Assigned_Date` | | Timestamp | No | Dispatch timestamp. |
| | `Completion_Date` | | Timestamp | Yes | Nullable timestamp populated upon physical resolution. |
| | `Work_Status` | | Varchar(50) | No | `Assigned`, `In Progress`, `Completed`, `On Hold`, `Cancelled`. |
| | `Action_Taken` | | Text | Yes | Summary of diagnostic findings, parts replaced, and repairs. |

---

### 1.4 Structural Constraints & Business Invariants

1. **Mandatory Submitter Ownership (`CITIZEN 1:N COMPLAINT`)**:
   - `(0, N)` on Citizen side; `(1, 1)` on Complaint side. Every complaint must trace back to exactly one registered resident. `ON DELETE RESTRICT` prevents accidental profile deletion.
2. **Mandatory Department Routing (`DEPARTMENT 1:N COMPLAINT`)**:
   - `(0, N)` on Department side; `(1, 1)` on Complaint side. Every complaint must belong to an authoritative municipal department.
3. **Mandatory Employment (`DEPARTMENT 1:N STAFF`)**:
   - `(0, N)` on Department side; `(1, 1)` on Staff side. Every staff member belongs to exactly one department.
4. **Deferred Work Order Generation (`COMPLAINT 1:N WORK_ORDER`)**:
   - `(0, N)` on Complaint side; `(1, 1)` on Work Order side. Newly registered complaints have `0` work orders. `ON DELETE CASCADE` ensures that purging a complaint cleans up subordinate job tickets.
5. **Mandatory Staff Assignment (`STAFF 1:N WORK_ORDER`)**:
   - `(0, N)` on Staff side; `(1, 1)` on Work Order side. Every dispatched work order is assigned to exactly one field technician.

---

## 2. Connection Traps Audit (Fan Trap & Chasm Trap)

Per Section 4.7 of Dr. S. M. Khalid's textbook, connection traps represent subtle semantic flaws where relationship pathways are ambiguous or broken:

### 2.1 Fan Trap Audit & Resolution (Section 4.7.5)
- **Structural Hazard**: Two `1:M` relationships fanning out from a common entity (`STAFF <--- 1:M --- DEPARTMENT --- 1:M ---> COMPLAINT`) create ambiguity when querying which staff member worked on which complaint.
- **Proof of Immunity in MCMS**: MCMS does **not** rely on `DEPARTMENT` to determine staff assignment. Instead, staff is directly associated with complaints through `WORK_ORDER`:
  $$\text{COMPLAINT} \xrightarrow{1:N} \text{WORK\_ORDER} \xleftarrow{1:N} \text{STAFF}$$
  Every work order explicitly pairs a specific complaint with a specific technician, eliminating all pathway ambiguity.

### 2.2 Chasm Trap Audit & Resolution (Section 4.7.6)
- **Structural Hazard**: An intermediate relationship with optional participation (`0..N`) breaks an expected relationship pathway for valid unassigned occurrences.
- **Proof of Immunity in MCMS**: If a complaint's department was only discoverable through its assigned work order (`COMPLAINT -> WORK_ORDER -> STAFF -> DEPARTMENT`), newly submitted tickets (which have `0` work orders) would be marooned without a department!
- MCMS resolves this by establishing an **independent, direct relationship**:
  $$\text{COMPLAINT} \xrightarrow{\text{handles (1:1)}} \text{DEPARTMENT}$$
  Even when `WorkOrders = ∅`, the complaint's department is immediately and authoritatively known.

---

## 3. Semantic Net (Occurrence Level)

### 3.1 Figure A: 1:N Submits Relationship

```mermaid
flowchart LR
    subgraph C_VALS ["Citizen Values & Attributes"]
        v_c1["Citizen_ID: C01<br/>Name: Ali Raza"]
        v_c2["Citizen_ID: C02<br/>Name: Sara Khan"]
    end

    subgraph C_SET ["CITIZEN Instances"]
        c1(("c1"))
        c2(("c2"))
    end

    subgraph R_SUB_SET ["SUBMITS Relationship Instances"]
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    subgraph K_SET ["COMPLAINT Instances"]
        k1(("k1"))
        k2(("k2"))
        k3(("k3"))
    end

    subgraph K_VALS ["Complaint Values & Attributes"]
        v_k1["Complaint_ID: K101<br/>Category: Sanitation"]
        v_k2["Complaint_ID: K102<br/>Category: Water Supply"]
        v_k3["Complaint_ID: K103<br/>Category: Streetlights"]
    end

    v_c1 -.- c1
    v_c2 -.- c2
    c1 ==> r1 ==> k1
    c1 ==> r2 ==> k2
    c2 ==> r3 ==> k3
    k1 -.- v_k1
    k2 -.- v_k2
    k3 -.- v_k3

    classDef citizen fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef complaint fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:11px;

    class c1,c2 citizen;
    class r1,r2,r3 rel;
    class k1,k2,k3 complaint;
    class v_c1,v_c2,v_k1,v_k2,v_k3 data;
```

---

### 3.2 Figure B: 1:N Generates Relationship & Partial Participation

Demonstrates that complaint `k3` has **zero work orders**, proving `0..N` optional participation:

```mermaid
flowchart LR
    subgraph K_VALS_B ["Complaint Values & Attributes"]
        v_k1b["Complaint_ID: K101<br/>Status: In Progress"]
        v_k2b["Complaint_ID: K102<br/>Status: Assigned"]
        v_k3b["Complaint_ID: K103<br/>Status: Submitted"]
    end

    subgraph K_SET_B ["COMPLAINT Instances"]
        k1b(("k1"))
        k2b(("k2"))
        k3b(("k3"))
    end

    subgraph R_GEN_SET ["GENERATES Relationship Instances"]
        rg1(("rg1"))
        rg2(("rg2"))
        rg3(("rg3"))
    end

    subgraph W_SET ["WORK_ORDER Instances"]
        w1(("w1"))
        w2(("w2"))
        w3(("w3"))
    end

    subgraph W_VALS ["Work Order Values & Attributes"]
        v_w1["WorkOrder_ID: WO11<br/>Work_Status: Completed"]
        v_w2["WorkOrder_ID: WO12<br/>Work_Status: In Progress"]
        v_w3["WorkOrder_ID: WO21<br/>Work_Status: Assigned"]
    end

    v_k1b -.- k1b
    v_k2b -.- k2b
    v_k3b -.- k3b

    k1b ==> rg1 ==> w1
    k1b ==> rg2 ==> w2
    k2b ==> rg3 ==> w3

    %% Notice: k3b has NO outgoing edges (0..N Partial Participation)

    w1 -.- v_w1
    w2 -.- v_w2
    w3 -.- v_w3

    classDef complaint fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef wo fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:11px;

    class k1b,k2b,k3b complaint;
    class rg1,rg2,rg3 rel;
    class w1,w2,w3 wo;
    class v_k1b,v_k2b,v_k3b,v_w1,v_w2,v_w3 data;
```

---

### 3.3 Figure C: Master Multi-Entity Occurrence Network

```mermaid
flowchart TD
    c1(("c1<br/>Ali Raza"))
    c2(("c2<br/>Sara Khan"))

    r_sub1(("sub1"))
    r_sub2(("sub2"))
    r_sub3(("sub3"))

    k1(("k1<br/>K101: Trash"))
    k2(("k2<br/>K102: Water"))
    k3(("k3<br/>K103: Light"))

    r_h1(("hnd1"))
    r_h2(("hnd2"))
    r_h3(("hnd3"))

    d3(("d3<br/>Solid Waste"))
    d1(("d1<br/>Water Supply"))
    d4(("d4<br/>Street Lighting"))

    r_g1(("gen1"))
    r_g2(("gen2"))

    w1(("w1<br/>WO11"))
    w2(("w2<br/>WO21"))

    r_p1(("perf1"))
    r_p2(("perf2"))

    r_e1(("emp1"))
    r_e2(("emp2"))

    s5(("s5<br/>Tariq"))
    s2(("s2<br/>Farhan"))

    c1 ==> r_sub1 ==> k1
    c1 ==> r_sub2 ==> k2
    c2 ==> r_sub3 ==> k3

    k1 ==> r_h1 ==> d3
    k2 ==> r_h2 ==> d1
    k3 ==> r_h3 ==> d4

    k1 ==> r_g1 ==> w1
    k2 ==> r_g2 ==> w2

    s5 ==> r_p1 ==> w1
    s2 ==> r_p2 ==> w2

    d3 ==> r_e1 ==> s5
    d1 ==> r_e2 ==> s2

    classDef cit fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef cmp fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef dep fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#15803d,font-weight:bold;
    classDef stf fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#6d28d9,font-weight:bold;
    classDef wod fill:#ffedd5,stroke:#ea580c,stroke-width:2px,color:#c2410c,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:1px,color:#92400e;

    class c1,c2 cit;
    class k1,k2,k3 cmp;
    class d1,d3,d4 dep;
    class s2,s5 stf;
    class w1,w2 wod;
    class r_sub1,r_sub2,r_sub3,r_h1,r_h2,r_h3,r_g1,r_g2,r_p1,r_p2,r_e1,r_e2 rel;
```

---

### 3.4 Diagnostic Query Path Validations (Section 4.7.4)
1. **Department Resolution for Ticket K101**:
   $$\text{c1} \xrightarrow{\text{sub1}} \text{k1} \xrightarrow{\text{hnd1}} \text{d3} \quad (\text{Solid Waste Management})$$
2. **Technician Resolution for Dispatched Work Order WO11**:
   $$\text{k1} \xrightarrow{\text{gen1}} \text{w1} \xleftarrow{\text{perf1}} \text{s5} \quad (\text{Tariq - Field Technician})$$
3. **Department Discovery for Unassigned Ticket K103**:
   $$\text{k3} \xrightarrow{\text{hnd3}} \text{d4} \quad (\text{Street Lighting})$$
   Proves the pathway remains unbroken even with `0` work orders.

---

## 4. Data Flow Diagrams (DFDs)

### 4.1 Level 0 (Context Diagram)

```mermaid
flowchart TD
    ADMIN["🏛️ MUNICIPAL ADMINISTRATION"]
    CITIZEN["👤 CITIZEN"]
    STAFF["👷 MUNICIPAL STAFF"]

    SYSTEM(("⚙️ 0<br/>MUNICIPAL<br/>COMPLAINT<br/>MANAGEMENT<br/>SYSTEM"))

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

### 4.2 Level 1 (Diagram 0)

```mermaid
flowchart TB
    subgraph ENTITIES ["External Stakeholders"]
        CITIZEN["👤 CITIZEN"]
        STAFF["👷 MUNICIPAL STAFF"]
        ADMIN["🏛️ MUNICIPAL ADMINISTRATION"]
    end

    subgraph PROCESSES ["Core System Processes"]
        P1(("1.0<br/>MANAGE<br/>CITIZEN<br/>PROFILES"))
        P2(("2.0<br/>REGISTER<br/>& ROUTE<br/>COMPLAINTS"))
        P3(("3.0<br/>ASSIGN<br/>DEPT & WORK<br/>ORDERS"))
        P4(("4.0<br/>TRACK &<br/>UPDATE TICKET<br/>STATUS"))
        P5(("5.0<br/>GENERATE<br/>MUNICIPAL<br/>REPORTS"))
    end

    subgraph STORES ["Persistent Data Stores"]
        D1[("D1: CITIZEN RECORDS")]
        D2[("D2: COMPLAINT RECORDS")]
        D3[("D3: DEPARTMENT RECORDS")]
        D4[("D4: STAFF RECORDS")]
        D5[("D5: WORK ORDER RECORDS")]
    end

    CITIZEN -- "REGISTRATION DETAILS" --> P1
    P1 -- "NEW CITIZEN RECORD" --> D1

    CITIZEN -- "COMPLAINT DETAILS" --> P2
    D1 -. "VERIFIED CITIZEN DATA" .-> P2
    D3 -. "DEPARTMENT TAXONOMY" .-> P2
    P2 -- "NEW COMPLAINT RECORD" --> D2
    P2 -- "COMPLAINT NUMBER & ACKNOWLEDGMENT<br/>CORRECTION MESSAGE" --> CITIZEN

    D2 -. "PENDING COMPLAINT" .-> P3
    D3 -. "DEPARTMENT CAPACITY" .-> P3
    D4 -. "AVAILABLE STAFF" .-> P3
    ADMIN -- "DEPARTMENT & STAFF INFORMATION" --> P3
    P3 -- "NEW WORK ORDER" --> D5
    P3 -- "ASSIGNED COMPLAINTS, WORK ORDERS, TASK DETAILS" --> STAFF

    STAFF -- "WORK UPDATES, ACTION TAKEN, COMPLETION INFO" --> P4
    CITIZEN -- "COMPLAINT INQUIRY" --> P4
    P4 -- "STATUS & WORK PROGRESS" --> D2
    P4 -- "WORK ORDER EXECUTION STATE" --> D5
    P4 -- "STATUS INFORMATION, RESOLUTION INFORMATION" --> CITIZEN

    ADMIN -- "REPORTING REQUESTS" --> P5
    D1 -. "CITIZEN METRICS" .-> P5
    D2 -. "COMPLAINT HISTORIES" .-> P5
    D3 -. "DEPT PERFORMANCE" .-> P5
    D4 -. "STAFF UTILIZATION" .-> P5
    D5 -. "WORK ORDER AUDIT" .-> P5
    P5 -- "COMPLAINT REPORTS, DEPARTMENT PERFORMANCE, PENDING WORK" --> ADMIN

    classDef entity fill:#f8fafc,stroke:#334155,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef process fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef store fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;

    class CITIZEN,STAFF,ADMIN entity;
    class P1,P2,P3,P4,P5 process;
    class D1,D2,D3,D4,D5 store;
```

---

### 4.3 Level 2 (Process 2.0: Register & Route Complaints)

```mermaid
flowchart TD
    subgraph P2 ["PROCESS 2.0: REGISTER & ROUTE COMPLAINTS"]
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
    D1 -. "VERIFIED CITIZEN DATA" .-> P2_2

    P2_2 -- "CORRECTION MESSAGE (FAILED)" --> CITIZEN
    P2_2 -- "VALIDATED DETAILS" --> P2_3
    P2_3 -- "STANDARDIZED CATEGORY" --> P2_4
    D3 -. "DEPARTMENT TAXONOMY" .-> P2_4
    P2_4 -- "ROUTED COMPLAINT PACKET" --> P2_5
    P2_5 -- "NEW COMPLAINT RECORD" --> D2
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

### 4.4 Parent-Child Balancing Verification

* Every boundary input to `Process 0` is conserved across Level 1 processes `1.0` through `5.0`.
* Every boundary output from `Process 0` is emitted by a specific Level 1 process.
* Sub-processes `2.1` to `2.6` collectively conserve the inputs, store reads (`D1`, `D3`), store writes (`D2`), and external outputs of parent process `2.0`.
* Zero direct store-to-entity, store-to-store, or entity-to-store connections exist.
* Zero Black Holes, Miracles, or Gray Holes exist.

---

## 5. Complete System Data Dictionary

### 5.1 Data Flow Compositions
```
Data Flow Name: REGISTRATION DETAILS
Composition:    Citizen_Name + Citizen_Phone + Citizen_Address
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT DETAILS
Composition:    Citizen_Phone + Category_Raw + Description + Incident_Location
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT NUMBER & ACKNOWLEDGMENT
Composition:    Complaint_Number + Submission_Date + Initial_Status + Responsible_Department + Receipt_Text
Type:           Payload (Outbound)

Data Flow Name: CORRECTION MESSAGE
Composition:    Error_Code + Error_Field + User_Guidance_Text
Type:           Payload (Outbound)

Data Flow Name: NEW WORK ORDER
Composition:    WorkOrder_ID + Complaint_ID + Staff_ID + Assigned_Date + Target_SLA + Initial_Status
Type:           Record (Intersystem / Store Write)

Data Flow Name: WORK UPDATES
Composition:    WorkOrder_ID + New_Work_Status + Action_Taken_Summary + [Completion_Timestamp]
Type:           Payload (Inbound)

Data Flow Name: COMPLAINT INQUIRY
Composition:    Complaint_ID | Citizen_Phone
Type:           Query (Inbound)

Data Flow Name: STATUS INFORMATION & RESOLUTION INFORMATION
Composition:    Complaint_ID + Current_Status + Department_Name + Assigned_Staff_Name + Work_Status + Action_Taken + [Completion_Date]
Type:           Payload (Outbound)
```

### 5.2 Data Store Specifications
* **`D1: CITIZEN RECORDS`**: `{ <u>Citizen_ID</u>, Name, Phone [UK], Address, created_at }`
* **`D2: COMPLAINT RECORDS`**: `{ <u>Complaint_ID</u>, Citizen_ID [FK], Department_ID [FK], Complaint_Date, Category, Description, Location, Status }`
* **`D3: DEPARTMENT RECORDS`**: `{ <u>Department_ID</u>, Department_Name [UK], Office_Location }`
* **`D4: STAFF RECORDS`**: `{ <u>Staff_ID</u>, Department_ID [FK], Name, Phone, Designation, is_active }`
* **`D5: WORK ORDER RECORDS`**: `{ <u>WorkOrder_ID</u>, Complaint_ID [FK], Staff_ID [FK], Assigned_Date, Completion_Date, Work_Status, Action_Taken }`

---

## 6. Implementation Traceability
All conceptual diagram constructs map directly to production software artifacts:
* **ERD Relations ➔ Django ORM Models**: [`backend/complaints/models.py`](../../backend/complaints/models.py)
* **DFD Process 2.0 ➔ ViewSet & Serializers**: [`backend/complaints/views.py`](../../backend/complaints/views.py) & [`serializers.py`](../../backend/complaints/serializers.py)
* **DFD Inquiries & Portal Views ➔ Next.js Pages**: [`frontend/src/app/page.tsx`](../../frontend/src/app/page.tsx)
