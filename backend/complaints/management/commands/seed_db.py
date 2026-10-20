"""
Management command to seed MCMS database with realistic municipal test data.
Populates Departments, Staff, Citizens, Complaints, Work Orders, and Audit Logs.
Usage: python manage.py seed_db
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from complaints.models import (
    Citizen,
    Department,
    Staff,
    Complaint,
    WorkOrder,
    DecisionAuditLog,
)


class Command(BaseCommand):
    help = "Seeds database with synthetic municipal seed data from SRS/DDL."

    def handle(self, *args, **options):
        self.stdout.write("Seeding municipal database...")

        # 1. Departments
        departments_data = [
            (1, "Water Supply & Sanitation", "Town Hall Block A, Level 1"),
            (2, "Roads & Infrastructure Maintenance", "Town Hall Block B, Level 2"),
            (3, "Solid Waste Management", "Municipal Depot 4, East Ward"),
            (4, "Street Lighting & Electricity", "Town Hall Block A, Level 3"),
            (5, "Public Health & Vector Control", "Civic Hospital Complex, Block C"),
            (6, "Parks & Urban Forestry", "Civic Center North, Level 1"),
        ]
        dept_map = {}
        for dept_id, name, location in departments_data:
            dept, _ = Department.objects.update_or_create(
                department_id=dept_id,
                defaults={"department_name": name, "office_location": location},
            )
            dept_map[dept_id] = dept
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(dept_map)} departments."))

        # 2. Staff Members
        staff_data = [
            (1, 1, "Ananya Gupta", "+1-555-0901", "Senior Supervisor"),
            (2, 1, "Ananya Patel", "+1-555-0902", "Lead Field Technician"),
            (3, 1, "Sneha Verma", "+1-555-0903", "Junior Inspector"),
            (4, 2, "Pooja Verma", "+1-555-0904", "Senior Supervisor"),
            (5, 2, "Divya Nair", "+1-555-0905", "Lead Field Technician"),
            (6, 2, "Aarav Verma", "+1-555-0906", "Junior Inspector"),
            (7, 3, "Divya Singh", "+1-555-0907", "Senior Supervisor"),
            (8, 3, "Rohan Singh", "+1-555-0908", "Lead Field Technician"),
            (9, 3, "Karan Reddy", "+1-555-0909", "Junior Inspector"),
            (10, 4, "Ananya Das", "+1-555-0910", "Senior Supervisor"),
            (11, 4, "Sneha Joshi", "+1-555-0911", "Lead Field Technician"),
            (12, 4, "Ananya Patel", "+1-555-0912", "Junior Inspector"),
            (13, 5, "Ananya Choudhury", "+1-555-0913", "Senior Supervisor"),
            (14, 5, "Aditya Reddy", "+1-555-0914", "Lead Field Technician"),
            (15, 5, "Meera Choudhury", "+1-555-0915", "Junior Inspector"),
            (16, 6, "Divya Joshi", "+1-555-0916", "Senior Supervisor"),
            (17, 6, "Pooja Khan", "+1-555-0917", "Lead Field Technician"),
            (18, 6, "Rahul Nair", "+1-555-0918", "Junior Inspector"),
        ]
        staff_map = {}
        for s_id, d_id, name, phone, desig in staff_data:
            staff, _ = Staff.objects.update_or_create(
                staff_id=s_id,
                defaults={
                    "department": dept_map[d_id],
                    "name": name,
                    "phone": phone,
                    "designation": desig,
                    "is_active": True,
                },
            )
            staff_map[s_id] = staff
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(staff_map)} staff members."))

        # 3. Citizens
        citizens_data = [
            (
                1,
                "Priya Sharma",
                "+1-555-0201",
                "Flat 102, Building B, Municipal Zone 2",
            ),
            (2, "Rohan Iyer", "+1-555-0202", "Flat 204, Building C, Municipal Zone 3"),
            (3, "Aarav Nair", "+1-555-0203", "Flat 306, Building D, Municipal Zone 4"),
            (
                4,
                "Vikram Choudhury",
                "+1-555-0204",
                "Flat 408, Building E, Municipal Zone 1",
            ),
            (5, "Meera Verma", "+1-555-0205", "Flat 510, Building F, Municipal Zone 2"),
        ]
        citizen_map = {}
        for c_id, name, phone, addr in citizens_data:
            citizen, _ = Citizen.objects.update_or_create(
                citizen_id=c_id,
                defaults={"name": name, "phone": phone, "address": addr},
            )
            citizen_map[c_id] = citizen
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(citizen_map)} citizens."))

        # 4. Complaints
        complaints_data = [
            (
                1,
                1,
                2,
                "Damaged Stormwater Drain Cover",
                "Missing storm drain grate posing pedestrian hazard near walkway.",
                "Civic Park Walkway, Gate 2",
                "Submitted",
                2,
            ),
            (
                2,
                2,
                2,
                "Damaged Stormwater Drain Cover",
                "Cracked concrete cover along main road edge.",
                "Civic Park Walkway, Gate 2",
                "Assigned",
                5,
            ),
            (
                3,
                3,
                5,
                "Fumigation Request",
                "High mosquito density following recent monsoon rains.",
                "East End Apartments",
                "Categorized",
                8,
            ),
            (
                4,
                4,
                6,
                "Fallen Tree Branch",
                "Large bough blocking two lanes after windstorm.",
                "Nehru Park Outer Perimeter",
                "Categorized",
                1,
            ),
            (
                5,
                5,
                3,
                "Overflowing Garbage Dumpster",
                "Community waste container not cleared for over 48 hours.",
                "Subhash Nagar Market",
                "In Progress",
                12,
            ),
            (
                6,
                1,
                2,
                "Dangerous Deep Pothole",
                "Large pothole causing vehicle damage and traffic bottleneck.",
                "Main Boulevard near Central Metro",
                "Verified",
                4,
            ),
            (
                7,
                2,
                4,
                "Flickering Sodium Lamp",
                "High mast lighting fluctuating constantly at night.",
                "Station Road Crossing",
                "Categorized",
                9,
            ),
            (
                8,
                3,
                4,
                "Dark Streetlights",
                "Consecutive 6 streetlights non-operational on main street.",
                "Silver Oak Avenue",
                "Resolved",
                14,
            ),
            (
                9,
                4,
                1,
                "Water Pipeline Burst",
                "Clean water overflowing onto roadway for 6+ hours.",
                "Corner of 5th Ave & Market St",
                "In Progress",
                3,
            ),
            (
                10,
                5,
                4,
                "Exposed Electric Wiring",
                "Loose electric wire hanging near playground pole.",
                "Ward 4 Community Park",
                "Resolved",
                10,
            ),
        ]
        complaint_map = {}
        now = timezone.now()
        for cmp_id, cit_id, dept_id, cat, desc, loc, stat, days_ago in complaints_data:
            cmp_obj, _ = Complaint.objects.update_or_create(
                complaint_id=cmp_id,
                defaults={
                    "citizen": citizen_map[cit_id],
                    "department": dept_map[dept_id],
                    "complaint_date": now - timedelta(days=days_ago),
                    "category": cat,
                    "description": desc,
                    "location": loc,
                    "status": stat,
                },
            )
            complaint_map[cmp_id] = cmp_obj
        self.stdout.write(
            self.style.SUCCESS(f"Loaded {len(complaint_map)} complaints.")
        )

        # 5. Work Orders
        orders_data = [
            (1, 2, 6, "Assigned", "Under field assessment; parts scheduled.", 4, None),
            (
                2,
                5,
                8,
                "In Progress",
                "Dispatched sanitation compactor truck to site.",
                10,
                None,
            ),
            (
                3,
                6,
                6,
                "Completed",
                "Site excavated, asphalt applied and roller compacted.",
                3,
                2,
            ),
            (
                4,
                8,
                11,
                "Completed",
                "Installed replacement luminaire and ballast.",
                13,
                12,
            ),
            (
                5,
                9,
                2,
                "In Progress",
                "Shut off sector valve; cutting damaged section.",
                2,
                None,
            ),
            (
                6,
                10,
                12,
                "Completed",
                "Exposed wiring sleeved, conduit secured and pole grounded.",
                9,
                8,
            ),
        ]
        wo_map = {}
        for wo_id, cmp_id, s_id, w_status, action, a_days, c_days in orders_data:
            wo, _ = WorkOrder.objects.update_or_create(
                work_order_id=wo_id,
                defaults={
                    "complaint": complaint_map[cmp_id],
                    "staff": staff_map[s_id],
                    "assigned_date": now - timedelta(days=a_days),
                    "completion_date": (
                        (now - timedelta(days=c_days)) if c_days is not None else None
                    ),
                    "work_status": w_status,
                    "action_taken": action,
                },
            )
            wo_map[wo_id] = wo
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(wo_map)} work orders."))

        # 6. Decision Audit Logs
        audit_data = [
            (
                1,
                6,
                3,
                "Workload Check",
                "Staff member assigned 4 active tickets in 24 hours.",
                "Recommend reallocating non-critical work order.",
                "Approved",
                1,
            ),
            (
                2,
                1,
                None,
                "Overdue Alert",
                "Complaint pending department assignment for over 72 hours.",
                "Escalate to Department Head for immediate queue assignment.",
                "Pending",
                None,
            ),
            (
                3,
                7,
                None,
                "Overdue Alert",
                "Complaint pending department assignment for over 72 hours.",
                "Escalate to Department Head for immediate queue assignment.",
                "Pending",
                None,
            ),
            (
                4,
                9,
                5,
                "Workload Check",
                "Staff member assigned 4 active tickets in 24 hours.",
                "Recommend reallocating non-critical work order.",
                "Approved",
                1,
            ),
        ]
        for a_id, cmp_id, wo_id, a_type, expl, sugg, dec, s_id in audit_data:
            DecisionAuditLog.objects.update_or_create(
                audit_id=a_id,
                defaults={
                    "complaint": complaint_map.get(cmp_id),
                    "work_order": wo_map.get(wo_id),
                    "alert_type": a_type,
                    "explanation": expl,
                    "suggested_action": sugg,
                    "supervisor_decision": dec,
                    "decided_by_staff": staff_map.get(s_id) if s_id else None,
                    "decision_timestamp": now if dec != "Pending" else None,
                    "created_at": now - timedelta(hours=24),
                },
            )
        self.stdout.write(
            self.style.SUCCESS("Database seeding completed successfully!")
        )
