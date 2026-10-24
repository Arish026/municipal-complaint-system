"""
Management command to seed MCMS database with realistic municipal test data for Karachi.
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
    help = "Seeds database with synthetic Karachi municipal seed data matching frontend."

    def handle(self, *args, **options):
        self.stdout.write("Seeding municipal database with Karachi dataset...")

        # 1. Departments
        departments_data = [
            (
                1,
                "KWSC — Karachi Water & Sewerage Corporation",
                "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi",
            ),
            (
                2,
                "KMC — Roads & Civil Infrastructure",
                "KMC Head Office, M.A. Jinnah Road, Saddar, Karachi",
            ),
            (
                3,
                "SSWMB — Sindh Solid Waste Management Board",
                "Civic Center Wing, Gulshan-e-Iqbal Block 14, Karachi",
            ),
            (
                4,
                "K-Electric & Municipal Street Lighting Wing",
                "KMC Electrical Depot, Nishtar Road, Karachi",
            ),
            (
                5,
                "Sindh Health Dept — Vector & Malaria Control",
                "Civil Hospital Complex, Baba-e-Urdu Road, Karachi",
            ),
            (
                6,
                "KMC — Parks & Urban Forestry Department",
                "Bagh-e-Jinnah (Frere Hall), Fatima Jinnah Road, Karachi",
            ),
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
            (1, 1, "Engr. Zulfiqar Haider", "0300-2419081", "Senior Executive Engineer"),
            (2, 1, "Tariq Mehmood Alvi", "0321-9876541", "Lead Pipeline Inspector"),
            (3, 1, "Kashif Raza", "0333-8761234", "Field Sub-Engineer"),
            (4, 2, "Engr. Kamran Akram", "0345-2109876", "Chief Works Supervisor"),
            (5, 2, "Shahid Hussain", "0312-3456789", "Pothole & Asphalt Technician"),
            (6, 2, "Sub-Inspector Noman Ali", "0301-7654321", "Civil Field Inspector"),
            (7, 3, "Muhammad Asif", "0302-8877665", "Zonal Sanitation Officer"),
            (8, 3, "Rashid Minhas", "0334-5544332", "Compactor Fleet Lead"),
            (9, 4, "Farhan Siddiqui", "0346-1122334", "Senior Grid Technician"),
            (10, 4, "Owais Qureshi", "0322-9988776", "Street Light Inspector"),
            (11, 5, "Dr. Irfan Hashmi", "0300-5566778", "Public Health Epidemiologist"),
            (12, 6, "Zeeshan Abbasi", "0313-4455667", "Horticulture Field Officer"),
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
                "Syed Murtaza Zaidi",
                "0300-2415981",
                "Flat 402, Al-Ghafoor Heights, Block 13-D, Gulshan-e-Iqbal",
            ),
            (
                2,
                "Ayesha Farooq",
                "0321-8849120",
                "House 84-B, Khayaban-e-Shahbaz, DHA Phase 6",
            ),
            (
                3,
                "Bilal Ahmed Qureshi",
                "0333-5129480",
                "Apartment 12, Clifton View Tower, Block 4, Clifton",
            ),
            (
                4,
                "Dr. Samina Parveen",
                "0345-3108742",
                "B-14, Block H, Near Five Star Chowrangi, North Nazimabad",
            ),
            (
                5,
                "Malik Jahangir",
                "0312-9014522",
                "Shop 18, Regal Trade Square, Preedy Street, Saddar",
            ),
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
                "Missing Manhole Cover",
                "Deep open circular manhole without cover near school crossing. Extremely hazardous in dark.",
                "Main University Road near Disco Bakery, Gulshan Block 13-D",
                "Submitted",
                6,
            ),
            (
                2,
                2,
                2,
                "Dangerous Deep Pothole",
                "Heavy crater formed after stormwater pipeline collapse, damaging vehicles and causing traffic bottleneck.",
                "Shahrah-e-Faisal near Baloch Colony Flyover ramp",
                "Assigned",
                14,
            ),
            (
                5,
                3,
                3,
                "Overflowing Kachra Kundi",
                "Garbage dump spilling onto road edge. Waste collection vehicle has not visited for 4 days.",
                "Boat Basin Food Street, Block 5, Clifton",
                "In Progress",
                22,
            ),
            (
                6,
                4,
                1,
                "Water Pipeline Burst",
                "High pressure drinking water line ruptured under road surface, flooding adjacent residential street.",
                "Block H, Five Star Chowrangi, North Nazimabad",
                "Verified",
                11,
            ),
            (
                10,
                5,
                4,
                "Exposed Live Electric Cable",
                "Open utility wire dangling from rusted pole at pedestrian eye level near commercial plaza.",
                "Preedy Street near Empress Market, Saddar",
                "Resolved",
                15,
            ),
            (
                11,
                1,
                5,
                "Dengue & Malaria Fumigation Request",
                "Severe mosquito breeding from stagnant sewer pool behind residential market. Urgent fogging needed.",
                "Allama Shabbir Ahmed Usmani Road, Gulshan Block 4",
                "Submitted",
                17,
            ),
            (
                28,
                2,
                1,
                "Contaminated Drinking Line",
                "Tap water emitting foul odor and dark sediment. Suspected cross-leakage with adjacent sewer conduit.",
                "Street 14, Khayaban-e-Mujahid, DHA Phase 5",
                "Categorized",
                9,
            ),
            (
                29,
                3,
                6,
                "Fallen Neem Tree Blocking Traffic",
                "Large mature tree snapped during storm wind, blocking both lanes of inner residential road.",
                "Near Hilal Park, Khayaban-e-Hilal, DHA Phase 6",
                "Resolved",
                8,
            ),
            (
                30,
                4,
                3,
                "Illegal Construction Debris Dumping",
                "Truck unloaded concrete rubble on public pedestrian sidewalk, completely obstructing foot traffic.",
                "Main Korangi Road near CBM / IoBM Gate",
                "Assigned",
                18,
            ),
            (
                40,
                5,
                2,
                "Sunken Asphalt Paving",
                "Road surface subsided over underground storm drain after recent monsoon run-off.",
                "Shahrah-e-Liaquat near Burns Road food street",
                "In Progress",
                23,
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
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(complaint_map)} complaints."))

        # 5. Work Orders
        orders_data = [
            (
                101,
                2,
                6,
                "In Progress",
                "Inspection completed by Sub-Inspector Noman Ali. Asphalt cold mix and road roller dispatched.",
                13,
                None,
            ),
            (
                102,
                5,
                8,
                "In Progress",
                "SSWMB mechanical compactor unit en route to Boat Basin garbage point.",
                21,
                None,
            ),
            (
                103,
                10,
                9,
                "Completed",
                "Cable isolated, elevated to pole junction box and insulated with weather-proof conduit.",
                15,
                15,
            ),
            (
                104,
                29,
                12,
                "Completed",
                "Trunk cut into sections with chainsaw, loaded onto KMC flatbed truck, and thoroughfare cleared.",
                8,
                8,
            ),
            (
                105,
                30,
                7,
                "Assigned",
                "Site notice issued. Front-loader truck assigned for rubble lifting tomorrow morning.",
                17,
                None,
            ),
            (
                106,
                40,
                5,
                "In Progress",
                "Excavation completed. Sub-base gravel compaction underway before final hot asphalt layer.",
                22,
                None,
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
                40,
                106,
                "Overdue Alert",
                "Work Order #106 has remained in In-Progress status for over 72 hours without asphalt laying completion.",
                "Authorize additional asphalt crew and heavy roller dispatch to Burns Road site.",
                "Pending",
                None,
                timedelta(days=7),
            ),
            (
                2,
                11,
                None,
                "Workload Check",
                "Gulshan Block 4 has logged multiple vector breeding complaints. Health spray team workload is critical.",
                "Coordinate with Sindh Health District East for dual-vehicle fumigation sweep.",
                "Pending",
                None,
                timedelta(days=6),
            ),
            (
                3,
                10,
                103,
                "Workload Check",
                "Exposed live wire hazard reported in high-density pedestrian zone (Saddar).",
                "Priority dispatch approved and emergency insulated tape applied.",
                "Approved",
                9,
                timedelta(days=15),
            ),
        ]
        for a_id, cmp_id, wo_id, a_type, expl, sugg, dec, s_id, delta in audit_data:
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
                    "decision_timestamp": now - delta if dec != "Pending" else None,
                    "created_at": now - delta,
                },
            )
        self.stdout.write(
            self.style.SUCCESS("Database seeding completed successfully with Karachi municipal dataset!")
        )
