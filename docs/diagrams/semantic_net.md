# Semantic Net (Occurrence Level) & Diagnostic Validation

**Project**: Municipal Complaint Management System (MCMS)  
**Course**: Database Management Systems (DBMS) — University of Karachi (BSCS)  
**Course Textbook**: *Database Systems Textbook*, Chapter 4 (Database Design), Section 4.5 & 4.7.4  
**Author & Compiler**: Dr. S. M. Khalid  
**Standard**: Occurrence-Level Semantic Modeling & Diagnostic Query Path Validation

---

## 1. Conceptual Foundation (Textbook Section 4.5.1)

While an **Entity-Relationship Diagram (ERD)** defines schema-level abstractions and invariants (**intension**), a **Semantic Net at the occurrence level** visualizes a concrete sample population (**extension**).

Per Section 4.5 of Dr. S. M. Khalid's textbook:
* **Pedagogical & Diagnostic Role (Section 4.5.1.4 & 4.7.4)**: An occurrence-level network allows modelers and stakeholders to test whether declared structural constraints (cardinality ratios and participation rules) hold true when real-world instances are populated, and whether enterprise queries can be answered without ambiguity.
* **Textbook Multi-Column Architecture (Section 4.5.2 & Figures 4.18–4.21)**:
  - **Entity Occurrences**: Distinct oval nodes (`c1`, `k1`, `d1`, `s1`, `w1`) representing discrete entity instances.
  - **Relationship Occurrences**: Dedicated intermediate nodes (`r1`, `r2`, ...) representing specific relationship instances.
  - **Attribute Valuation**: Attribute names and concrete values displayed adjacent to entity instances.
  - **Participant Paths**: Directed vectors traversing `Entity Occurrence ➔ Relationship Occurrence ➔ Entity Occurrence`.
  - **Demonstration of Partial Participation (Section 4.5.6)**: Non-participating entity instances remain visible inside the entity oval with **zero connecting edges**, providing concrete visual proof of optional `(0, N)` participation.

---

## 2. Figure A: 1:N Submits Relationship (Textbook Figure 4.20 Standard)

### 2.1 Description & Rules Illustrated
Demonstrates that resident `c1` (*Ali Raza*) submits two distinct complaints (`k1` and `k2`), while resident `c2` (*Sara Khan*) submits complaint `k3`.
* **Cardinality (`1 : N`)**: Multiple paths diverge from `c1`, but each complaint node (`k1`, `k2`, `k3`) has an indegree of exactly `1`.
* **Total Participation on Complaint Side (`1, 1`)**: Every complaint node is connected to exactly one relationship occurrence. No orphaned complaints can exist.

### 2.2 Visual Semantic Network (Figure A)

```mermaid
flowchart LR
    %% Citizen Attribute Values
    subgraph C_VALS ["Citizen Values & Attributes"]
        v_c1["Citizen_ID: C01<br/>Name: Ali Raza<br/>Phone: 0300-1112233"]
        v_c2["Citizen_ID: C02<br/>Name: Sara Khan<br/>Phone: 0321-4445566"]
    end

    %% Citizen Entity Instances (Oval)
    subgraph C_SET ["CITIZEN Instances"]
        c1(("c1"))
        c2(("c2"))
    end

    %% Submits Relationship Occurrences (Oval)
    subgraph R_SUB_SET ["SUBMITS Relationship Instances"]
        r1(("r1"))
        r2(("r2"))
        r3(("r3"))
    end

    %% Complaint Entity Instances (Oval)
    subgraph K_SET ["COMPLAINT Instances"]
        k1(("k1"))
        k2(("k2"))
        k3(("k3"))
    end

    %% Complaint Attribute Values
    subgraph K_VALS ["Complaint Values & Attributes"]
        v_k1["Complaint_ID: K101<br/>Category: Sanitation<br/>Status: In Progress"]
        v_k2["Complaint_ID: K102<br/>Category: Water Supply<br/>Status: Assigned"]
        v_k3["Complaint_ID: K103<br/>Category: Streetlights<br/>Status: Submitted"]
    end

    %% Attribute Bindings
    v_c1 -.- c1
    v_c2 -.- c2

    %% Relationship Occurrence Paths
    c1 ==> r1 ==> k1
    c1 ==> r2 ==> k2
    c2 ==> r3 ==> k3

    %% Complaint Bindings
    k1 -.- v_k1
    k2 -.- v_k2
    k3 -.- v_k3

    %% Styling Definitions
    classDef citizen fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef complaint fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:11px;

    class c1,c2 citizen;
    class r1,r2,r3 rel;
    class k1,k2,k3 complaint;
    class v_c1,v_c2,v_k1,v_k2,v_k3 data;
```

