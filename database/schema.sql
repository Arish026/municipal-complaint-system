-- ==============================================================
-- Municipal Complaint Management System (MCMS)
-- Database DDL Schema (PostgreSQL)
-- ==============================================================

-- Drop tables if re-initializing (in dependency order)
DROP TABLE IF EXISTS DECISION_AUDIT_LOG CASCADE;
DROP TABLE IF EXISTS WORK_ORDER CASCADE;
DROP TABLE IF EXISTS COMPLAINT CASCADE;
DROP TABLE IF EXISTS STAFF CASCADE;
DROP TABLE IF EXISTS DEPARTMENT CASCADE;
DROP TABLE IF EXISTS CITIZEN CASCADE;

-- --------------------------------------------------------------
-- 1. CITIZEN Table
-- --------------------------------------------------------------
CREATE TABLE CITIZEN (
    citizen_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- --------------------------------------------------------------
-- 2. DEPARTMENT Table
-- --------------------------------------------------------------
CREATE TABLE DEPARTMENT (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    office_location VARCHAR(200) NOT NULL
);

-- --------------------------------------------------------------
-- 3. STAFF Table
-- --------------------------------------------------------------
CREATE TABLE STAFF (
    staff_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    CONSTRAINT fk_staff_department
        FOREIGN KEY (department_id) 
        REFERENCES DEPARTMENT(department_id) 
        ON DELETE RESTRICT
);

-- --------------------------------------------------------------
-- 4. COMPLAINT Table
-- --------------------------------------------------------------
CREATE TABLE COMPLAINT (
    complaint_id SERIAL PRIMARY KEY,
    citizen_id INT NOT NULL,
    department_id INT NOT NULL,
    complaint_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Submitted',
    CONSTRAINT chk_complaint_status 
        CHECK (status IN ('Submitted', 'Categorized', 'Assigned', 'In Progress', 'Resolved', 'Verified', 'Closed', 'Rejected')),
    CONSTRAINT fk_complaint_citizen
        FOREIGN KEY (citizen_id) 
        REFERENCES CITIZEN(citizen_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_complaint_department
        FOREIGN KEY (department_id) 
        REFERENCES DEPARTMENT(department_id) 
        ON DELETE RESTRICT
);

-- --------------------------------------------------------------
-- 5. WORK_ORDER Table
-- --------------------------------------------------------------
CREATE TABLE WORK_ORDER (
    work_order_id SERIAL PRIMARY KEY,
    complaint_id INT NOT NULL,
    staff_id INT NOT NULL,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE NULL,
    work_status VARCHAR(50) NOT NULL DEFAULT 'Assigned',
    action_taken TEXT NULL,
    CONSTRAINT chk_work_status 
        CHECK (work_status IN ('Assigned', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
    CONSTRAINT fk_workorder_complaint
        FOREIGN KEY (complaint_id) 
        REFERENCES COMPLAINT(complaint_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_workorder_staff
        FOREIGN KEY (staff_id) 
        REFERENCES STAFF(staff_id) 
        ON DELETE RESTRICT
);

-- --------------------------------------------------------------
-- 6. DECISION_AUDIT_LOG Table (Decision-Support Agent Audit Trail)
-- --------------------------------------------------------------
CREATE TABLE DECISION_AUDIT_LOG (
    audit_id SERIAL PRIMARY KEY,
    complaint_id INT NULL,
    work_order_id INT NULL,
    alert_type VARCHAR(100) NOT NULL, -- 'Overdue', 'Workload Imbalance', 'Recurring Issue', 'Failure'
    explanation TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    supervisor_decision VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Approved', 'Rejected'
    decided_by_staff_id INT NULL,
    decision_timestamp TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_audit_complaint
        FOREIGN KEY (complaint_id) 
        REFERENCES COMPLAINT(complaint_id) 
        ON DELETE SET NULL,
    CONSTRAINT fk_audit_workorder
        FOREIGN KEY (work_order_id) 
        REFERENCES WORK_ORDER(work_order_id) 
        ON DELETE SET NULL,
    CONSTRAINT fk_audit_staff
        FOREIGN KEY (decided_by_staff_id) 
        REFERENCES STAFF(staff_id) 
        ON DELETE SET NULL
);

-- --------------------------------------------------------------
-- Indexes for Performance & Search Optimization
-- --------------------------------------------------------------
CREATE INDEX idx_complaint_citizen ON COMPLAINT(citizen_id);
CREATE INDEX idx_complaint_dept ON COMPLAINT(department_id);
CREATE INDEX idx_complaint_status ON COMPLAINT(status);
CREATE INDEX idx_complaint_date ON COMPLAINT(complaint_date);
CREATE INDEX idx_workorder_complaint ON WORK_ORDER(complaint_id);
CREATE INDEX idx_workorder_staff ON WORK_ORDER(staff_id);
CREATE INDEX idx_workorder_status ON WORK_ORDER(work_status);
CREATE INDEX idx_staff_dept ON STAFF(department_id);
