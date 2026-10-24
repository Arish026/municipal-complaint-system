-- ============================================================================
-- 05_acid_transactions_and_concurrency.sql
-- Municipal Complaint Management System (MCMS)
-- Academic Standard: ACID Guarantees, Transaction Boundaries & Concurrency
-- Syllabus: Dr. S. M. Khalid — Chapter 3 (Database Application Engineering)
-- ============================================================================

-- ============================================================================
-- TRANSACTION 1: ATOMIC FIELD CREW ALLOCATION (COMMIT PATH)
-- Demonstrates Atomicity & Consistency: Both writes must succeed together.
-- ============================================================================
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Step 1: Concurrency Guard — Acquire exclusive row-level lock on Complaint.
-- Prevents race condition where two simultaneous supervisors dispatch the same ticket.
SELECT complaint_id, department_id, status
FROM COMPLAINT
WHERE complaint_id = 7
FOR UPDATE;

-- Step 2: Validate preconditions within transaction boundary.
-- Complaint must be in 'Submitted' or 'Categorized' status.
DO $$
DECLARE
    curr_status VARCHAR(50);
BEGIN
    SELECT status INTO curr_status FROM COMPLAINT WHERE complaint_id = 7;
    IF curr_status NOT IN ('Submitted', 'Categorized') THEN
        RAISE EXCEPTION 'Concurrency Violation: Complaint % is already locked in status %', 7, curr_status;
    END IF;
END $$;

-- Step 3: Insert dependent WORK_ORDER row.
INSERT INTO WORK_ORDER (complaint_id, staff_id, work_status, action_taken)
VALUES (7, 2, 'Assigned', 'Multi-factor dispatch assigned to sewage network supervisor Kamran Akram.');

-- Step 4: Advance parent COMPLAINT status to 'Assigned'.
UPDATE COMPLAINT
SET status = 'Assigned'
WHERE complaint_id = 7;

-- Step 5: Record execution trace in DECISION_AUDIT_LOG.
INSERT INTO DECISION_AUDIT_LOG (complaint_id, alert_type, explanation, suggested_action, supervisor_decision, decided_by_staff_id, decision_timestamp)
VALUES (7, 'Standard Dispatch', 'Atomic work order created and technician allocated.', 'Proceed with on-site inspection.', 'Approved', 2, CURRENT_TIMESTAMP);

-- Step 6: Commit all changes atomically to Write-Ahead Log (WAL).
COMMIT;


-- ============================================================================
-- TRANSACTION 2: ROLLBACK DEMONSTRATION ON REFERENTIAL / CHECK VIOLATION
-- Demonstrates All-or-Nothing Guarantee: Failure cleanly aborts partial writes.
-- ============================================================================
BEGIN;

-- Attempt 1: Valid initial write
UPDATE COMPLAINT
SET description = description || ' [Field notes appended]'
WHERE complaint_id = 8;

-- Attempt 2: Illegal Foreign Key insertion (Staff ID 99999 does not exist)
-- The foreign key constraint 'fk_workorder_staff' triggers an immediate error.
SAVEPOINT before_bad_insert;

INSERT INTO WORK_ORDER (complaint_id, staff_id, work_status)
VALUES (8, 99999, 'Assigned'); -- FAILS: staff_id 99999 violates FK

-- If error caught by application exception handler:
ROLLBACK TO SAVEPOINT before_bad_insert;

-- Full transaction abort to guarantee database consistency:
ROLLBACK;


-- ============================================================================
-- CONCURRENCY CONTROL SPECIFICATIONS
-- ============================================================================
-- PostgreSQL default isolation: READ COMMITTED
-- - Prevents Dirty Reads (G1): Transactions only read committed data.
-- - MVCC (Multi-Version Concurrency Control): Readers do not block writers; writers do not block readers.
-- - Serializable isolation available for critical financial/electoral audits:
--   SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
