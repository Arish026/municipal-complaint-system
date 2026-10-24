-- ============================================================================
-- 06_relational_algebra_mappings.sql
-- Municipal Complaint Management System (MCMS)
-- Academic Standard: Formal Relational Algebra & SQL Equivalence Crosswalk
-- Syllabus: Dr. S. M. Khalid — Chapter 4 (Relational Operations & Expressions)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- OPERATOR 1: SELECTION (σ) — Filter rows based on a propositional predicate
-- Formula: σ_{status = 'Submitted' ∧ department_id = 1}(COMPLAINT)
-- ----------------------------------------------------------------------------
SELECT *
FROM COMPLAINT
WHERE status = 'Submitted' AND department_id = 1;

-- ----------------------------------------------------------------------------
-- OPERATOR 2: PROJECTION (π) — Extract specific vertical attribute columns
-- Formula: π_{complaint_id, category, location, status}(COMPLAINT)
-- ANSI-SPARC Application: Used to generate the public Citizen External View.
-- ----------------------------------------------------------------------------
SELECT complaint_id, category, location, status
FROM COMPLAINT;

-- ----------------------------------------------------------------------------
-- OPERATOR 3: NATURAL JOIN (⨝) — Combine relations on common attribute
-- Formula: COMPLAINT ⨝ DEPARTMENT
-- Common attribute: {department_id}
-- ----------------------------------------------------------------------------
SELECT *
FROM COMPLAINT c
NATURAL JOIN DEPARTMENT d;

-- Explicit Inner Join equivalent:
SELECT 
    c.complaint_id,
    c.category,
    c.status,
    d.department_id,
    d.department_name,
    d.office_location
FROM COMPLAINT c
JOIN DEPARTMENT d ON c.department_id = d.department_id;

-- ----------------------------------------------------------------------------
-- OPERATOR 4: THETA JOIN (⨝_θ) — Join with arbitrary conditional inequality
-- Formula: STAFF ⨝_{STAFF.department_id = COMPLAINT.department_id ∧ COMPLAINT.status = 'Submitted'} COMPLAINT
-- ----------------------------------------------------------------------------
SELECT 
    s.staff_id,
    s.name AS candidate_technician,
    s.designation,
    c.complaint_id,
    c.category,
    c.location
FROM STAFF s
JOIN COMPLAINT c ON s.department_id = c.department_id AND c.status = 'Submitted'
WHERE s.is_active = TRUE;

-- ----------------------------------------------------------------------------
-- OPERATOR 5: AGGREGATE FUNCTION (γ) — Grouping & Aggregation
-- Formula: γ_{department_id, COUNT(complaint_id) → total}(COMPLAINT)
-- ----------------------------------------------------------------------------
SELECT 
    department_id,
    COUNT(complaint_id) AS total_complaints
FROM COMPLAINT
GROUP BY department_id;

-- ----------------------------------------------------------------------------
-- OPERATOR 6: COMPLEX COMPOSITE EXPRESSION
-- Multi-Factor Candidate Screening Expression:
-- π_{name, designation, active_jobs}(γ_{staff_id, COUNT(order_id) → active_jobs}(σ_{work_status ≠ 'Completed'}(WORK_ORDER)) ⨝ STAFF)
-- ----------------------------------------------------------------------------
SELECT 
    s.name,
    s.designation,
    COUNT(w.work_order_id) AS active_jobs
FROM STAFF s
LEFT JOIN WORK_ORDER w ON s.staff_id = w.staff_id AND w.work_status != 'Completed'
WHERE s.is_active = TRUE
GROUP BY s.staff_id, s.name, s.designation
ORDER BY active_jobs ASC;