### 2.3 Occurrence Mapping Table (Figure A)

| Path ID | Citizen Instance (`ci`) | Citizen Values | Relationship (`ri`) | Complaint Instance (`ki`) | Complaint Values | Rule Validated |
|---|---|---|---|---|---|---|
| **Path 1** | `c1` | `C01`, Ali Raza | `r1` | `k1` | `K101`, Sanitation | Citizen submits first complaint |
| **Path 2** | `c1` | `C01`, Ali Raza | `r2` | `k2` | `K102`, Water Supply | Same citizen `c1` submits second complaint (`1 → N`) |
| **Path 3** | `c2` | `C02`, Sara Khan | `r3` | `k3` | `K103`, Streetlights | Citizen `c2` submits third complaint |

---

## 3. Figure B: 1:N Generates Relationship & Partial Participation (Textbook Section 4.5.6)

### 3.1 Description & Rules Illustrated
Demonstrates that complaint `k1` (*Sanitation*) has generated two work orders (`w1` and `w2`), complaint `k2` (*Water Supply*) has generated one work order (`w3`), while complaint `k3` (*Submitted*) has generated **zero work orders**.
* **Optional / Partial Participation on Complaint Side (`0..N`)**: Entity instance `k3` appears inside the Complaint set with **zero outgoing relationship edges**, visually illustrating that complaints exist in the initial submission state without requiring work orders.
* **Mandatory Participation on Work Order Side (`1..1`)**: Every work order node (`w1`, `w2`, `w3`) connects to exactly one parent complaint.

### 3.2 Visual Semantic Network (Figure B)

```mermaid
flowchart LR
    %% Complaint Values
    subgraph K_VALS_B ["Complaint Values & Attributes"]
        v_k1b["Complaint_ID: K101<br/>Status: In Progress"]
        v_k2b["Complaint_ID: K102<br/>Status: Assigned"]
        v_k3b["Complaint_ID: K103<br/>Status: Submitted"]
    end

    %% Complaint Instances (Oval)
    subgraph K_SET_B ["COMPLAINT Instances"]
        k1b(("k1"))
        k2b(("k2"))
        k3b(("k3"))
    end

    %% Generates Relationship Instances (Oval)
    subgraph R_GEN_SET ["GENERATES Relationship Instances"]
        rg1(("rg1"))
        rg2(("rg2"))
        rg3(("rg3"))
    end

    %% Work Order Instances (Oval)
    subgraph W_SET ["WORK_ORDER Instances"]
        w1(("w1"))
        w2(("w2"))
        w3(("w3"))
    end

    %% Work Order Values
    subgraph W_VALS ["Work Order Values & Attributes"]
        v_w1["WorkOrder_ID: WO11<br/>Work_Status: Completed"]
        v_w2["WorkOrder_ID: WO12<br/>Work_Status: In Progress"]
        v_w3["WorkOrder_ID: WO21<br/>Work_Status: Assigned"]
    end

    %% Attribute Bindings
    v_k1b -.- k1b
    v_k2b -.- k2b
    v_k3b -.- k3b

    %% Relationship Occurrence Paths
    k1b ==> rg1 ==> w1
    k1b ==> rg2 ==> w2
    k2b ==> rg3 ==> w3

    %% Notice: k3b has NO outgoing edges (Illustrates 0..N Partial Participation)

    w1 -.- v_w1
    w2 -.- v_w2
    w3 -.- v_w3

    %% Styling
    classDef complaint fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1,font-weight:bold;
    classDef rel fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e,font-weight:bold;
    classDef wo fill:#f1f5f9,stroke:#475569,stroke-width:2px,color:#0f172a,font-weight:bold;
    classDef data fill:#ffffff,stroke:#94a3b8,stroke-width:1px,color:#1e293b,font-size:11px;

    class k1b,k2b,k3b complaint;
    class rg1,rg2,rg3 rel;
    class w1,w2,w3 wo;
    class v_k1b,v_k2b,v_k3b,v_w1,v_w2,v_w3 data;
```

