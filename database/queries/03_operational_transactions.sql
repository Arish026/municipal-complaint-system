-- ============================================================================
-- 03_operational_transactions.sql
-- Municipal Complaint Management System (MCMS)
-- Academic Standard: DFD Level 1 & 2 Execution Queries (Processes 1.0 to 4.0)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FR-01: PROCESS 1.0 MANAGE CITIZENS
-- Lookup existing resident by unique phone; insert if new record.
-- ----------------------------------------------------------------------------
-- Check if citizen already exists:
SELECT citizen_id, name, phone, address
FROM CITIZEN
WHERE phone = '0300-1234567';

-- Atomic insert if not present (upsert with returning ID):
INSERT INTO CITIZEN (name, phone, address)
VALUES ('Syed Ali Raza', '0300-1234567', 'Flat B-4, Al-Ghafoor Heights, Block 13-D, Gulshan-e-Iqbal, Karachi')
ON CONFLICT (phone) DO UPDATE 
SET name = EXCLUDED.name, address = EXCLUDED.address
RETURNING citizen_id;

-- ----------------------------------------------------------------------------
-- FR-02 & FR-03: PROCESS 2.3 & 2.4 CATEGORIZE COMPLAINT & IDENTIFY DEPT
-- Match problem narrative against keyword dictionaries to resolve department.
-- ----------------------------------------------------------------------------
SELECT department_id, department_name, office_location
FROM DEPARTMENT
WHERE department_id = (
    CASE 
        WHEN 'water pipeline rupture leak' ILIKE '%pipeline%' OR 'water pipeline rupture leak' ILIKE '%leak%' THEN 1
        WHEN 'pothole road paving crater' ILIKE '%road%' OR 'pothole road paving crater' ILIKE '%pothole%' THEN 2
        WHEN 'garbage solid waste kachra' ILIKE '%garbage%' OR 'garbage solid waste kachra' ILIKE '%kachra%' THEN 3
        WHEN 'streetlight electric power' ILIKE '%electric%' OR 'streetlight electric power' ILIKE '%streetlight%' THEN 4
        WHEN 'dengue malaria mosquito spray' ILIKE '%spray%' OR 'dengue malaria mosquito spray' ILIKE '%dengue%' THEN 5
        ELSE 6
    END
);

-- ----------------------------------------------------------------------------
-- FR-04: PROCESS 2.5 & 2.6 REGISTER COMPLAINT & GENERATE ACKNOWLEDGMENT
-- ----------------------------------------------------------------------------
INSERT INTO COMPLAINT (citizen_id, department_id, category, description, location, status)
VALUES (
    1, 
    1, 
    'Water Supply Leakage', 
    'Potable water pipeline gushing near Expo Centre gate 4.', 
    'Main University Road, Block 13-D, Gulshan-e-Iqbal, Karachi', 
    'Submitted'
)
RETURNING complaint_id, complaint_date, status;

-- ----------------------------------------------------------------------------
-- FR-05: PROCESS 3.0 MULTI-FACTOR FIELD DISPATCH (ATOMIC WORK ORDER CREATION)
-- Step 1: Candidate Ranking (Evaluates Workload Queue, Specialization, Proximity)
-- ----------------------------------------------------------------------------
SELECT 
    s.staff_id,
    s.name,
    s.designation,
    s.phone,
    COUNT(w.work_order_id) FILTER (WHERE w.work_status IN ('Assigned', 'In Progress')) AS active_workload,
    CASE 
        WHEN s.designation ILIKE '%Pipeline%' THEN 'Direct Specialty Match'
        WHEN s.designation ILIKE '%Network%' THEN 'General Infrastructure'
        ELSE 'Support Personnel'
    END AS skill_alignment
FROM STAFF s
LEFT JOIN WORK_ORDER w ON s.staff_id = w.staff_id
WHERE s.department_id = 1 AND s.is_active = TRUE
GROUP BY s.staff_id, s.name, s.designation, s.phone
ORDER BY active_workload ASC;

-- Step 2: Atomic Dispatch Transaction (Creates Work Order + Transitions Status)
BEGIN;

INSERT INTO WORK_ORDER (complaint_id, staff_id, work_status, action_taken)
VALUES (
    7, 
    1, 
    'Assigned', 
    'Auto-dispatched via Multi-Factor Assignment Engine to lead pipeline technician.'
)
RETURNING work_order_id;

UPDATE COMPLAINT
SET status = 'Assigned'
WHERE complaint_id = 7 AND status IN ('Submitted', 'Categorized');

COMMIT;

-- ----------------------------------------------------------------------------
-- FR-06: PROCESS 4.0 FIELD CREW REPAIR UPDATE & STATUS SYNCHRONIZATION
-- ----------------------------------------------------------------------------
BEGIN;

UPDATE WORK_ORDER
SET 
    work_status = 'Completed',
    completion_date = CURRENT_TIMESTAMP,
    action_taken = 'Excavation completed, high-pressure sleeve fitted, pressure restored.'
WHERE work_order_id = 1;

UPDATE COMPLAINT
SET status = 'Resolved'
WHERE complaint_id = (SELECT complaint_id FROM WORK_ORDER WHERE work_order_id = 1);

COMMIT;

-- ----------------------------------------------------------------------------
-- FR-07: PROCESS 4.0 CITIZEN LIVE INQUIRY & TRACKING (3NF JOIN TRAVERSAL)
-- ----------------------------------------------------------------------------
SELECT 
    c.complaint_id,
    c.category,
    c.description,
    c.location,
    c.status AS complaint_status,
    c.complaint_date,
    cz.name AS citizen_name,
    cz.phone AS citizen_phone,
    d.department_name,
    w.work_order_id,
    w.work_status,
    w.assigned_date,
    w.completion_date,
    w.action_taken,
    s.name AS technician_name,
    s.designation AS technician_designation,
    s.phone AS technician_phone
FROM COMPLAINT c
JOIN CITIZEN cz ON c.citizen_id = cz.citizen_id
JOIN DEPARTMENT d ON c.department_id = d.department_id
LEFT JOIN WORK_ORDER w ON c.complaint_id = w.complaint_id
LEFT JOIN STAFF s ON w.staff_id = s.staff_id
WHERE c.complaint_id = 1 OR cz.phone = '0300-1234567'
ORDER BY c.complaint_date DESC;
