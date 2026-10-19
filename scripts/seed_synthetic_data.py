#!/usr/bin/env python3
"""
Synthetic Municipal Data Generator
-----------------------------------
Generates realistic synthetic municipal data for the Municipal Complaint Management System (MCMS)
covering Citizens, Departments, Staff, Complaints, Work Orders, and Decision-Support Audit Logs.

Usage:
    python scripts/seed_synthetic_data.py [--sql-out database/seed_data.sql] [--count 50]
"""

import sys
import random
from datetime import datetime, timedelta

DEPARTMENTS = [
    ("Water Supply & Sanitation", "Town Hall Block A, Level 1"),
    ("Roads & Infrastructure Maintenance", "Town Hall Block B, Level 2"),
    ("Solid Waste Management", "Municipal Depot 4, East Ward"),
    ("Street Lighting & Electricity", "Town Hall Block A, Level 3"),
    ("Public Health & Vector Control", "Civic Hospital Complex, Block C"),
    ("Parks & Urban Forestry", "Civic Center North, Level 1"),
]

STAFF_ROLES = [
    "Field Inspector",
    "Maintenance Supervisor",
    "Senior Technician",
    "Sanitation Officer",
    "Chief Engineer",
    "Junior Engineer",
]

COMPLAINT_TEMPLATES = {
    "Water Supply & Sanitation": [
        ("Water Pipeline Burst", "Clean water overflowing onto roadway for 6+ hours.", "Corner of 5th Ave & Market St"),
        ("Low Water Pressure", "Insufficient water supply in residential sector.", "Sector 7, Block B"),
        ("Contaminated Water Supply", "Tap water appearing discolored with unusual odor.", "Greenwood Colony, Lane 3"),
    ],
    "Roads & Infrastructure Maintenance": [
        ("Dangerous Deep Pothole", "Large pothole causing vehicle damage and traffic bottleneck.", "Main Boulevard near Central Metro"),
        ("Damaged Stormwater Drain Cover", "Missing storm drain grate posing pedestrian hazard.", "Civic Park Walkway, Gate 2"),
        ("Faded Pedestrian Crossing", "Zebra crossing markings completely worn out near school.", "High School Road, Ward 12"),
    ],
    "Solid Waste Management": [
        ("Overflowing Garbage Dumpster", "Community waste container not cleared for over 48 hours.", "Subhash Nagar Market"),
        ("Illegal Dumping of Debris", "Construction debris dumped along service lane.", "Outer Ring Road, Mile 4"),
        ("Uncollected Commercial Waste", "Fish market organic waste decomposing.", "Old Fish Market Plaza"),
    ],
    "Street Lighting & Electricity": [
        ("Dark Streetlights", "Consecutive 6 streetlights non-operational on main street.", "Silver Oak Avenue"),
        ("Exposed Electric Wiring", "Loose electric wire hanging near playground pole.", "Ward 4 Community Park"),
        ("Flickering Sodium Lamp", "High mast lighting fluctuating constantly at night.", "Station Road Crossing"),
    ],
    "Public Health & Vector Control": [
        ("Stagnant Water & Mosquito Breeding", "Open vacant plot with stagnant water pool.", "Maple Residency Sector 9"),
        ("Fumigation Request", "High mosquito density following recent monsoon rains.", "East End Apartments"),
    ],
    "Parks & Urban Forestry": [
        ("Fallen Tree Branch", "Large bough blocking two lanes after windstorm.", "Nehru Park Outer Perimeter"),
        ("Damaged Playground Swings", "Broken chain on swing set in municipal playground.", "Sunset Point Children's Park"),
    ],
}

FIRST_NAMES = ["Aarav", "Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Karan", "Pooja", "Rohan", "Meera", "Aditya", "Divya"]
LAST_NAMES = ["Sharma", "Verma", "Patel", "Reddy", "Singh", "Nair", "Iyer", "Khan", "Choudhury", "Gupta", "Das", "Joshi"]

def generate_phone(idx):
    return f"+1-555-01{idx:02d}"

