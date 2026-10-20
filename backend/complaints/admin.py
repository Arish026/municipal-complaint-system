from django.contrib import admin
from .models import Citizen, Department, Staff, Complaint, WorkOrder, DecisionAuditLog


@admin.register(Citizen)
class CitizenAdmin(admin.ModelAdmin):
    list_display = ("citizen_id", "name", "phone", "created_at")
    search_fields = ("name", "phone", "address")
    list_filter = ("created_at",)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("department_id", "department_name", "office_location")
    search_fields = ("department_name", "office_location")


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = (
        "staff_id",
        "name",
        "department",
        "designation",
        "phone",
        "is_active",
    )
    search_fields = ("name", "phone", "designation")
    list_filter = ("department", "is_active")


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = (
        "complaint_id",
        "category",
        "department",
        "status",
        "citizen",
        "complaint_date",
    )
    search_fields = (
        "category",
        "description",
        "location",
        "citizen__name",
        "citizen__phone",
    )
    list_filter = ("status", "department", "complaint_date")
    date_hierarchy = "complaint_date"


@admin.register(WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    list_display = (
        "work_order_id",
        "complaint",
        "staff",
        "work_status",
        "assigned_date",
        "completion_date",
    )
    search_fields = ("complaint__category", "staff__name", "action_taken")
    list_filter = ("work_status", "assigned_date")


@admin.register(DecisionAuditLog)
class DecisionAuditLogAdmin(admin.ModelAdmin):
    list_display = (
        "audit_id",
        "alert_type",
        "complaint",
        "supervisor_decision",
        "created_at",
    )
    search_fields = ("alert_type", "explanation", "suggested_action")
    list_filter = ("supervisor_decision", "alert_type", "created_at")