### 3.3 Occurrence Mapping Table (Figure B)

| Path ID | Complaint Instance (`ki`) | Complaint Status | Relationship (`ri`) | Work Order (`wi`) | Work Order Status | Rule Validated |
|---|---|---|---|---|---|---|
| **Path 1** | `k1` | `K101`, In Progress | `rg1` | `w1` | `WO11`, Completed | Initial remediation task completed |
| **Path 2** | `k1` | `K101`, In Progress | `rg2` | `w2` | `WO12`, In Progress | Second active task on same ticket (`1 → N`) |
| **Path 3** | `k2` | `K102`, Assigned | `rg3` | `w3` | `WO21`, Assigned | Single field job order assigned |
| **(None)** | `k3` | `K103`, Submitted | *(None)* | *(None)* | *(None)* | **Zero work orders**: Validates `0..N` partial participation |

---

## 4. Figure C: Master Multi-Entity Occurrence Network (Textbook Section 4.5.9)

Figure C integrates all five database entities across the enterprise domain, illustrating concrete inter-entity connectivity and validating complex multi-hop queries:

```mermaid
flowchart TD
    %% Citizens
    c1(("c1<br/>Ali Raza"))
    c2(("c2<br/>Sara Khan"))

    %% Submits Relationship
    r_sub1(("sub1"))
    r_sub2(("sub2"))
    r_sub3(("sub3"))

    %% Complaints
    k1(("k1<br/>K101: Trash"))
    k2(("k2<br/>K102: Water"))
    k3(("k3<br/>K103: Light"))

    %% Department Handles Relationship
    r_h1(("hnd1"))
    r_h2(("hnd2"))
    r_h3(("hnd3"))

    %% Departments
    d3(("d3<br/>Solid Waste"))
    d1(("d1<br/>Water Supply"))
    d4(("d4<br/>Street Lighting"))

    %% Generates Relationship
    r_g1(("gen1"))
    r_g2(("gen2"))

    %% Work Orders
    w1(("w1<br/>WO11"))
    w2(("w2<br/>WO21"))

    %% Staff Performs Relationship
    r_p1(("perf1"))
    r_p2(("perf2"))

    %% Staff Employs Relationship
    r_e1(("emp1"))
    r_e2(("emp2"))

    %% Staff
    s5(("s5<br/>Tariq (Sweeper)"))
    s2(("s2<br/>Farhan (Plumber)"))

    %% Submits Paths
    c1 ==> r_sub1 ==> k1
    c1 ==> r_sub2 ==> k2
    c2 ==> r_sub3 ==> k3

    %% Handles Paths (Direct Department Routing)
    k1 ==> r_h1 ==> d3
    k2 ==> r_h2 ==> d1
    k3 ==> r_h3 ==> d4

    %% Generates Paths
    k1 ==> r_g1 ==> w1
    k2 ==> r_g2 ==> w2

    %% Performs Paths
    s5 ==> r_p1 ==> w1
    s2 ==> r_p2 ==> w2

    %% Employs Paths
    d3 ==> r_e1 ==> s5
    d1 ==> r_e2 ==> s2

    %% Styling
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

## 5. Diagnostic Query Traversals & Trap Audit (Textbook Section 4.7.4, 4.7.5, 4.7.6)

Section 4.7 mandates testing the conceptual model against representative business questions using occurrence paths:

### 5.1 Query 1: Department Attribution for Citizen Grievance
* **Question**: *"Which municipal department is responsible for complaint K101 submitted by citizen Ali Raza (c1)?"*
* **Occurrence Path**:
  $$\text{c1} \xrightarrow{\text{sub1}} \text{k1} \xrightarrow{\text{hnd1}} \text{d3} \quad (\text{Solid Waste Management})$$
* **Outcome**: Single unambiguous path. Resolves directly in 2 hops without guessing.

### 5.2 Query 2: Technician Identification for Dispatched Ticket
* **Question**: *"Which technician executed work order WO11 for complaint K101?"*
* **Occurrence Path**:
  $$\text{k1} \xrightarrow{\text{gen1}} \text{w1} \xleftarrow{\text{perf1}} \text{s5} \quad (\text{Tariq - Field Technician})$$
* **Outcome**: Resolves unambiguously through the `WORK_ORDER` associative entity.

### 5.3 Diagnostic Proof: Absence of Fan Trap (Section 4.7.5)
* **Trap Scenario**: If technician assignment were queried through department (`k1 -> d3 -> s5`), a Fan Trap would exist because department `d3` employs multiple staff members.
* **Occurrence Evidence**: In Figure C, `k1` connects to `s5` **only through work order `w1`**, not through `d3`. The model guarantees an unambiguous pairing between technician and ticket.

### 5.4 Diagnostic Proof: Absence of Chasm Trap (Section 4.7.6)
* **Trap Scenario**: If a complaint's department was discovered through staff/work orders (`k3 -> w? -> s? -> d?`), unassigned ticket `k3` would be marooned with no path to a department because it has `0` work orders.
* **Occurrence Evidence**: In Figure C, complaint `k3` has a direct, unbroken relationship path `k3 ==> hnd3 ==> d4` (*Street Lighting*), proving that department routing is independent of staff allocation. **No Chasm Trap exists.**

---

## 6. Formal Relational Semantics (Textbook Section 4.5.3 & 4.10)

### 6.1 Submits Mapping
$$\text{Submits} \subseteq \text{CITIZEN} \times \text{COMPLAINT}$$
$$\forall k \in \text{COMPLAINT}, \quad \exists! c \in \text{CITIZEN} \quad \text{such that} \quad (c, k) \in \text{Submits}$$
* **Functional Dependency**: $\text{Complaint\_ID} \rightarrow \text{Citizen\_ID}$

### 6.2 Handles Mapping
$$\text{Handles} \subseteq \text{DEPARTMENT} \times \text{COMPLAINT}$$
$$\forall k \in \text{COMPLAINT}, \quad \exists! d \in \text{DEPARTMENT} \quad \text{such that} \quad (d, k) \in \text{Handles}$$
* **Functional Dependency**: $\text{Complaint\_ID} \rightarrow \text{Department\_ID}$

### 6.3 Generates Mapping
$$\text{Generates} \subseteq \text{COMPLAINT} \times \text{WORK\_ORDER}$$
$$\forall w \in \text{WORK\_ORDER}, \quad \exists! k \in \text{COMPLAINT} \quad \text{such that} \quad (k, w) \in \text{Generates}$$
* **Functional Dependency**: $\text{WorkOrder\_ID} \rightarrow \text{Complaint\_ID}$

---

## 7. Related Modeling Deliverables
* 🌐 **[DFD Level 0 (Context Diagram)](dfd_level_0.md)** — Highest-level operational boundary.
* 🔀 **[DFD Level 1 (Diagram 0)](dfd_level_1.md)** — Functional decomposition into processes `1.0` to `5.0`.
* 🔍 **[DFD Level 2 (Process 2.0)](dfd_level_2.md)** — Child explosion of `Process 2.0` with mini-specs.
* 📊 **[Entity-Relationship Diagram (ERD)](erd.md)** — Conceptual schema and structural constraints.
* 📑 **[Master Modeling README](README.md)** — Consolidated system documentation and data dictionary.
