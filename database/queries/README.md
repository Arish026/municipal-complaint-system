# Relational SQL Queries Directory

**Academic & Engineering Standard**: University of Karachi — BS Computer Science — Database Management Systems (DBMS)  
**Curriculum Syllabus**: Dr. S. M. Khalid (Chapters 1–4)  
**Target Relational Database**: PostgreSQL 16 (Native Relational Engine) / SQLite3 (Development Fallback)

---

## 🗂️ Query Directory Catalog

All project queries are organized and categorized into modular SQL files reflecting the full database lifecycle:

| File | Classification | Core DBMS Concept | DFD / SRS Mapping |
|:---|:---|:---|:---|
| [`01_ddl_and_constraints.sql`](01_ddl_and_constraints.sql) | **DDL** | 3NF Relational Tables, PK/FK Constraints, B-Tree Indexes | DFD D1–D5 Stores |
| [`02_dml_seed_dataset.sql`](02_dml_seed_dataset.sql) | **DML** | Karachi Municipal Population Data (6 Agencies, 12 Staff) | Seed Population |
| [`03_operational_transactions.sql`](03_operational_transactions.sql) | **DML & Transactions** | Citizen Intake, Categorization, Atomic Work Order Dispatch, Tracking | Processes 1.0 – 4.0 |
| [`04_analytical_kpi_reports.sql`](04_analytical_kpi_reports.sql) | **DQL & Aggregations** | Resolution Ratios, Categorical Volumes, SLA Aging Brackets, Workload | Process 5.0 (FR-08) |
| [`05_acid_transactions_and_concurrency.sql`](05_acid_transactions_and_concurrency.sql) | **TCL & Concurrency** | ACID Guarantees, `SELECT FOR UPDATE` Row Locks, Rollback Savepoints | ACID Engine |
| [`06_relational_algebra_mappings.sql`](06_relational_algebra_mappings.sql) | **Relational Theory** | $\sigma$ Selection, $\pi$ Projection, $\bowtie$ Natural Join, $\gamma$ Aggregation | Ch 4 § 4.3–4.4 |
| [`07_connection_traps_audit.sql`](07_connection_traps_audit.sql) | **Diagnostic Audit** | Formal Proofs Eliminating Fan Traps (§ 4.7.5) and Chasm Traps (§ 4.7.6) | Ch 4 § 4.7 |

---

## 🚀 Execution Instructions

### In PostgreSQL (Recommended)
```bash
# 1. Run DDL & create tables with constraints
psql -U postgres -d municipal_db -f database/queries/01_ddl_and_constraints.sql

# 2. Seed initial Karachi municipal dataset
psql -U postgres -d municipal_db -f database/queries/02_dml_seed_dataset.sql

# 3. Execute operational dispatch queries
psql -U postgres -d municipal_db -f database/queries/03_operational_transactions.sql

# 4. Generate management KPI reports
psql -U postgres -d municipal_db -f database/queries/04_analytical_kpi_reports.sql

# 5. Run Connection Traps validation audit
psql -U postgres -d municipal_db -f database/queries/07_connection_traps_audit.sql
```

### In Docker Compose
When running `docker compose up`, `01_ddl_and_constraints.sql` and `02_dml_seed_dataset.sql` are executed automatically on PostgreSQL container initialization.
