# Backend Service — Django REST Framework (DRF)

High-performance, RESTful API and business logic service for the Municipal Complaint Management System (MCMS), compliant with relational 3NF schema and DBMS academic standards.

---

## Responsibilities & Core Features
- **Relational 3NF Architecture**: Models `Citizen`, `Department`, `Staff`, `Complaint`, `WorkOrder`, and `DecisionAuditLog` with foreign key integrity.
- **Multi-Factor Dispatch Assignment (FR-05)**: Atomic assignment endpoint `POST /api/complaints/{id}/assign/` evaluating candidate technicians on workload queue, skill specialization, depot proximity, and SLA urgency.
- **Lifecycle & Status Synchronization (FR-06)**: Two-way status synchronization between `WorkOrder` and linked `Complaint` records.
- **Inquiry & Search Service (FR-07)**: High-speed telephone and ticket code lookups with phone number normalization.
- **Decision-Support Surveillance Engine (FR-09)**: SLA breach monitoring (>72h) and automated supervisory escalation alerts.
- **Health & Diagnostic Monitoring**: Live `/api/health/` endpoint verifying database connection, latency, and entity counts.

---

## API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health/` | Diagnostic health check (database status, timestamp, record counts) |
| `GET`, `POST` | `/api/citizens/` | Citizen profile registration & phone uniqueness enforcement |
| `GET` | `/api/departments/` | Department listing with office locations and categorization keywords |
| `GET` | `/api/staff/` | Active field staff listing (filterable by `?department_id=`) |
| `GET`, `POST` | `/api/complaints/` | List complaints and lodge new grievances (accepts camelCase & snake_case) |
| `POST` | `/api/complaints/validate/` | Validate citizen identity & narrative parameters (FR-02) |
| `POST` | `/api/complaints/categorize/` | Keyword-based department categorization (FR-03) |
| `GET` | `/api/complaints/track/` | Real-time tracking query by `?id=CMP-0001` or `?phone=0300...` (FR-07) |
| `POST` | `/api/complaints/{id}/assign/` | Multi-Factor dispatch: atomic assignment of field technician (FR-05) |
| `GET`, `POST` | `/api/work-orders/` | Work order listing (filterable by `?staff_id=`, `?work_status=`) |
| `PATCH` | `/api/work-orders/{id}/` | Update repair status and action remarks; syncs complaint (FR-06) |
| `GET` | `/api/agent/alerts/` | Decision-support escalation alert feed (FR-09) |
| `POST` | `/api/agent/alerts/{id}/decide/`| Supervisor decision sign-off (`Approved` or `Rejected`) |
| `GET` | `/api/reports/` | Executive administrative KPI report & aging backlog metrics (FR-08) |

---

## Local Setup & Quickstart

### 1. Prerequisites
- Python 3.10+
- SQLite (default) or PostgreSQL 16

### 2. Environment Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run database migrations
python manage.py migrate

# Seed database with realistic Karachi municipal dataset
python manage.py seed_db

# Run unit and integration tests
python manage.py test

# Start API server (port 8000)
python manage.py runserver
```

### 3. Verify Health
```bash
curl http://localhost:8000/api/health/
```
Response:
```json
{
  "status": "healthy",
  "service": "mcms-backend-api",
  "version": "1.0.0",
  "database": "connected",
  "timestamp": "2026-10-24T12:00:00Z",
  "counts": {
    "departments": 6,
    "complaints": 10,
    "staff": 12
  }
}
```
