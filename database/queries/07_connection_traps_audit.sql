-- ============================================================================
-- 07_connection_traps_audit.sql
-- Municipal Complaint Management System (MCMS)
-- Academic Standard: Connection Traps Audit (Dr. S. M. Khalid — Chapter 4 § 4.7)
-- ============================================================================

-- ============================================================================
-- AUDIT 1: FAN TRAP VERIFICATION (§ 4.7.5)
-- ============================================================================
-- THEORETICAL DEFINITION:
-- A Fan Trap occurs when two 1:M relationships fan out from a single common parent entity,
-- creating an ambiguous semantic network where child A cannot be deterministically matched to child B.
--
-- FLAWED DESIGN EXAMPLE (AVOIDED BY MCMS):
-- If CITIZEN and WORK_ORDER both connected independently to DEPARTMENT:
--   CITIZEN <---(1:M)--- DEPARTMENT ---(1:M)---> WORK_ORDER
-- We would know which department holds work orders, but could NEVER determine which
-- citizen's grievance originated a specific work order!
--
-- CORRECT MCMS RELATIONSHIP PATHWAY:
--   CITIZEN (1) ──o{ (M) COMPLAINT (1) ──o{ (M) WORK_ORDER
--
-- PROOF QUERY:
-- Demonstrate that every work order deterministically traces back to exactly ONE citizen.
SELECT 
    w.work_order_id,
    c.complaint_id,
    c.category,
    cz.citizen_id,
    cz.name AS citizen_name,
    cz.phone AS citizen_phone,
    COUNT(DISTINCT cz.citizen_id) OVER (PARTITION BY w.work_order_id) AS distinct_citizen_count
FROM WORK_ORDER w
JOIN COMPLAINT c ON w.complaint_id = c.complaint_id
JOIN CITIZEN cz ON c.citizen_id = cz.citizen_id;

-- ASSERTION: distinct_citizen_count must strictly equal 1 for all rows (Zero Fan Traps).


-- ============================================================================
-- AUDIT 2: CHASM TRAP VERIFICATION (§ 4.7.6)
-- ============================================================================
-- THEORETICAL DEFINITION:
-- A Chasm Trap occurs when an optional (partial) participation constraint in an
-- intermediate entity breaks the relationship traversal path, making it impossible
-- to determine the association between entities on either side of the gap.
--
-- FLAWED DESIGN EXAMPLE (AVOIDED BY MCMS):
-- If COMPLAINT had optional participation with DEPARTMENT (i.e. department_id could be NULL):
-- Any work order generated for an un-categorized complaint would break the query path
-- to the responsible municipal department!
--
-- CORRECT MCMS PARTICIPATION CONSTRAINT:
-- In database/schema.sql, COMPLAINT.department_id is defined as:
--   department_id INT NOT NULL REFERENCES DEPARTMENT(department_id) ON DELETE RESTRICT
-- Participation is MANDATORY (TOTAL): DEPARTMENT ||────o{ COMPLAINT
--
-- PROOF QUERY:
-- Audit database for any orphaned complaints or work orders lacking department binding.
SELECT 
    c.complaint_id,
    c.category,
    c.department_id,
    d.department_name,
    CASE 
        WHEN c.department_id IS NULL THEN 'CHASM TRAP DETECTED: Orphaned Complaint'
        WHEN d.department_id IS NULL THEN 'CHASM TRAP DETECTED: Invalid Department Reference'
        ELSE 'VALID PATHWAY (Zero Chasm Traps)'
    END AS chasm_trap_status
FROM COMPLAINT c
LEFT JOIN DEPARTMENT d ON c.department_id = d.department_id
WHERE c.department_id IS NULL OR d.department_id IS NULL;

-- ASSERTION: Query must return ZERO rows (Zero Chasm Traps guaranteed).
