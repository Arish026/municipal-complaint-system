# Software Requirements Specification (SRS)

## Project: Municipal Complaint Management System

### 1. Technology Stack
- **Frontend**: Next.js (React, TypeScript / JavaScript, Modern Responsive CSS)
- **Backend**: Django REST Framework (DRF, Python)
- **Database**: PostgreSQL (Relational DBMS with ACID compliance)
- **Deployment & Orchestration**: Docker, Docker Compose

---

### 2. Functional Requirements (FR)

| ID | Module | Description |
|---|---|---|
| **FR-01** | **Citizens** | Create and update citizen records (Name, Phone, Address, Unique Citizen ID). |
| **FR-02** | **Complaints Validation** | Validate citizen details and complaint inputs; return actionable correction messages for invalid data. |
| **FR-03** | **Categorization** | Categorize complaints (e.g., Water Supply, Road Maintenance, Waste Management) and map to responsible department. |
| **FR-04** | **Registration** | Persist complaints atomically, generate unique complaint numbers, and issue submission acknowledgments. |
| **FR-05** | **Work Assignment** | Generate work orders and assign qualified departmental staff to complaints. |
| **FR-06** | **Status Updates** | Record work performed, actions taken, completion timestamps, and complaint lifecycle status changes. |
| **FR-07** | **Inquiry** | Provide citizens with instant complaint status lookups and detailed resolution tracking. |
| **FR-08** | **Reporting** | Generate complaint lifecycle reports, departmental performance summaries, and pending-work backlogs. |
| **FR-09** | **Alerts & Decision-Support** | Generate explainable operational alerts (overdue, backlog, repetition); enforce human supervisor approval for consequential actions; record audit logs. |

---

### 3. Non-Functional Requirements (NFR)

#### Security
- Enforce role-based access control (RBAC) server-side across all endpoints.
- Protect personal identifiable information (PII).
- Prevent unauthorized access or modifications across citizen records.

#### Data Integrity
- Strict primary key (PK) and foreign key (FK) constraints.
- Mandatory complaint ownership and departmental assignment.
- Transactional consistency for state transitions (atomic commits/rollbacks).

#### Testing & Quality Assurance
- Automated tests covering CRUD operations on all entities.
- Workflow transition verification (e.g., Submitted → In Progress → Resolved → Verified).
- Integrity constraint validation under synthetic municipal test data.
