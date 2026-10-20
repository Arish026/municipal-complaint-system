"""
Serializers for Municipal Complaint Management System (MCMS).
Implements validation and data serialization per SRS FR-01 through FR-09.
"""

from rest_framework import serializers
from .models import Citizen, Department, Staff, Complaint, WorkOrder, DecisionAuditLog


class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ["citizen_id", "name", "phone", "address", "created_at"]
        read_only_fields = ["citizen_id", "created_at"]

    def validate_phone(self, value):
        cleaned = value.strip()
        if len(cleaned) < 8:
            raise serializers.ValidationError(
                "Phone number must contain at least 8 characters."
            )
        return cleaned


class DepartmentSerializer(serializers.ModelSerializer):
    staff_count = serializers.SerializerMethodField()
    active_complaints = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            "department_id",
            "department_name",
            "office_location",
            "staff_count",
            "active_complaints",
        ]

    def get_staff_count(self, obj):
        return obj.staff_members.count()

    def get_active_complaints(self, obj):
        return obj.complaints.exclude(
            status__in=[
                Complaint.STATUS_RESOLVED,
                Complaint.STATUS_VERIFIED,
                Complaint.STATUS_CLOSED,
            ]
        ).count()


class StaffSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source="department.department_name")

    class Meta:
        model = Staff
        fields = [
            "staff_id",
            "department",
            "department_name",
            "name",
            "phone",
            "designation",
            "is_active",
        ]


class WorkOrderSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source="staff.name")
    staff_phone = serializers.ReadOnlyField(source="staff.phone")
    department_name = serializers.ReadOnlyField(
        source="staff.department.department_name"
    )
    complaint_category = serializers.ReadOnlyField(source="complaint.category")
    complaint_location = serializers.ReadOnlyField(source="complaint.location")

    class Meta:
        model = WorkOrder
        fields = [
            "work_order_id",
            "complaint",
            "staff",
            "staff_name",
            "staff_phone",
            "department_name",
            "complaint_category",
            "complaint_location",
            "assigned_date",
            "completion_date",
            "work_status",
            "action_taken",
        ]
        read_only_fields = ["work_order_id", "assigned_date"]


class ComplaintSerializer(serializers.ModelSerializer):
    citizen_name = serializers.ReadOnlyField(source="citizen.name")
    citizen_phone = serializers.ReadOnlyField(source="citizen.phone")
    department_name = serializers.ReadOnlyField(source="department.department_name")
    ticket_code = serializers.SerializerMethodField()
    work_orders = WorkOrderSerializer(many=True, read_only=True)

    # Allow writing citizen details directly when creating a complaint (FR-01 + FR-04)
    citizen_name_input = serializers.CharField(write_only=True, required=False)
    citizen_phone_input = serializers.CharField(write_only=True, required=False)
    citizen_address_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Complaint
        fields = [
            "complaint_id",
            "ticket_code",
            "citizen",
            "citizen_name",
            "citizen_phone",
            "citizen_name_input",
            "citizen_phone_input",
            "citizen_address_input",
            "department",
            "department_name",
            "complaint_date",
            "category",
            "description",
            "location",
            "status",
            "work_orders",
        ]
        read_only_fields = ["complaint_id", "ticket_code", "complaint_date", "citizen"]

    def get_ticket_code(self, obj):
        return f"CMP-{str(obj.complaint_id).zfill(4)}"

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Complaint narrative must be at least 10 characters long (FR-02)."
            )
        return value.strip()

    def validate_location(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError(
                "Location must be at least 5 characters long (FR-02)."
            )
        return value.strip()

    def create(self, validated_data):
        # Extract direct citizen creation inputs if provided
        citizen_name = validated_data.pop("citizen_name_input", None)
        citizen_phone = validated_data.pop("citizen_phone_input", None)
        citizen_address = validated_data.pop("citizen_address_input", None)

        citizen = validated_data.get("citizen")
        if not citizen and citizen_phone:
            # Check or create citizen atomically (FR-01)
            citizen, _ = Citizen.objects.get_or_create(
                phone=citizen_phone.strip(),
                defaults={
                    "name": citizen_name.strip() if citizen_name else "Citizen",
                    "address": (
                        citizen_address.strip()
                        if citizen_address
                        else "Registered Address"
                    ),
                },
            )
            validated_data["citizen"] = citizen

        if not validated_data.get("citizen"):
            raise serializers.ValidationError(
                {"citizen": "Citizen information or registered citizen_id is required."}
            )

        return super().create(validated_data)


class DecisionAuditLogSerializer(serializers.ModelSerializer):
    complaint_category = serializers.ReadOnlyField(source="complaint.category")
    decided_by_name = serializers.ReadOnlyField(source="decided_by_staff.name")

    class Meta:
        model = DecisionAuditLog
        fields = [
            "audit_id",
            "complaint",
            "complaint_category",
            "work_order",
            "alert_type",
            "explanation",
            "suggested_action",
            "supervisor_decision",
            "decided_by_staff",
            "decided_by_name",
            "decision_timestamp",
            "created_at",
        ]
        read_only_fields = ["audit_id", "created_at"]


class ComplaintValidationSerializer(serializers.Serializer):
    """FR-02: Validates citizen identity and complaint inputs."""

    phone = serializers.CharField(max_length=20)
    description = serializers.CharField(min_length=10, max_length=2000)
    location = serializers.CharField(min_length=5, max_length=255)

    def validate_phone(self, value):
        if not Citizen.objects.filter(phone=value.strip()).exists():
            raise serializers.ValidationError(
                "Unregistered citizen phone. Please register citizen record first (FR-01)."
            )
        return value.strip()


class ComplaintCategorizationSerializer(serializers.Serializer):
    """FR-03: Maps complaint categories to appropriate departments."""

    category = serializers.CharField(max_length=100)

    # Static categorization routing table from SRS
    ROUTING_MAP = {
        "water": "Water Supply & Sanitation",
        "leak": "Water Supply & Sanitation",
        "contamination": "Water Supply & Sanitation",
        "pipeline": "Water Supply & Sanitation",
        "pothole": "Roads & Infrastructure Maintenance",
        "road": "Roads & Infrastructure Maintenance",
        "drain": "Roads & Infrastructure Maintenance",
        "crossing": "Roads & Infrastructure Maintenance",
        "garbage": "Solid Waste Management",
        "waste": "Solid Waste Management",
        "debris": "Solid Waste Management",
        "dumpster": "Solid Waste Management",
        "light": "Street Lighting & Electricity",
        "lamp": "Street Lighting & Electricity",
        "wire": "Street Lighting & Electricity",
        "electricity": "Street Lighting & Electricity",
        "mosquito": "Public Health & Vector Control",
        "fumigation": "Public Health & Vector Control",
        "stagnant": "Public Health & Vector Control",
        "tree": "Parks & Urban Forestry",
        "park": "Parks & Urban Forestry",
        "playground": "Parks & Urban Forestry",
    }

    def get_department(self):
        cat = self.validated_data["category"].lower()
        matched_dept_name = "Water Supply & Sanitation"
        for keyword, dept_name in self.ROUTING_MAP.items():
            if keyword in cat:
                matched_dept_name = dept_name
                break
        return Department.objects.filter(
            department_name__icontains=matched_dept_name
        ).first()
