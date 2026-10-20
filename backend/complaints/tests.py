"""
Unit and integration tests for Municipal Complaint Management System (MCMS).
Validates requirements FR-01 through FR-09.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from complaints.models import (
    Citizen,
    Department,
    Staff,
    Complaint,
    DecisionAuditLog,
)


class MCMSTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create basic test department
        self.dept_water = Department.objects.create(
            department_name="Water Supply & Sanitation",
            office_location="Town Hall Block A",
        )
        self.dept_roads = Department.objects.create(
            department_name="Roads & Infrastructure Maintenance",
            office_location="Town Hall Block B",
        )

        # Create test staff
        self.staff_water = Staff.objects.create(
            department=self.dept_water,
            name="Ananya Gupta",
            phone="+1-555-0901",
            designation="Senior Supervisor",
            is_active=True,
        )
        self.staff_roads = Staff.objects.create(
            department=self.dept_roads,
            name="Aarav Verma",
            phone="+1-555-0906",
            designation="Junior Inspector",
            is_active=True,
        )

        # Create test citizen
        self.citizen = Citizen.objects.create(
            name="Priya Sharma",
            phone="+1-555-0201",
            address="Flat 102, Building B",
        )

    # -------------------------------------------------------------
    # FR-01: Citizen Profile Management
    # -------------------------------------------------------------
    def test_fr01_create_citizen(self):
        url = reverse("citizen-list")
        data = {
            "name": "Rohan Iyer",
            "phone": "+1-555-0202",
            "address": "Flat 204, Building C",
        }
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["name"], "Rohan Iyer")
        self.assertTrue(Citizen.objects.filter(phone="+1-555-0202").exists())

    def test_fr01_duplicate_phone_conflict(self):
        url = reverse("citizen-list")
        data = {
            "name": "Priya Duplicate",
            "phone": "+1-555-0201",  # Already exists in setUp
            "address": "Another Address",
        }
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_409_CONFLICT)

    # -------------------------------------------------------------
    # FR-02: Complaint Input Validation
    # -------------------------------------------------------------
    def test_fr02_validate_complaint_inputs(self):
        url = reverse("complaint-validate-details")

        # Valid inputs
        valid_data = {
            "phone": self.citizen.phone,
            "description": "Deep pipeline fracture causing major water leak on roadway.",
            "location": "Sector 4 Main Road",
        }
        res = self.client.post(url, valid_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["valid"])

        # Invalid: description too short (<10 chars)
        invalid_data = {
            "phone": self.citizen.phone,
            "description": "Leak",
            "location": "Sector 4 Main Road",
        }
        res = self.client.post(url, invalid_data, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(res.data["valid"])

    # -------------------------------------------------------------
    # FR-03: Categorization & Department Routing
    # -------------------------------------------------------------
    def test_fr03_categorize_routing(self):
        url = reverse("complaint-categorize")
        data = {"category": "Contaminated Water Supply Pipeline"}
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            res.data["matched_department_name"], "Water Supply & Sanitation"
        )

    # -------------------------------------------------------------
    # FR-04: Atomic Complaint Registration
    # -------------------------------------------------------------
    def test_fr04_register_complaint(self):
        url = reverse("complaint-list")
        data = {
            "citizen_name_input": "New Citizen",
            "citizen_phone_input": "+1-555-0777",
            "citizen_address_input": "Street 9, Ward 3",
            "department": self.dept_roads.department_id,
            "category": "Dangerous Deep Pothole",
            "description": "Large road crater causing vehicular damage near crossing.",
            "location": "Main Crossing Mile 3",
        }
        res = self.client.post(url, data, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["status"], "Submitted")
        self.assertTrue(res.data["ticket_code"].startswith("CMP-"))
        self.assertEqual(res.data["citizen_phone"], "+1-555-0777")

    # -------------------------------------------------------------
    # FR-05 & FR-06: Work Order Dispatch & Status Synchronization
    # -------------------------------------------------------------
    def test_fr05_and_fr06_work_order_lifecycle(self):
        # 1. Create a complaint
        complaint = Complaint.objects.create(
            citizen=self.citizen,
            department=self.dept_roads,
            category="Damaged Stormwater Drain Cover",
            description="Broken drain grate near pedestrian sidewalk.",
            location="Civic Walkway Gate 2",
            status=Complaint.STATUS_SUBMITTED,
        )

        # 2. FR-05: Assign work order -> complaint becomes 'Assigned'
        wo_url = reverse("work-order-list")
        wo_data = {
            "complaint": complaint.complaint_id,
            "staff": self.staff_roads.staff_id,
            "work_status": "Assigned",
        }
        res_wo = self.client.post(wo_url, wo_data, format="json")
        self.assertEqual(res_wo.status_code, status.HTTP_201_CREATED)
        wo_id = res_wo.data["work_order_id"]

        complaint.refresh_from_db()
        self.assertEqual(complaint.status, "Assigned")

        # 3. FR-06: Staff updates work order to 'In Progress'
        detail_url = reverse("work-order-detail", kwargs={"pk": wo_id})
        res_patch1 = self.client.patch(
            detail_url,
            {
                "work_status": "In Progress",
                "action_taken": "Field inspection initiated.",
            },
            format="json",
        )
        self.assertEqual(res_patch1.status_code, status.HTTP_200_OK)

        complaint.refresh_from_db()
        self.assertEqual(complaint.status, "In Progress")

        # 4. FR-06: Staff completes work order -> complaint becomes 'Resolved'
        res_patch2 = self.client.patch(
            detail_url,
            {"work_status": "Completed", "action_taken": "Replaced grate cover."},
            format="json",
        )
        self.assertEqual(res_patch2.status_code, status.HTTP_200_OK)

        complaint.refresh_from_db()
        self.assertEqual(complaint.status, "Resolved")

    # -------------------------------------------------------------
    # FR-07: Citizen Inquiry Service
    # -------------------------------------------------------------
    def test_fr07_track_complaint(self):
        complaint = Complaint.objects.create(
            citizen=self.citizen,
            department=self.dept_water,
            category="Water Pipeline Burst",
            description="Main pipe leak on highway.",
            location="Highway Mile 4",
            status=Complaint.STATUS_IN_PROGRESS,
        )

        track_url = reverse("complaint-track")

        # Track by ID
        res_by_id = self.client.get(f"{track_url}?id={complaint.complaint_id}")
        self.assertEqual(res_by_id.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_by_id.data), 1)
        self.assertEqual(res_by_id.data[0]["status"], "In Progress")

        # Track by Phone
        res_by_phone = self.client.get(f"{track_url}?phone={self.citizen.phone}")
        self.assertEqual(res_by_phone.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res_by_phone.data), 1)

    # -------------------------------------------------------------
    # FR-08: Administrative Reports Endpoint
    # -------------------------------------------------------------
    def test_fr08_reports_endpoint(self):
        reports_url = reverse("reports")
        res = self.client.get(reports_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("summary", res.data)
        self.assertIn("departments", res.data)
        self.assertIn("pending_backlog", res.data["summary"])

    # -------------------------------------------------------------
    # FR-09: Decision-Support Agent Alert Center
    # -------------------------------------------------------------
    def test_fr09_alerts_and_supervisor_decision(self):
        alert = DecisionAuditLog.objects.create(
            alert_type="Overdue Alert",
            explanation="Ticket pending queue assignment for over 72 hours.",
            suggested_action="Escalate to Department Head for priority allocation.",
            supervisor_decision="Pending",
        )

        decide_url = reverse("agent-alert-decide", kwargs={"pk": alert.audit_id})
        res = self.client.post(
            decide_url,
            {"decision": "Approved", "staff_id": self.staff_water.staff_id},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["supervisor_decision"], "Approved")

        alert.refresh_from_db()
        self.assertEqual(alert.supervisor_decision, "Approved")
        self.assertIsNotNone(alert.decision_timestamp)
