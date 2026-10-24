-- ============================================================================
-- 01_ddl_and_constraints.sql
-- Municipal Complaint Management System (MCMS)
-- Academic & Engineering Standard: University of Karachi — BS Computer Science (DBMS)
-- Syllabus: Dr. S. M. Khalid — Chapter 4 (Relational Mapping & 3NF Design)
-- Database Engine: PostgreSQL 16 (Relational Schema in 3rd Normal Form)
-- ============================================================================

-- Clean teardown (safe order respecting foreign key dependencies)
DROP TABLE IF EXISTS DECISION_AUDIT_LOG CASCADE;
DROP TABLE IF EXISTS WORK_ORDER CASCADE;
DROP TABLE IF EXISTS COMPLAINT CASCADE;
DROP TABLE IF EXISTS STAFF CASCADE;
DROP TABLE IF EXISTS DEPARTMENT CASCADE;
DROP TABLE IF EXISTS CITIZEN CASCADE;

-- ----------------------------------------------------------------------------
-- 1. CITIZEN (D1: Citizen Records)
-- 3NF: Primary Key (Citizen_ID), Candidate Key (Phone)
-- ----------------------------------------------------------------------------
CREATE TABLE CITIZEN (
    citizen_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. DEPARTMENT (D3: Department Records)
-- 3NF: Primary Key (Department_ID), Unique Department Name
-- ----------------------------------------------------------------------------
CREATE TABLE DEPARTMENT (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    office_location VARCHAR(200) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. STAFF (D4: Staff Records)
-- 3NF: Foreign Key (Department_ID -> DEPARTMENT.department_id)
-- ----------------------------------------------------------------------------
CREATE TABLE STAFF (
    staff_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL REFERENCES DEPARTMENT(department_id) ON DELETE RESTRICT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. COMPLAINT (D2: Complaint Records)
-- 3NF: FKs to CITIZEN and DEPARTMENT. Lifecycle check constraint.
-- ----------------------------------------------------------------------------
CREATE TABLE COMPLAINT (
    complaint_id SERIAL PRIMARY KEY,
    citizen_id INT NOT NULL REFERENCES CITIZEN(citizen_id) ON DELETE RESTRICT,
    department_id INT NOT NULL REFERENCES DEPARTMENT(department_id) ON DELETE RESTRICT,
    complaint_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    CONSTRAINT chk_complaint_status CHECK (
        status IN (
            'Submitted',
            'Categorized',
            'Assigned',
            'In Progress',
            'Resolved',
            'Verified',
            'Closed',
            'Rejected'
        )
    )
);

-- ----------------------------------------------------------------------------
-- 5. WORK_ORDER (D5: Work Order Records)
-- 3NF: Child of COMPLAINT (Cascade) and STAFF (Restrict).
-- ----------------------------------------------------------------------------
CREATE TABLE WORK_ORDER (
    work_order_id SERIAL PRIMARY KEY,
    complaint_id INT NOT NULL REFERENCES COMPLAINT(complaint_id) ON DELETE CASCADE,
    staff_id INT NOT NULL REFERENCES STAFF(staff_id) ON DELETE RESTRICT,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE NULL,
    work_status VARCHAR(50) NOT NULL DEFAULT 'Assigned',
    action_taken TEXT NULL,
    CONSTRAINT chk_work_status CHECK (
        work_status IN (
            'Assigned',
            'In Progress',
            'Completed',
            'On Hold',
            'Cancelled'
        )
    ),
    CONSTRAINT chk_workorder_completion_date CHECK (
        completion_date IS NULL OR completion_date >= assigned_date
    )
);

-- ----------------------------------------------------------------------------
-- 6. DECISION_AUDIT_LOG (Operational Surveillance & Governance)
-- ----------------------------------------------------------------------------
CREATE TABLE DECISION_AUDIT_LOG (
    audit_id SERIAL PRIMARY KEY,
    complaint_id INT NULL REFERENCES COMPLAINT(complaint_id) ON DELETE SET NULL,
    work_order_id INT NULL REFERENCES WORK_ORDER(work_order_id) ON DELETE SET NULL,
    alert_type VARCHAR(100) NOT NULL,
    explanation TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    supervisor_decision VARCHAR(50) DEFAULT 'Pending' NOT NULL,
    decided_by_staff_id INT NULL REFERENCES STAFF(staff_id) ON DELETE SET NULL,
    decision_timestamp TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_supervisor_decision CHECK (
        supervisor_decision IN ('Pending', 'Approved', 'Rejected')
    )
);

-- ============================================================================
-- B-TREE PERFORMANCE INDEXES (Physical Internal Schema)
-- ============================================================================
CREATE INDEX idx_complaint_citizen ON COMPLAINT(citizen_id);
CREATE INDEX idx_complaint_dept ON COMPLAINT(department_id);
CREATE INDEX idx_complaint_status ON COMPLAINT(status);
CREATE INDEX idx_complaint_date ON COMPLAINT(complaint_date);

CREATE INDEX idx_workorder_complaint ON WORK_ORDER(complaint_id);
CREATE INDEX idx_workorder_staff ON WORK_ORDER(staff_id);
CREATE INDEX idx_workorder_status ON WORK_ORDER(work_status);

CREATE INDEX idx_staff_dept ON STAFF(department_id);
CREATE INDEX idx_citizen_phone ON CITIZEN(phone);
CREATE INDEX idx_audit_status ON DECISION_AUDIT_LOG(supervisor_decision);
