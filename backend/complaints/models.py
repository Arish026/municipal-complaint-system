"""
Database models for Municipal Complaint Management System (MCMS).
Maps directly to PostgreSQL DDL schema and SRS FR-01 through FR-09.
"""

from django.db import models
from django.utils import timezone


class Citizen(models.Model):
    citizen_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    address = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "CITIZEN"
        ordering = ["-created_at"]
        verbose_name = "Citizen"
        verbose_name_plural = "Citizens"

    def __str__(self):
        return f"{self.name} ({self.phone})"


class Department(models.Model):
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=100, unique=True)
    office_location = models.CharField(max_length=200)

    class Meta:
        db_table = "DEPARTMENT"
        ordering = ["department_id"]
        verbose_name = "Department"
        verbose_name_plural = "Departments"

    def __str__(self):
        return self.department_name


class Staff(models.Model):
    staff_id = models.AutoField(primary_key=True)
    department = models.ForeignKey(
        Department,
        on_delete=models.RESTRICT,
        related_name="staff_members",
        db_column="department_id",
    )
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    designation = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "STAFF"
        ordering = ["staff_id"]
        verbose_name = "Staff Member"
        verbose_name_plural = "Staff Members"

    def __str__(self):
        return f"{self.name} - {self.designation} ({self.department.department_name})"


class Complaint(models.Model):
    STATUS_SUBMITTED = "Submitted"
    STATUS_CATEGORIZED = "Categorized"
    STATUS_ASSIGNED = "Assigned"
    STATUS_IN_PROGRESS = "In Progress"
    STATUS_RESOLVED = "Resolved"
    STATUS_VERIFIED = "Verified"
    STATUS_CLOSED = "Closed"
    STATUS_REJECTED = "Rejected"

    STATUS_CHOICES = [
        (STATUS_SUBMITTED, "Submitted"),
        (STATUS_CATEGORIZED, "Categorized"),
        (STATUS_ASSIGNED, "Assigned"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_RESOLVED, "Resolved"),
        (STATUS_VERIFIED, "Verified"),
        (STATUS_CLOSED, "Closed"),
        (STATUS_REJECTED, "Rejected"),
    ]

    complaint_id = models.AutoField(primary_key=True)
    citizen = models.ForeignKey(
        Citizen,
        on_delete=models.RESTRICT,
        related_name="complaints",
        db_column="citizen_id",
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.RESTRICT,
        related_name="complaints",
        db_column="department_id",
    )
    complaint_date = models.DateTimeField(default=timezone.now, db_index=True)
    category = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default=STATUS_SUBMITTED,
        db_index=True,
    )

    class Meta:
        db_table = "COMPLAINT"
        ordering = ["-complaint_date"]
        verbose_name = "Complaint"
        verbose_name_plural = "Complaints"

    def __str__(self):
        return f"CMP-{self.complaint_id}: {self.category} ({self.status})"


class WorkOrder(models.Model):
    STATUS_ASSIGNED = "Assigned"
    STATUS_IN_PROGRESS = "In Progress"
    STATUS_COMPLETED = "Completed"
    STATUS_ON_HOLD = "On Hold"
    STATUS_CANCELLED = "Cancelled"

    WORK_STATUS_CHOICES = [
        (STATUS_ASSIGNED, "Assigned"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_ON_HOLD, "On Hold"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    work_order_id = models.AutoField(primary_key=True)
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.CASCADE,
        related_name="work_orders",
        db_column="complaint_id",
    )
    staff = models.ForeignKey(
        Staff,
        on_delete=models.RESTRICT,
        related_name="work_orders",
        db_column="staff_id",
    )
    assigned_date = models.DateTimeField(default=timezone.now)
    completion_date = models.DateTimeField(null=True, blank=True)
    work_status = models.CharField(
        max_length=50,
        choices=WORK_STATUS_CHOICES,
        default=STATUS_ASSIGNED,
        db_index=True,
    )
    action_taken = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "WORK_ORDER"
        ordering = ["-assigned_date"]
        verbose_name = "Work Order"
        verbose_name_plural = "Work Orders"

    def __str__(self):
        return (
            f"WO-{self.work_order_id} for CMP-{self.complaint_id} ({self.work_status})"
        )


class DecisionAuditLog(models.Model):
    ALERT_OVERDUE = "Overdue Alert"
    ALERT_WORKLOAD = "Workload Check"
    ALERT_RECURRING = "Recurring Issue"

    DECISION_PENDING = "Pending"
    DECISION_APPROVED = "Approved"
    DECISION_REJECTED = "Rejected"

    DECISION_CHOICES = [
        (DECISION_PENDING, "Pending"),
        (DECISION_APPROVED, "Approved"),
        (DECISION_REJECTED, "Rejected"),
    ]

    audit_id = models.AutoField(primary_key=True)
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        db_column="complaint_id",
    )
    work_order = models.ForeignKey(
        WorkOrder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        db_column="work_order_id",
    )
    alert_type = models.CharField(max_length=100)
    explanation = models.TextField()
    suggested_action = models.TextField()
    supervisor_decision = models.CharField(
        max_length=50,
        choices=DECISION_CHOICES,
        default=DECISION_PENDING,
    )
    decided_by_staff = models.ForeignKey(
        Staff,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="decided_audits",
        db_column="decided_by_staff_id",
    )
    decision_timestamp = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "DECISION_AUDIT_LOG"
        ordering = ["-created_at"]
        verbose_name = "Decision Audit Log"
        verbose_name_plural = "Decision Audit Logs"

    def __str__(self):
        return f"Audit-{self.audit_id}: {self.alert_type} ({self.supervisor_decision})"
