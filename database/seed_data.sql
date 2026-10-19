-- Synthetic Municipal Seed Data Generated for Testing
BEGIN;

-- 1. Departments
INSERT INTO DEPARTMENT (department_id, department_name, office_location) VALUES
(1, 'Water Supply & Sanitation', 'Town Hall Block A, Level 1'),
(2, 'Roads & Infrastructure Maintenance', 'Town Hall Block B, Level 2'),
(3, 'Solid Waste Management', 'Municipal Depot 4, East Ward'),
(4, 'Street Lighting & Electricity', 'Town Hall Block A, Level 3'),
(5, 'Public Health & Vector Control', 'Civic Hospital Complex, Block C'),
(6, 'Parks & Urban Forestry', 'Civic Center North, Level 1');

-- 2. Staff Members
INSERT INTO STAFF (staff_id, department_id, name, phone, designation, is_active) VALUES
(1, 1, 'Ananya Gupta', '+1-555-0901', 'Senior Supervisor', TRUE),
(2, 1, 'Ananya Patel', '+1-555-0902', 'Lead Field Technician', TRUE),
(3, 1, 'Sneha Verma', '+1-555-0903', 'Junior Inspector', TRUE),
(4, 2, 'Pooja Verma', '+1-555-0904', 'Senior Supervisor', TRUE),
(5, 2, 'Divya Nair', '+1-555-0905', 'Lead Field Technician', TRUE),
(6, 2, 'Aarav Verma', '+1-555-0906', 'Junior Inspector', TRUE),
(7, 3, 'Divya Singh', '+1-555-0907', 'Senior Supervisor', TRUE),
(8, 3, 'Rohan Singh', '+1-555-0908', 'Lead Field Technician', TRUE),
(9, 3, 'Karan Reddy', '+1-555-0909', 'Junior Inspector', TRUE),
(10, 4, 'Ananya Das', '+1-555-0910', 'Senior Supervisor', TRUE),
(11, 4, 'Sneha Joshi', '+1-555-0911', 'Lead Field Technician', TRUE),
(12, 4, 'Ananya Patel', '+1-555-0912', 'Junior Inspector', TRUE),
(13, 5, 'Ananya Choudhury', '+1-555-0913', 'Senior Supervisor', TRUE),
(14, 5, 'Aditya Reddy', '+1-555-0914', 'Lead Field Technician', TRUE),
(15, 5, 'Meera Choudhury', '+1-555-0915', 'Junior Inspector', TRUE),
(16, 6, 'Divya Joshi', '+1-555-0916', 'Senior Supervisor', TRUE),
(17, 6, 'Pooja Khan', '+1-555-0917', 'Lead Field Technician', TRUE),
(18, 6, 'Rahul Nair', '+1-555-0918', 'Junior Inspector', TRUE);