def generate_sql(num_complaints=40):
    lines = ["-- Synthetic Municipal Seed Data Generated for Testing", "BEGIN;\n"]

    # 1. Departments
    lines.append("-- 1. Departments")
    lines.append("INSERT INTO DEPARTMENT (department_id, department_name, office_location) VALUES")
    dept_values = [f"({i+1}, '{name}', '{loc}')" for i, (name, loc) in enumerate(DEPARTMENTS)]
    lines.append(",\n".join(dept_values) + ";\n")

    # 2. Staff
    lines.append("-- 2. Staff Members")
    lines.append("INSERT INTO STAFF (staff_id, department_id, name, phone, designation, is_active) VALUES")
    staff_rows = []
    staff_id = 1
    for dept_id in range(1, len(DEPARTMENTS) + 1):
        for role in ["Senior Supervisor", "Lead Field Technician", "Junior Inspector"]:
            name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
            phone = f"+1-555-09{staff_id:02d}"
            staff_rows.append(f"({staff_id}, {dept_id}, '{name}', '{phone}', '{role}', TRUE)")
            staff_id += 1
    lines.append(",\n".join(staff_rows) + ";\n")
    total_staff = staff_id - 1

    # 3. Citizens
    lines.append("-- 3. Citizens")
    lines.append("INSERT INTO CITIZEN (citizen_id, name, phone, address) VALUES")
    citizen_rows = []
    num_citizens = 25
    for c_id in range(1, num_citizens + 1):
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        phone = f"+1-555-02{c_id:02d}"
        addr = f"Flat {c_id * 102}, Building {chr(65 + (c_id % 6))}, Municipal Zone {1 + (c_id % 4)}"
        citizen_rows.append(f"({c_id}, '{name}', '{phone}', '{addr}')")
    lines.append(",\n".join(citizen_rows) + ";\n")

    # 4. Complaints & Work Orders & Audit
    lines.append("-- 4. Complaints")
    complaint_rows = []
    work_order_rows = []
    audit_rows = []
    statuses = ['Submitted', 'Categorized', 'Assigned', 'In Progress', 'Resolved', 'Verified']
    
    base_time = datetime.now() - timedelta(days=20)
    work_order_id = 1
    audit_id = 1

    for comp_id in range(1, num_complaints + 1):
        dept_id = random.randint(1, len(DEPARTMENTS))
        dept_name = DEPARTMENTS[dept_id - 1][0]
        template = random.choice(COMPLAINT_TEMPLATES[dept_name])
        citizen_id = random.randint(1, num_citizens)
        
        comp_date = base_time + timedelta(days=random.randint(0, 18), hours=random.randint(1, 23))
        comp_date_str = comp_date.strftime("%Y-%m-%d %H:%M:%S+00")
        
        status = random.choice(statuses)
        category = template[0]
        desc = template[1].replace("'", "''")
        loc = template[2].replace("'", "''")
        
        complaint_rows.append(f"({comp_id}, {citizen_id}, {dept_id}, '{comp_date_str}', '{category}', '{desc}', '{loc}', '{status}')")

        # Create work order if assigned or further
        if status in ['Assigned', 'In Progress', 'Resolved', 'Verified']:
            dept_staff_candidates = [s for s in range(1, total_staff + 1) if (s - 1) // 3 + 1 == dept_id]
            assigned_staff = random.choice(dept_staff_candidates) if dept_staff_candidates else 1
            assigned_date = comp_date + timedelta(hours=random.randint(2, 24))
            assigned_date_str = assigned_date.strftime("%Y-%m-%d %H:%M:%S+00")
            
            wo_status = 'Assigned' if status == 'Assigned' else ('In Progress' if status == 'In Progress' else 'Completed')
            comp_date_val = f"'{ (assigned_date + timedelta(hours=12)).strftime('%Y-%m-%d %H:%M:%S+00') }'" if wo_status == 'Completed' else 'NULL'
            action = f"Inspection performed. Required repairs executed on site." if wo_status == 'Completed' else 'Under field assessment'
            
            work_order_rows.append(
                f"({work_order_id}, {comp_id}, {assigned_staff}, '{assigned_date_str}', {comp_date_val}, '{wo_status}', '{action}')"
            )
            
            # Decision-support alert example
            if random.random() < 0.25:
                audit_rows.append(
                    f"({audit_id}, {comp_id}, {work_order_id}, 'Workload Check', "
                    f"'Staff member assigned 4 active tickets in 24 hours.', "
                    f"'Recommend reallocating non-critical work order.', 'Approved', 1, "
                    f"'{assigned_date_str}', '{assigned_date_str}')"
                )
                audit_id += 1
            work_order_id += 1
        elif status == 'Submitted' and (datetime.now() - comp_date.replace(tzinfo=None)).days > 3:
            # Overdue alert
            audit_rows.append(
                f"({audit_id}, {comp_id}, NULL, 'Overdue Alert', "
                f"'Complaint pending department assignment for over 72 hours.', "
                f"'Escalate to Department Head for immediate queue assignment.', 'Pending', NULL, NULL, "
                f"'{datetime.now().strftime('%Y-%m-%d %H:%M:%S+00')}')"
            )
            audit_id += 1

    lines.append("INSERT INTO COMPLAINT (complaint_id, citizen_id, department_id, complaint_date, category, description, location, status) VALUES")
    lines.append(",\n".join(complaint_rows) + ";\n")

    if work_order_rows:
        lines.append("-- 5. Work Orders")
        lines.append("INSERT INTO WORK_ORDER (work_order_id, complaint_id, staff_id, assigned_date, completion_date, work_status, action_taken) VALUES")
        lines.append(",\n".join(work_order_rows) + ";\n")

    if audit_rows:
        lines.append("-- 6. Decision Audit Log")
        lines.append("INSERT INTO DECISION_AUDIT_LOG (audit_id, complaint_id, work_order_id, alert_type, explanation, suggested_action, supervisor_decision, decided_by_staff_id, decision_timestamp, created_at) VALUES")
        lines.append(",\n".join(audit_rows) + ";\n")

    lines.append("-- Reset sequences for serial primary keys")
    lines.append("SELECT setval('department_department_id_seq', (SELECT MAX(department_id) FROM DEPARTMENT));")
    lines.append("SELECT setval('staff_staff_id_seq', (SELECT MAX(staff_id) FROM STAFF));")
    lines.append("SELECT setval('citizen_citizen_id_seq', (SELECT MAX(citizen_id) FROM CITIZEN));")
    lines.append("SELECT setval('complaint_complaint_id_seq', (SELECT MAX(complaint_id) FROM COMPLAINT));")
    if work_order_rows:
        lines.append("SELECT setval('work_order_work_order_id_seq', (SELECT MAX(work_order_id) FROM WORK_ORDER));")
    if audit_rows:
        lines.append("SELECT setval('decision_audit_log_audit_id_seq', (SELECT MAX(audit_id) FROM DECISION_AUDIT_LOG));")

    lines.append("\nCOMMIT;\n")
    return "\n".join(lines)

def main():
    out_path = "database/seed_data.sql"
    if len(sys.argv) > 1 and sys.argv[1].endswith(".sql"):
        out_path = sys.argv[1]
    
    sql_content = generate_sql(num_complaints=50)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"Successfully generated synthetic municipal dataset in: {out_path}")

if __name__ == "__main__":
    main()
