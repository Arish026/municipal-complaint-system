-- ============================================================================
-- 02_dml_seed_dataset.sql
-- Municipal Complaint Management System (MCMS)
-- Academic & Engineering Standard: University of Karachi — BS Computer Science (DBMS)
-- Realistic Seed Dataset: Karachi Metropolitan Municipal Services
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED DEPARTMENTS (6 Karachi Municipal Agencies)
-- ----------------------------------------------------------------------------
INSERT INTO DEPARTMENT (department_id, department_name, office_location) VALUES
(1, 'Karachi Water & Sewerage Corporation (KWSC)', '9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi'),
(2, 'Karachi Metropolitan Corporation — Works & Services', 'KMC Head Office, M.A. Jinnah Road, Karachi'),
(3, 'Sindh Solid Waste Management Board (SSWMB)', 'D-47, Block 2, Clifton, Karachi'),
(4, 'K-Electric Public Street Lighting & Power Grid', 'KE House, Punjab Colony, Gizri Road, Karachi'),
(5, 'Sindh Health Department — Vector-Borne Disease Control', 'Directorate of Health Services, Civic Centre, Gulshan-e-Iqbal, Karachi'),
(6, 'Karachi Metropolitan Corporation — Parks & Urban Forestry', 'Baghe-e-Jinnah, Club Road, Civil Lines, Karachi')
ON CONFLICT (department_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. SEED STAFF (12 Active Field Officers across Karachi Agencies)
-- ----------------------------------------------------------------------------
INSERT INTO STAFF (staff_id, department_id, name, phone, designation, is_active) VALUES
(1, 1, 'Tariq Mahmood', '0300-2415981', 'Senior Pipeline Specialist', TRUE),
(2, 1, 'Kamran Akram', '0321-8849201', 'Sewage Network Supervisor', TRUE),
(3, 2, 'Rashid Minhas', '0333-5192840', 'Chief Road Inspector', TRUE),
(4, 2, 'Farooq Sattar', '0312-6729104', 'Asphalt & Paving Supervisor', TRUE),
(5, 3, 'Ghulam Murtaza', '0345-8102934', 'Zonal Sanitation Officer', TRUE),
(6, 3, 'Imtiaz Shaikh', '0302-4491028', 'Solid Waste Fleet Coordinator', TRUE),
(7, 4, 'Sohail Anwar', '0322-9918274', 'Senior Grid Lead', TRUE),
(8, 4, 'Zubair Siddiqui', '0331-7728190', 'Field Line Supervisor', TRUE),
(9, 5, 'Dr. Naeem Qureshi', '0300-3349182', 'Chief Entomologist & Vector Lead', TRUE),
(10, 5, 'Zafar Abbas', '0315-6628194', 'Fumigation Field Officer', TRUE),
(11, 6, 'Owais Noorani', '0344-5519283', 'Urban Arborist & Tree Care Officer', TRUE),
(12, 6, 'Khurram Shehzad', '0320-1192847', 'Parks Horticulture Inspector', TRUE)
ON CONFLICT (staff_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. SEED CITIZENS (5 Karachi Residents)
-- ----------------------------------------------------------------------------
INSERT INTO CITIZEN (citizen_id, name, phone, address, created_at) VALUES
(1, 'Syed Ali Raza', '0300-1234567', 'Flat B-4, Al-Ghafoor Heights, Block 13-D, Gulshan-e-Iqbal, Karachi', '2026-10-15 08:30:00+00'),
(2, 'Sara Khan', '0321-7654321', 'House 42/II, 7th Commercial Street, Phase IV, DHA, Karachi', '2026-10-16 10:15:00+00'),
(3, 'Muhammad Bilal', '0333-9876543', 'Plot 512, Sector 11-A, North Karachi', '2026-10-17 12:00:00+00'),
(4, 'Zainab Fatima', '0312-3456789', 'Apartment 302, Rufi Paradise, Block 19, Johar, Karachi', '2026-10-18 14:45:00+00'),
(5, 'Hamza Tariq', '0345-6789012', 'House 18-C, Dhoraji Colony, CP Berar Society, Karachi', '2026-10-19 16:20:00+00')
ON CONFLICT (citizen_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. SEED COMPLAINTS (10 Karachi Infrastructure Incidents)
-- ----------------------------------------------------------------------------
INSERT INTO COMPLAINT (complaint_id, citizen_id, department_id, complaint_date, category, description, location, status) VALUES
(1, 1, 1, '2026-10-20 09:15:00+00', 'Water Supply Leakage', 'Main 12-inch distribution pipeline rupture spilling potable water onto roadway.', 'Main University Road, Near Expo Centre, Block 13-D, Gulshan-e-Iqbal, Karachi', 'In Progress'),
(2, 2, 2, '2026-10-21 11:30:00+00', 'Road Potholes & Craters', 'Deep crater spanning both lanes following monsoon rains causing traffic gridlock.', 'Khayaban-e-Ittehad, Intersection with 26th Street, Phase VI, DHA, Karachi', 'Assigned'),
(3, 3, 3, '2026-10-22 08:00:00+00', 'Uncollected Garbage Dump', 'Overflowing municipal garbage dumpster attracting vectors near primary school.', 'Shahrah-e-Noor Jahan, Near Power House Chowrangi, Sector 11-B, North Karachi', 'In Progress'),
(4, 4, 4, '2026-10-22 14:10:00+00', 'Damaged Electric Pole', 'Exposed 440V distribution lines dangling from pole posing imminent electrocution hazard.', 'Block 19, Near Kamran Chowrangi, Gulistan-e-Johar, Karachi', 'Assigned'),
(5, 5, 5, '2026-10-23 10:00:00+00', 'Stagnant Water Fumigation', 'Large pool of standing rain water creating severe dengue mosquito breeding zone.', 'Dhoraji Colony, Near Ghazi Park, CP Berar Society, Karachi', 'Completed'),
(6, 1, 6, '2026-10-23 16:45:00+00', 'Fallen Tree Roadway Block', 'Decayed neem tree fell during windstorm blocking dual carriageway completely.', 'Sir Shah Suleman Road, Near National Stadium, Karachi', 'Completed'),
(7, 2, 1, '2026-10-24 07:30:00+00', 'Sewage Overflow', 'Gutter backflow flooding residential lane with raw sewage.', 'Commercial Area B, Phase II, DHA, Karachi', 'Submitted'),
(8, 3, 2, '2026-10-24 09:00:00+00', 'Missing Manhole Covers', 'Two open stormwater manholes without safety barriers causing hazard.', 'Sector 5-M, Near Manghopir Road, New Karachi', 'Categorized'),
(9, 4, 3, '2026-10-24 10:15:00+00', 'Construction Debris Disposal', 'Tons of concrete rubble dumped on public footpath preventing pedestrian transit.', 'Block 1, Johar Chowrangi Road, Gulistan-e-Johar, Karachi', 'Submitted'),
(10, 5, 4, '2026-10-24 11:00:00+00', 'Non-Functional Streetlights', 'Entire stretch of 16 streetlights unlit for 10 days leading to crime spike.', 'Amir Khusro Road, Block 7/8, Karachi', 'Submitted')
ON CONFLICT (complaint_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED WORK ORDERS (6 Field Assignments Linked to Staff)
-- ----------------------------------------------------------------------------
INSERT INTO WORK_ORDER (work_order_id, complaint_id, staff_id, assigned_date, completion_date, work_status, action_taken) VALUES
(1, 1, 1, '2026-10-20 10:00:00+00', NULL, 'In Progress', 'Excavation team on site at Expo Centre. 12-inch collar clamp deployed; pipeline pressure draining.'),
(2, 2, 4, '2026-10-21 12:15:00+00', NULL, 'Assigned', 'Dispatched asphalt patching roller crew. Work scheduled for low-traffic night shift.'),
(3, 3, 5, '2026-10-22 09:00:00+00', NULL, 'In Progress', 'SSWMB compactor vehicle CN-412 deployed to clear North Karachi kachra kundi.'),
(4, 4, 7, '2026-10-22 15:00:00+00', NULL, 'Assigned', 'KE emergency grid crew dispatched with bucket truck to de-energize and secure cable.'),
(5, 5, 10, '2026-10-23 11:00:00+00', '2026-10-23 15:30:00+00', 'Completed', 'Thermal fogging and larvicide granules applied across standing pool. Disinfection complete.'),
(6, 6, 11, '2026-10-23 17:15:00+00', '2026-10-23 20:45:00+00', 'Completed', 'Hydraulic chainsaws utilized to slice fallen trunk. Tree debris hauled off; road clear.')
ON CONFLICT (work_order_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED DECISION AUDIT LOGS (3 Operational Escalation Traces)
-- ----------------------------------------------------------------------------
INSERT INTO DECISION_AUDIT_LOG (audit_id, complaint_id, work_order_id, alert_type, explanation, suggested_action, supervisor_decision, decided_by_staff_id, decision_timestamp, created_at) VALUES
(1, 1, 1, 'SLA Overdue Warning', 'Complaint CMP-0001 (Main University Road pipe rupture) has remained open for 96 hours, exceeding 72h SLA.', 'Deploy secondary emergency backhoe and authorize overtime for lead pipeline specialist.', 'Approved', 1, '2026-10-24 10:00:00+00', '2026-10-23 14:00:00+00'),
(2, 4, 4, 'High Hazard Priority Alert', 'Complaint CMP-0004 involves active exposed electrical line near high-density residential zone.', 'Expedite immediate dispatch of senior grid supervisor Sohail Anwar ahead of routine maintenance queue.', 'Pending', NULL, NULL, '2026-10-22 14:15:00+00'),
(3, 3, 3, 'Workload Bottleneck Warning', 'Zonal sanitation officer Ghulam Murtaza has 4 concurrent high-priority clearance work orders.', 'Reassign North Karachi Sector 11-B clearance to backup fleet coordinator Imtiaz Shaikh.', 'Pending', NULL, NULL, '2026-10-23 09:30:00+00')
ON CONFLICT (audit_id) DO NOTHING;
