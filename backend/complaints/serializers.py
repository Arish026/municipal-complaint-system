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


DEPARTMENT_KEYWORDS_MAP = {
    1: [
        "Water Pipeline Burst",
        "Sewage Overflow on Main Road",
        "Contaminated Drinking Line",
        "Broken Main Trunk Line",
        "Low Line Pressure",
    ],
    2: [
        "Dangerous Deep Pothole",
        "Missing Manhole Cover",
        "Sunken Asphalt Paving",
        "Broken Road Median & Curb",
        "Damaged Storm Drain Grating",
    ],
    3: [
        "Overflowing Kachra Kundi",
        "Illegal Construction Debris Dumping",
        "Uncollected Market Refuse",
        "Dead Animal Removal",
        "Drainage Silt Accumulation",
    ],
    4: [
        "Exposed Live Electric Cable",
        "Entire Street Blackout",
        "Leaning Utility Pole Hazard",
        "Faulty Sodium Lamp Fitting",
        "Transformer Sparking",
    ],
    5: [
        "Dengue & Malaria Fumigation Request",
        "Stagnant Rainwater Pool",
        "Open Gutter Larvae Infestation",
        "Rodent Outbreak in Commercial Zone",
        "Hazardous Medical Waste Dumping",
    ],
    6: [
        "Fallen Neem Tree Blocking Traffic",
        "Damaged Children Swing in Public Park",
        "Overgrown Median Greenery Obscuring Vision",
        "Broken Park Boundary Wall",
        "Park Pathway Erosion",
    ],
}