-- 3. Citizens
INSERT INTO CITIZEN (citizen_id, name, phone, address) VALUES
(1, 'Priya Sharma', '+1-555-0201', 'Flat 102, Building B, Municipal Zone 2'),
(2, 'Rohan Iyer', '+1-555-0202', 'Flat 204, Building C, Municipal Zone 3'),
(3, 'Aarav Nair', '+1-555-0203', 'Flat 306, Building D, Municipal Zone 4'),
(4, 'Vikram Choudhury', '+1-555-0204', 'Flat 408, Building E, Municipal Zone 1'),
(5, 'Meera Verma', '+1-555-0205', 'Flat 510, Building F, Municipal Zone 2'),
(6, 'Karan Reddy', '+1-555-0206', 'Flat 612, Building A, Municipal Zone 3'),
(7, 'Priya Iyer', '+1-555-0207', 'Flat 714, Building B, Municipal Zone 4'),
(8, 'Meera Verma', '+1-555-0208', 'Flat 816, Building C, Municipal Zone 1'),
(9, 'Karan Joshi', '+1-555-0209', 'Flat 918, Building D, Municipal Zone 2'),
(10, 'Karan Joshi', '+1-555-0210', 'Flat 1020, Building E, Municipal Zone 3'),
(11, 'Karan Nair', '+1-555-0211', 'Flat 1122, Building F, Municipal Zone 4'),
(12, 'Aditya Sharma', '+1-555-0212', 'Flat 1224, Building A, Municipal Zone 1'),
(13, 'Rahul Patel', '+1-555-0213', 'Flat 1326, Building B, Municipal Zone 2'),
(14, 'Vikram Gupta', '+1-555-0214', 'Flat 1428, Building C, Municipal Zone 3'),
(15, 'Vikram Nair', '+1-555-0215', 'Flat 1530, Building D, Municipal Zone 4'),
(16, 'Aarav Khan', '+1-555-0216', 'Flat 1632, Building E, Municipal Zone 1'),
(17, 'Rahul Das', '+1-555-0217', 'Flat 1734, Building F, Municipal Zone 2'),
(18, 'Divya Gupta', '+1-555-0218', 'Flat 1836, Building A, Municipal Zone 3'),
(19, 'Aditya Sharma', '+1-555-0219', 'Flat 1938, Building B, Municipal Zone 4'),
(20, 'Vikram Choudhury', '+1-555-0220', 'Flat 2040, Building C, Municipal Zone 1'),
(21, 'Rohan Patel', '+1-555-0221', 'Flat 2142, Building D, Municipal Zone 2'),
(22, 'Pooja Khan', '+1-555-0222', 'Flat 2244, Building E, Municipal Zone 3'),
(23, 'Priya Joshi', '+1-555-0223', 'Flat 2346, Building F, Municipal Zone 4'),
(24, 'Karan Das', '+1-555-0224', 'Flat 2448, Building A, Municipal Zone 1'),
(25, 'Divya Iyer', '+1-555-0225', 'Flat 2550, Building B, Municipal Zone 2');

