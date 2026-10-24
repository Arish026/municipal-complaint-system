# Database Layer — PostgreSQL

Relational database schemas, constraints, indexes, and synthetic datasets for the Municipal Complaint Management System (MCMS).

---

## Files

| File | Purpose |
|---|---|
| [`schema.sql`](schema.sql) | DDL schema defining all 5 core tables (`CITIZEN`, `DEPARTMENT`, `STAFF`, `COMPLAINT`, `WORK_ORDER`) and `DECISION_AUDIT_LOG` with constraints and indexes. |
| [`seed_data.sql`](seed_data.sql) | Synthetic population dataset generated via `scripts/seed_synthetic_data.py` for testing and demonstration. |
| [`queries/`](queries/) | Categorized query repository (DDL, DML, Operational CRUD, KPI Reports, ACID Transactions, Relational Algebra, Connection Traps). |

---

## Initialization via Docker Compose
When starting services with `docker compose up`, PostgreSQL automatically loads and executes files in `/docker-entrypoint-initdb.d/` in alphabetical order:
1. `01_schema.sql` (mapped from `database/schema.sql`)
2. `02_seed.sql` (mapped from `database/seed_data.sql`)

## Manual Local Setup
```bash
# Create and load schema
psql -U postgres -d municipal_db -f database/schema.sql

# Load seed data
psql -U postgres -d municipal_db -f database/seed_data.sql
```