class DepartmentSerializer(serializers.ModelSerializer):
    staff_count = serializers.SerializerMethodField()
    active_complaints = serializers.SerializerMethodField()
    category_keywords = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = [
            "department_id",
            "department_name",
            "office_location",
            "staff_count",
            "active_complaints",
            "category_keywords",
            "categories",
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

    def get_category_keywords(self, obj):
        return DEPARTMENT_KEYWORDS_MAP.get(obj.department_id, [])

    def get_categories(self, obj):
        return DEPARTMENT_KEYWORDS_MAP.get(obj.department_id, [])


class StaffSerializer(serializers.ModelSerializer):
    department_id = serializers.ReadOnlyField(source="department.department_id")
    department_name = serializers.ReadOnlyField(source="department.department_name")

    class Meta:
        model = Staff
        fields = [
            "staff_id",
            "department",
            "department_id",
            "department_name",
            "name",
            "phone",
            "designation",
            "is_active",
        ]


class WorkOrderSerializer(serializers.ModelSerializer):
    complaint_id = serializers.ReadOnlyField(source="complaint.complaint_id")
    staff_id = serializers.ReadOnlyField(source="staff.staff_id")
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
            "complaint_id",
            "staff",
            "staff_id",
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
    citizen_id = serializers.ReadOnlyField(source="citizen.citizen_id")
    citizen_name = serializers.ReadOnlyField(source="citizen.name")
    citizen_phone = serializers.ReadOnlyField(source="citizen.phone")
    department_id = serializers.ReadOnlyField(source="department.department_id")
    department_name = serializers.ReadOnlyField(source="department.department_name")
    ticket_code = serializers.SerializerMethodField()
    work_orders = WorkOrderSerializer(many=True, read_only=True)

    # Allow writing citizen details directly when creating a complaint (FR-01 + FR-04)
    # Accepts both snake_case and camelCase inputs from frontend
    citizen_name_input = serializers.CharField(write_only=True, required=False)
    citizen_phone_input = serializers.CharField(write_only=True, required=False)
    citizen_address_input = serializers.CharField(write_only=True, required=False)
    citizenName = serializers.CharField(write_only=True, required=False)
    phone = serializers.CharField(write_only=True, required=False)
    address = serializers.CharField(write_only=True, required=False)
    departmentId = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Complaint
        fields = [
            "complaint_id",
            "ticket_code",
            "citizen",
            "citizen_id",
            "citizen_name",
            "citizen_phone",
            "citizen_name_input",
            "citizen_phone_input",
            "citizen_address_input",
            "citizenName",
            "phone",
            "address",
            "department",
            "department_id",
            "departmentId",
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

    def to_internal_value(self, data):
        # Normalize frontend camelCase field names to internal serializer fields
        if hasattr(data, "copy"):
            data = data.copy()
        else:
            data = dict(data)

        if "departmentId" in data and "department" not in data:
            data["department"] = data["departmentId"]
        if "citizenId" in data and "citizen" not in data:
            data["citizen"] = data["citizenId"]

        return super().to_internal_value(data)

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
        # Extract direct citizen creation inputs if provided (supporting both snake_case and camelCase)
        c_name = (
            validated_data.pop("citizen_name_input", None)
            or validated_data.pop("citizenName", None)
        )
        c_phone = (
            validated_data.pop("citizen_phone_input", None)
            or validated_data.pop("phone", None)
        )
        c_addr = (
            validated_data.pop("citizen_address_input", None)
            or validated_data.pop("address", None)
        )

        dept_id_alt = validated_data.pop("departmentId", None)
        if dept_id_alt and not validated_data.get("department"):
            dept_obj = Department.objects.filter(department_id=dept_id_alt).first()
            if dept_obj:
                validated_data["department"] = dept_obj

        citizen = validated_data.get("citizen")
        if not citizen and c_phone:
            # Check or create citizen atomically (FR-01)
            citizen, _ = Citizen.objects.get_or_create(
                phone=c_phone.strip(),
                defaults={
                    "name": c_name.strip() if c_name else "Citizen",
                    "address": (
                        c_addr.strip()
                        if c_addr
                        else "Karachi Municipal Jurisdiction"
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
    complaint_id = serializers.ReadOnlyField(source="complaint.complaint_id")
    work_order_id = serializers.ReadOnlyField(source="work_order.work_order_id")
    decided_by_staff_id = serializers.ReadOnlyField(
        source="decided_by_staff.staff_id"
    )
    complaint_category = serializers.ReadOnlyField(source="complaint.category")
    decided_by_name = serializers.ReadOnlyField(source="decided_by_staff.name")

    class Meta:
        model = DecisionAuditLog
        fields = [
            "audit_id",
            "complaint",
            "complaint_id",
            "complaint_category",
            "work_order",
            "work_order_id",
            "alert_type",
            "explanation",
            "suggested_action",
            "supervisor_decision",
            "decided_by_staff",
            "decided_by_staff_id",
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

    # Categorization routing table matching Karachi municipal responsibilities
    ROUTING_MAP = {
        "water": "Karachi Water & Sewerage",
        "leak": "Karachi Water & Sewerage",
        "contamination": "Karachi Water & Sewerage",
        "pipeline": "Karachi Water & Sewerage",
        "sewage": "Karachi Water & Sewerage",
        "burst": "Karachi Water & Sewerage",
        "pothole": "Roads & Civil Infrastructure",
        "road": "Roads & Civil Infrastructure",
        "drain": "Roads & Civil Infrastructure",
        "crossing": "Roads & Civil Infrastructure",
        "manhole": "Roads & Civil Infrastructure",
        "asphalt": "Roads & Civil Infrastructure",
        "garbage": "Solid Waste Management",
        "waste": "Solid Waste Management",
        "debris": "Solid Waste Management",
        "dumpster": "Solid Waste Management",
        "kachra": "Solid Waste Management",
        "rubble": "Solid Waste Management",
        "light": "Street Lighting",
        "lamp": "Street Lighting",
        "wire": "Street Lighting",
        "cable": "Street Lighting",
        "electricity": "Street Lighting",
        "blackout": "Street Lighting",
        "pole": "Street Lighting",
        "transformer": "Street Lighting",
        "mosquito": "Vector & Malaria Control",
        "fumigation": "Vector & Malaria Control",
        "stagnant": "Vector & Malaria Control",
        "dengue": "Vector & Malaria Control",
        "malaria": "Vector & Malaria Control",
        "tree": "Parks & Urban Forestry",
        "park": "Parks & Urban Forestry",
        "playground": "Parks & Urban Forestry",
        "neem": "Parks & Urban Forestry",
        "branch": "Parks & Urban Forestry",
    }

    def get_department(self):
        cat = self.validated_data["category"].lower()
        matched_dept_name = "Karachi Water & Sewerage"
        for keyword, dept_name in self.ROUTING_MAP.items():
            if keyword in cat:
                matched_dept_name = dept_name
                break
        matched_dept = Department.objects.filter(
            department_name__icontains=matched_dept_name
        ).first()
        if not matched_dept:
            matched_dept = Department.objects.first()
        return matched_dept
