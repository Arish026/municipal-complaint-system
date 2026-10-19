# Backend Service — Django REST Framework (DRF)

REST API and business logic service for the Municipal Complaint Management System (MCMS).

## Responsibilities
- **Data Modeling & Migrations**: Maps relational schema (Citizen, Department, Staff, Complaint, Work Order, Decision Audit Log).
- **RESTful Endpoints**: Provides CRUD operations, lifecycle transition endpoints, and inquiry APIs.
- **Validation & Business Logic**: Server-side validation for phone numbers, department mapping, and status rules.
- **Decision-Support Engine**: Evaluates overdue SLAs, workload balances, and records audit logs.

## Quickstart

### 1. Prerequisites
- Python 3.10+
- PostgreSQL instance running

### 2. Local Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env

# Run database migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

The API will be accessible at `http://127.0.0.1:8000/`.
