# Utility & Seeding Scripts

Utility and synthetic data generation scripts for the Municipal Complaint Management System (MCMS).

---

## Available Scripts

### 1. Synthetic Data Generator (`seed_synthetic_data.py`)
Generates realistic test populations across:
- 6 Municipal Departments
- 18 Staff Members (Inspectors, Technicians, Supervisors)
- 25 Citizens with unique phone numbers and addresses
- Configurable number of Complaints across realistic civic categories
- Work Orders with sequential status progressions (`Assigned` → `In Progress` → `Completed`)
- Decision-Support Audit Logs for overdue tickets and workload balancing

#### Usage
```bash
# Output to default path (database/seed_data.sql)
python scripts/seed_synthetic_data.py

# Custom output file and count
python scripts/seed_synthetic_data.py database/custom_seed.sql
```
