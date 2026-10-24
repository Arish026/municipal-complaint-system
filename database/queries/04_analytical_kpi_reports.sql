-- ============================================================================
-- 04_analytical_kpi_reports.sql
-- Municipal Complaint Management System (MCMS)
-- Academic Standard: DFD Process 5.0 (Generate Reports) & SRS FR-08
-- ============================================================================

-- ----------------------------------------------------------------------------
-- REPORT 1: MUNICIPAL DEPARTMENT PERFORMANCE & RESOLUTION RATES
-- Computes total complaints, resolved count, and resolution success ratio.
-- ----------------------------------------------------------------------------
SELECT 
    d.department_id,
    d.department_name,
    COUNT(c.complaint_id) AS total_complaints,
    COUNT(c.complaint_id) FILTER (WHERE c.status IN ('Resolved', 'Verified', 'Closed')) AS resolved_complaints,
    COUNT(c.complaint_id) FILTER (WHERE c.status IN ('In Progress', 'Assigned')) AS active_complaints,
    COUNT(c.complaint_id) FILTER (WHERE c.status IN ('Submitted', 'Categorized')) AS unassigned_backlog,
    ROUND(
        (COUNT(c.complaint_id) FILTER (WHERE c.status IN ('Resolved', 'Verified', 'Closed'))::NUMERIC / 
        NULLIF(COUNT(c.complaint_id), 0)::NUMERIC) * 100, 
        1
    ) AS resolution_rate_percentage
FROM DEPARTMENT d
LEFT JOIN COMPLAINT c ON d.department_id = c.department_id
GROUP BY d.department_id, d.department_name
ORDER BY total_complaints DESC;

-- ----------------------------------------------------------------------------
-- REPORT 2: GRIEVANCE VOLUME BREAKDOWN BY HAZARD CATEGORY
-- Categorical distribution of citizen complaints across Karachi.
-- ----------------------------------------------------------------------------
SELECT 
    c.category,
    d.department_name,
    COUNT(c.complaint_id) AS incident_count,
    ROUND(
        (COUNT(c.complaint_id)::NUMERIC / (SELECT COUNT(*) FROM COMPLAINT)::NUMERIC) * 100, 
        1
    ) AS volume_share_percentage
FROM COMPLAINT c
JOIN DEPARTMENT d ON c.department_id = d.department_id
GROUP BY c.category, d.department_name
ORDER BY incident_count DESC;

-- ----------------------------------------------------------------------------
-- REPORT 3: PENDING BACKLOG AGING BRACKETS (<24h, 24–72h, >72h SLA Overdue)
-- Critical surveillance query used by the Decision-Support Agent (FR-09).
-- ----------------------------------------------------------------------------
SELECT 
    d.department_name,
    COUNT(c.complaint_id) FILTER (
        WHERE c.status NOT IN ('Resolved', 'Verified', 'Closed', 'Rejected') 
          AND (CURRENT_TIMESTAMP - c.complaint_date) < INTERVAL '24 hours'
    ) AS aging_under_24h,
    COUNT(c.complaint_id) FILTER (
        WHERE c.status NOT IN ('Resolved', 'Verified', 'Closed', 'Rejected') 
          AND (CURRENT_TIMESTAMP - c.complaint_date) >= INTERVAL '24 hours'
          AND (CURRENT_TIMESTAMP - c.complaint_date) <= INTERVAL '72 hours'
    ) AS aging_24_to_72h,
    COUNT(c.complaint_id) FILTER (
        WHERE c.status NOT IN ('Resolved', 'Verified', 'Closed', 'Rejected') 
          AND (CURRENT_TIMESTAMP - c.complaint_date) > INTERVAL '72 hours'
    ) AS sla_overdue_critical
FROM DEPARTMENT d
LEFT JOIN COMPLAINT c ON d.department_id = c.department_id
GROUP BY d.department_id, d.department_name
ORDER BY sla_overdue_critical DESC;

-- ----------------------------------------------------------------------------
-- REPORT 4: AVERAGE RESOLUTION TIME (HOURS) FOR CLOSED WORK ORDERS
-- Computes average turnaround time from assignment to verified completion.
-- ----------------------------------------------------------------------------
SELECT 
    d.department_name,
    COUNT(w.work_order_id) AS completed_work_orders,
    ROUND(
        AVG(EXTRACT(EPOCH FROM (w.completion_date - w.assigned_date)) / 3600)::NUMERIC, 
        2
    ) AS avg_turnaround_hours
FROM WORK_ORDER w
JOIN COMPLAINT c ON w.complaint_id = c.complaint_id
JOIN DEPARTMENT d ON c.department_id = d.department_id
WHERE w.work_status = 'Completed' AND w.completion_date IS NOT NULL
GROUP BY d.department_id, d.department_name
ORDER BY avg_turnaround_hours ASC;

-- ----------------------------------------------------------------------------
-- REPORT 5: FIELD TECHNICIAN WORKLOAD DISTRIBUTION & BOTTLENECK AUDIT
-- Identifies overloaded officers (>= 4 jobs) vs idle staff (0 jobs) for rebalancing.
-- ----------------------------------------------------------------------------
SELECT 
    s.staff_id,
    s.name AS technician_name,
    s.designation,
    d.department_name,
    COUNT(w.work_order_id) FILTER (WHERE w.work_status IN ('Assigned', 'In Progress')) AS active_assignments,
    CASE 
        WHEN COUNT(w.work_order_id) FILTER (WHERE w.work_status IN ('Assigned', 'In Progress')) >= 4 THEN 'OVERLOADED (Requires Reassignment)'
        WHEN COUNT(w.work_order_id) FILTER (WHERE w.work_status IN ('Assigned', 'In Progress')) = 0 THEN 'IDLE / FREE (Optimal Dispatch Target)'
        ELSE 'BALANCED CAPACITY'
    END AS operational_workload_status
FROM STAFF s
JOIN DEPARTMENT d ON s.department_id = d.department_id
LEFT JOIN WORK_ORDER w ON s.staff_id = w.staff_id
WHERE s.is_active = TRUE
GROUP BY s.staff_id, s.name, s.designation, d.department_name
ORDER BY active_assignments DESC, s.name ASC;