-- 4. Complaints
INSERT INTO COMPLAINT (complaint_id, citizen_id, department_id, complaint_date, category, description, location, status) VALUES
(1, 12, 2, '2026-10-18 10:01:14+00', 'Damaged Stormwater Drain Cover', 'Missing storm drain grate posing pedestrian hazard.', 'Civic Park Walkway, Gate 2', 'Submitted'),
(2, 14, 2, '2026-10-10 15:01:14+00', 'Damaged Stormwater Drain Cover', 'Missing storm drain grate posing pedestrian hazard.', 'Civic Park Walkway, Gate 2', 'Assigned'),
(3, 7, 5, '2026-10-07 15:01:14+00', 'Fumigation Request', 'High mosquito density following recent monsoon rains.', 'East End Apartments', 'Categorized'),
(4, 9, 6, '2026-10-18 03:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Categorized'),
(5, 16, 3, '2026-10-02 02:01:14+00', 'Overflowing Garbage Dumpster', 'Community waste container not cleared for over 48 hours.', 'Subhash Nagar Market', 'In Progress'),
(6, 8, 2, '2026-10-13 00:01:14+00', 'Dangerous Deep Pothole', 'Large pothole causing vehicle damage and traffic bottleneck.', 'Main Boulevard near Central Metro', 'Verified'),
(7, 25, 4, '2026-10-10 18:01:14+00', 'Flickering Sodium Lamp', 'High mast lighting fluctuating constantly at night.', 'Station Road Crossing', 'Categorized'),
(8, 10, 4, '2026-10-06 00:01:14+00', 'Flickering Sodium Lamp', 'High mast lighting fluctuating constantly at night.', 'Station Road Crossing', 'Verified'),
(9, 3, 2, '2026-10-06 05:01:14+00', 'Faded Pedestrian Crossing', 'Zebra crossing markings completely worn out near school.', 'High School Road, Ward 12', 'In Progress'),
(10, 8, 4, '2026-10-09 07:01:14+00', 'Exposed Electric Wiring', 'Loose electric wire hanging near playground pole.', 'Ward 4 Community Park', 'Verified'),
(11, 14, 2, '2026-10-07 03:01:14+00', 'Damaged Stormwater Drain Cover', 'Missing storm drain grate posing pedestrian hazard.', 'Civic Park Walkway, Gate 2', 'Submitted'),
(12, 3, 3, '2026-10-01 17:01:14+00', 'Uncollected Commercial Waste', 'Fish market organic waste decomposing.', 'Old Fish Market Plaza', 'Resolved'),
(13, 15, 5, '2026-10-01 04:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'Resolved'),
(14, 6, 6, '2026-10-04 22:01:14+00', 'Damaged Playground Swings', 'Broken chain on swing set in municipal playground.', 'Sunset Point Children''s Park', 'Submitted'),
(15, 22, 5, '2026-10-04 16:01:14+00', 'Fumigation Request', 'High mosquito density following recent monsoon rains.', 'East End Apartments', 'Submitted'),
(16, 15, 6, '2026-10-04 06:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Assigned'),
(17, 22, 5, '2026-10-07 19:01:14+00', 'Fumigation Request', 'High mosquito density following recent monsoon rains.', 'East End Apartments', 'Verified'),
(18, 1, 1, '2026-10-17 18:01:14+00', 'Contaminated Water Supply', 'Tap water appearing discolored with unusual odor.', 'Greenwood Colony, Lane 3', 'Submitted'),
(19, 8, 3, '2026-10-03 20:01:14+00', 'Illegal Dumping of Debris', 'Construction debris dumped along service lane.', 'Outer Ring Road, Mile 4', 'Verified'),
(20, 8, 5, '2026-10-12 00:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'Categorized'),
(21, 1, 1, '2026-09-30 23:01:14+00', 'Contaminated Water Supply', 'Tap water appearing discolored with unusual odor.', 'Greenwood Colony, Lane 3', 'Submitted'),
(22, 9, 6, '2026-10-09 08:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Verified'),
(23, 15, 3, '2026-10-17 17:01:14+00', 'Overflowing Garbage Dumpster', 'Community waste container not cleared for over 48 hours.', 'Subhash Nagar Market', 'Verified'),
(24, 17, 4, '2026-10-17 07:01:14+00', 'Flickering Sodium Lamp', 'High mast lighting fluctuating constantly at night.', 'Station Road Crossing', 'Resolved'),
(25, 13, 5, '2026-10-01 08:01:14+00', 'Fumigation Request', 'High mosquito density following recent monsoon rains.', 'East End Apartments', 'Verified'),
(26, 9, 1, '2026-10-08 17:01:14+00', 'Contaminated Water Supply', 'Tap water appearing discolored with unusual odor.', 'Greenwood Colony, Lane 3', 'Submitted'),
(27, 12, 4, '2026-10-03 20:01:14+00', 'Dark Streetlights', 'Consecutive 6 streetlights non-operational on main street.', 'Silver Oak Avenue', 'Resolved'),
(28, 25, 1, '2026-10-14 19:01:14+00', 'Water Pipeline Burst', 'Clean water overflowing onto roadway for 6+ hours.', 'Corner of 5th Ave & Market St', 'Categorized'),
(29, 16, 1, '2026-10-16 16:01:14+00', 'Water Pipeline Burst', 'Clean water overflowing onto roadway for 6+ hours.', 'Corner of 5th Ave & Market St', 'Resolved'),
(30, 21, 3, '2026-10-06 10:01:14+00', 'Uncollected Commercial Waste', 'Fish market organic waste decomposing.', 'Old Fish Market Plaza', 'Assigned'),
(31, 5, 2, '2026-10-14 23:01:14+00', 'Faded Pedestrian Crossing', 'Zebra crossing markings completely worn out near school.', 'High School Road, Ward 12', 'Assigned'),
(32, 1, 6, '2026-10-11 10:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Categorized'),
(33, 24, 3, '2026-10-04 23:01:14+00', 'Illegal Dumping of Debris', 'Construction debris dumped along service lane.', 'Outer Ring Road, Mile 4', 'Resolved'),
(34, 4, 5, '2026-10-15 20:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'Categorized'),
(35, 15, 4, '2026-10-09 16:01:14+00', 'Flickering Sodium Lamp', 'High mast lighting fluctuating constantly at night.', 'Station Road Crossing', 'Verified'),
(36, 15, 1, '2026-10-04 14:01:14+00', 'Water Pipeline Burst', 'Clean water overflowing onto roadway for 6+ hours.', 'Corner of 5th Ave & Market St', 'Verified'),
(37, 21, 6, '2026-10-03 05:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Verified'),
(38, 15, 6, '2026-10-15 17:01:14+00', 'Damaged Playground Swings', 'Broken chain on swing set in municipal playground.', 'Sunset Point Children''s Park', 'Categorized'),
(39, 2, 5, '2026-10-05 23:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'Assigned'),
(40, 4, 5, '2026-10-01 10:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'In Progress'),
(41, 3, 5, '2026-10-11 15:01:14+00', 'Stagnant Water & Mosquito Breeding', 'Open vacant plot with stagnant water pool.', 'Maple Residency Sector 9', 'Verified'),
(42, 2, 6, '2026-10-01 07:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Submitted'),
(43, 23, 5, '2026-10-06 17:01:14+00', 'Fumigation Request', 'High mosquito density following recent monsoon rains.', 'East End Apartments', 'In Progress'),
(44, 14, 2, '2026-10-12 06:01:14+00', 'Faded Pedestrian Crossing', 'Zebra crossing markings completely worn out near school.', 'High School Road, Ward 12', 'Resolved'),
(45, 5, 6, '2026-10-08 02:01:14+00', 'Fallen Tree Branch', 'Large bough blocking two lanes after windstorm.', 'Nehru Park Outer Perimeter', 'Resolved'),
(46, 17, 2, '2026-10-16 10:01:14+00', 'Damaged Stormwater Drain Cover', 'Missing storm drain grate posing pedestrian hazard.', 'Civic Park Walkway, Gate 2', 'In Progress'),
(47, 8, 1, '2026-10-06 05:01:14+00', 'Water Pipeline Burst', 'Clean water overflowing onto roadway for 6+ hours.', 'Corner of 5th Ave & Market St', 'Categorized'),
(48, 20, 2, '2026-10-12 06:01:14+00', 'Damaged Stormwater Drain Cover', 'Missing storm drain grate posing pedestrian hazard.', 'Civic Park Walkway, Gate 2', 'Assigned'),
(49, 13, 4, '2026-10-04 01:01:14+00', 'Flickering Sodium Lamp', 'High mast lighting fluctuating constantly at night.', 'Station Road Crossing', 'Assigned'),
(50, 9, 6, '2026-10-02 04:01:14+00', 'Damaged Playground Swings', 'Broken chain on swing set in municipal playground.', 'Sunset Point Children''s Park', 'Categorized');

-- 5. Work Orders
INSERT INTO WORK_ORDER (work_order_id, complaint_id, staff_id, assigned_date, completion_date, work_status, action_taken) VALUES
(1, 2, 6, '2026-10-11 04:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(2, 5, 7, '2026-10-02 14:01:14+00', NULL, 'In Progress', 'Under field assessment'),
(3, 6, 6, '2026-10-13 16:01:14+00', '2026-10-14 04:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(4, 8, 11, '2026-10-06 08:01:14+00', '2026-10-06 20:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(5, 9, 6, '2026-10-06 14:01:14+00', NULL, 'In Progress', 'Under field assessment'),
(6, 10, 12, '2026-10-09 09:01:14+00', '2026-10-09 21:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(7, 12, 8, '2026-10-02 00:01:14+00', '2026-10-02 12:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(8, 13, 13, '2026-10-01 20:01:14+00', '2026-10-02 08:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(9, 16, 18, '2026-10-04 22:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(10, 17, 13, '2026-10-08 02:01:14+00', '2026-10-08 14:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(11, 19, 7, '2026-10-04 15:01:14+00', '2026-10-05 03:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(12, 22, 18, '2026-10-09 19:01:14+00', '2026-10-10 07:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(13, 23, 8, '2026-10-18 17:01:14+00', '2026-10-19 05:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(14, 24, 12, '2026-10-17 09:01:14+00', '2026-10-17 21:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(15, 25, 13, '2026-10-01 14:01:14+00', '2026-10-02 02:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(16, 27, 10, '2026-10-04 00:01:14+00', '2026-10-04 12:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(17, 29, 2, '2026-10-17 01:01:14+00', '2026-10-17 13:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(18, 30, 8, '2026-10-07 00:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(19, 31, 5, '2026-10-15 02:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(20, 33, 9, '2026-10-05 21:01:14+00', '2026-10-06 09:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(21, 35, 11, '2026-10-10 16:01:14+00', '2026-10-11 04:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(22, 36, 2, '2026-10-04 19:01:14+00', '2026-10-05 07:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(23, 37, 17, '2026-10-03 21:01:14+00', '2026-10-04 09:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(24, 39, 14, '2026-10-06 08:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(25, 40, 15, '2026-10-02 09:01:14+00', NULL, 'In Progress', 'Under field assessment'),
(26, 41, 15, '2026-10-12 12:01:14+00', '2026-10-13 00:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(27, 43, 13, '2026-10-07 04:01:14+00', NULL, 'In Progress', 'Under field assessment'),
(28, 44, 6, '2026-10-13 05:01:14+00', '2026-10-13 17:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(29, 45, 17, '2026-10-08 20:01:14+00', '2026-10-09 08:01:14+00', 'Completed', 'Inspection performed. Required repairs executed on site.'),
(30, 46, 4, '2026-10-17 06:01:14+00', NULL, 'In Progress', 'Under field assessment'),
(31, 48, 5, '2026-10-13 00:01:14+00', NULL, 'Assigned', 'Under field assessment'),
(32, 49, 12, '2026-10-05 01:01:14+00', NULL, 'Assigned', 'Under field assessment');

-- 6. Decision Audit Log
INSERT INTO DECISION_AUDIT_LOG (audit_id, complaint_id, work_order_id, alert_type, explanation, suggested_action, supervisor_decision, decided_by_staff_id, decision_timestamp, created_at) VALUES
(1, 8, 4, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-06 08:01:14+00', '2026-10-06 08:01:14+00'),
(2, 10, 6, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-09 09:01:14+00', '2026-10-09 09:01:14+00'),
(3, 11, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(4, 14, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(5, 15, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(6, 19, 11, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-04 15:01:14+00', '2026-10-04 15:01:14+00'),
(7, 21, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(8, 22, 12, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-09 19:01:14+00', '2026-10-09 19:01:14+00'),
(9, 26, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(10, 27, 16, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-04 00:01:14+00', '2026-10-04 00:01:14+00'),
(11, 30, 18, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-07 00:01:14+00', '2026-10-07 00:01:14+00'),
(12, 31, 19, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-15 02:01:14+00', '2026-10-15 02:01:14+00'),
(13, 36, 22, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-04 19:01:14+00', '2026-10-04 19:01:14+00'),
(14, 37, 23, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-03 21:01:14+00', '2026-10-03 21:01:14+00'),
(15, 42, NULL, 'Overdue Alert', 'Complaint pending department assignment for over 72 hours.', 'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, '2026-10-19 13:01:14+00'),
(16, 43, 27, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-07 04:01:14+00', '2026-10-07 04:01:14+00'),
(17, 45, 29, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-08 20:01:14+00', '2026-10-08 20:01:14+00'),
(18, 46, 30, 'Workload Check', 'Staff member assigned 4 active tickets in 24 hours.', 'Recommend reallocating non-critical work order.', 'Approved', 1, '2026-10-17 06:01:14+00', '2026-10-17 06:01:14+00');

-- Reset sequences for serial primary keys
SELECT setval('department_department_id_seq', (SELECT MAX(department_id) FROM DEPARTMENT));
SELECT setval('staff_staff_id_seq', (SELECT MAX(staff_id) FROM STAFF));
SELECT setval('citizen_citizen_id_seq', (SELECT MAX(citizen_id) FROM CITIZEN));
SELECT setval('complaint_complaint_id_seq', (SELECT MAX(complaint_id) FROM COMPLAINT));
SELECT setval('work_order_work_order_id_seq', (SELECT MAX(work_order_id) FROM WORK_ORDER));
SELECT setval('decision_audit_log_audit_id_seq', (SELECT MAX(audit_id) FROM DECISION_AUDIT_LOG));

COMMIT;
