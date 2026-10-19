# Semantic Net (Occurrence Level)

**Project**: Municipal Complaint Management System (MCMS)  
**Standard**: Occurrence-Level Semantic Modeling | Binary Relationship Populations  
**Course Reference**: University of Karachi — BS Computer Science — Database Management Systems (DBMS)

---

## 1. Conceptual Foundation

While an Entity-Relationship Diagram (ERD) defines the **schema-level rules** (intension), a **Semantic Net at the occurrence level** visualizes a **sample population** (extension). It validates declared $1:N$ relationships by mapping concrete entity instances and relationship occurrences:

* **Oval / Boundary**: Represents a set of occurrences (e.g., all citizen instances or all relationship instances).
* **Dot / Node**: Represents one discrete occurrence (entity or relationship).
* **Path (Entity $\to$ Relationship $\to$ Entity)**: Represents one discrete relationship occurrence.

---

## 2. Figure A: 1:N Submits Relationship

### 2.1 Description
Illustrates that citizen $c_1$ (`Ali Raza`) submits two complaints ($k_1, k_2$), while citizen $c_2$ (`Sara Khan`) submits complaint $k_3$. Each complaint is connected to **exactly one** citizen.

### 2.2 Visual Semantic Network

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

    %% Attribute bindings
    v_c1 -.- c1
    v_c2 -.- c2

    %% Relationship paths
    c1 ==> r1 ==> k1
    c1 ==> r2 ==> k2
    c2 ==> r3 ==> k3

    %% Complaint attribute bindings
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

### 2.3 Occurrence Mapping Table (Figure A)

| Path ID | Citizen Entity ($c_i$) | Citizen Values | Relationship ($r_i$) | Complaint Entity ($k_i$) | Complaint Values | Rule Demonstrated |
|---|---|---|---|---|---|---|
| **Path 1** | $c_1$ | `C01`, Ali Raza | $r_1$ | $k_1$ | `K101`, Sanitation | One citizen submits first complaint |
| **Path 2** | $c_1$ | `C01`, Ali Raza | $r_2$ | $k_2$ | `K102`, Water Supply | Same citizen ($c_1$) submits second complaint |
| **Path 3** | $c_2$ | `C02`, Sara Khan | $r_3$ | $k_3$ | `K103`, Streetlights | Citizen $c_2$ submits third complaint |

**Conclusion**: Multiple edges emanate from $c_1$ ($1 \to N$), but each complaint node ($k_1, k_2, k_3$) has indegree $= 1$, proving **mandatory single-citizen ownership** ($N \to 1$).

---

## 3. Figure B: 1:N Generates Relationship

### 3.1 Description
Illustrates that complaint $k_1$ (`In Progress`) has generated two work orders ($w_1, w_2$), complaint $k_2$ (`Assigned`) has generated one work order ($w_3$), and newly registered complaint $k_3$ (`Submitted`) has generated zero work orders.

### 3.2 Visual Semantic Network

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

    %% Notice: k3 has NO outgoing edges (0 work orders)

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

### 3.3 Occurrence Mapping Table (Figure B)

| Path ID | Complaint Entity ($k_i$) | Complaint Status | Relationship ($r_i$) | Work Order ($w_i$) | Work Order Status | Rule Demonstrated |
|---|---|---|---|---|---|---|
| **Path 1** | $k_1$ | `K101`, In Progress | $r_1$ | $w_1$ | `WO11`, Completed | Initial phase completed |
| **Path 2** | $k_1$ | `K101`, In Progress | $r_2$ | $w_2$ | `WO12`, In Progress | Second phase active for same ticket |
| **Path 3** | $k_2$ | `K102`, Assigned | $r_3$ | $w_3$ | `WO21`, Assigned | Single work order assigned |
| **(None)** | $k_3$ | `K103`, Submitted | *(None)* | *(None)* | *(None)* | **Zero work orders** (queue stage) |

**Conclusion**: Demonstrates the **optionality ($0..N$)** of work orders on the complaint side. A complaint exists as soon as submitted, while work orders exist **only after work is assigned**.

---

## 4. Formal Relational Semantics

1. **Relation $\text{Submits} \subseteq \text{CITIZEN} \times \text{COMPLAINT}$**:
   $$\forall k \in \text{COMPLAINT}, \quad \exists ! c \in \text{CITIZEN} \quad \text{such that } (c, k) \in \text{Submits}$$
   Each complaint maps to a unique citizen (functional dependency: $\text{Complaint\_ID} \to \text{Citizen\_ID}$).

2. **Relation $\text{Generates} \subseteq \text{COMPLAINT} \times \text{WORK\_ORDER}$**:
   $$\forall w \in \text{WORK\_ORDER}, \quad \exists ! k \in \text{COMPLAINT} \quad \text{such that } (k, w) \in \text{Generates}$$
   Each work order maps to a unique complaint ($\text{WorkOrder\_ID} \to \text{Complaint\_ID}$), but complaints may have an empty work order set ($\emptyset$).

---

## Related Diagrams
- [Entity-Relationship Diagram (ERD)](erd.md)
- [DFD Level 0 (Context Diagram)](dfd_level_0.md)
- [DFD Level 1 (Diagram 0)](dfd_level_1.md)
- [DFD Level 2 (Process 2.0)](dfd_level_2.md)
