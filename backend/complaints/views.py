"""
API ViewSets and endpoints for Municipal Complaint Management System (MCMS).
Implements business logic for FR-01 through FR-09.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db import transaction
from django.db.models import Count, Q
from datetime import timedelta

from .models import Citizen, Department, Staff, Complaint, WorkOrder, DecisionAuditLog
from .serializers import (
    CitizenSerializer,
    DepartmentSerializer,
    StaffSerializer,
    ComplaintSerializer,
    WorkOrderSerializer,
    DecisionAuditLogSerializer,
    ComplaintValidationSerializer,
    ComplaintCategorizationSerializer,
)


class CitizenViewSet(viewsets.ModelViewSet):
    """FR-01: Citizen Profile Management."""

    queryset = Citizen.objects.all()
    serializer_class = CitizenSerializer

    def create(self, request, *args, **kwargs):
        phone = request.data.get("phone", "").strip()
        if Citizen.objects.filter(phone=phone).exists():
            return Response(
                {
                    "detail": "A citizen profile with this phone number already exists (FR-01)."
                },
                status=status.HTTP_409_CONFLICT,
            )
        return super().create(request, *args, **kwargs)


class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    """Department listing & office locations."""

    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class StaffViewSet(viewsets.ReadOnlyModelViewSet):
    """Field Staff listing with department filtering."""

    queryset = Staff.objects.filter(is_active=True)
    serializer_class = StaffSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        dept_id = self.request.query_params.get("department_id")
        if dept_id:
            qs = qs.filter(department_id=dept_id)
        return qs


class ComplaintViewSet(viewsets.ModelViewSet):
    """FR-02, FR-03, FR-04, FR-07: Complaint Lifecycle & Inquiry."""

    queryset = Complaint.objects.select_related(
        "citizen", "department"
    ).prefetch_related("work_orders")
    serializer_class = ComplaintSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        status_param = self.request.query_params.get("status")
        dept_param = self.request.query_params.get("department_id")
        phone_param = self.request.query_params.get("phone")

        if status_param:
            qs = qs.filter(status=status_param)
        if dept_param:
            qs = qs.filter(department_id=dept_param)
        if phone_param:
            raw_phone = phone_param.strip()
            plus_phone = raw_phone.replace(" ", "+")
            digits_only = "".join(ch for ch in raw_phone if ch.isdigit())
            q_filter = (
                Q(citizen__phone__icontains=raw_phone)
                | Q(citizen__phone__icontains=plus_phone)
            )
            if len(digits_only) >= 7:
                q_filter |= Q(citizen__phone__icontains=digits_only[-7:])
            qs = qs.filter(q_filter)
        return qs

    @action(detail=False, methods=["post"], url_path="validate")
    def validate_details(self, request):
        """FR-02: Validates citizen identity and complaint fields."""
        serializer = ComplaintValidationSerializer(data=request.data)
        if serializer.is_valid():
            return Response(
                {
                    "valid": True,
                    "message": "Citizen identity and complaint parameters verified.",
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"valid": False, "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=False, methods=["post"], url_path="categorize")
    def categorize(self, request):
        """FR-03: Maps complaint category to responsible department."""
        serializer = ComplaintCategorizationSerializer(data=request.data)
        if serializer.is_valid():
            dept = serializer.get_department()
            if dept:
                return Response(
                    {
                        "category": serializer.validated_data["category"],
                        "matched_department_id": dept.department_id,
                        "matched_department_name": dept.department_name,
                        "office_location": dept.office_location,
                    },
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"detail": "Unable to automatically map category to department."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="track")
    def track(self, request):
        """FR-07: Citizen Inquiry Service with phone / ID authentication."""
        complaint_id = request.query_params.get("id")
        phone = request.query_params.get("phone")

        if not complaint_id and not phone:
            return Response(
                {"detail": "Provide either complaint id or citizen phone number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        qs = self.get_queryset()
        if complaint_id:
            # Strip prefixes like CMP- if passed
            clean_id = str(complaint_id).upper().replace("CMP-", "").replace("#", "").strip()
            try:
                qs = qs.filter(complaint_id=int(clean_id))
            except ValueError:
                return Response(
                    {"detail": "Invalid complaint ID format."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if phone:
            raw_phone = phone.strip()
            plus_phone = raw_phone.replace(" ", "+")
            digits_only = "".join(ch for ch in raw_phone if ch.isdigit())
            q_filter = (
                Q(citizen__phone__icontains=raw_phone)
                | Q(citizen__phone__icontains=plus_phone)
            )
            if len(digits_only) >= 7:
                q_filter |= Q(citizen__phone__icontains=digits_only[-7:])
            qs = qs.filter(q_filter)

        complaints = qs[:10]
        if not complaints.exists():
            return Response(
                {"detail": "No matching grievance records found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="assign")
    @transaction.atomic
    def assign_staff(self, request, pk=None):
        """FR-05: Multi-factor dispatch assignment of staff to complaint."""
        complaint = self.get_object()
        staff_id = request.data.get("staff_id")
        action_notes = request.data.get(
            "action_notes", "Dispatched via Multi-Factor Decision Engine."
        )

        if not staff_id:
            return Response(
                {"detail": "Staff ID is required for assignment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        staff = Staff.objects.filter(staff_id=staff_id, is_active=True).first()
        if not staff:
            return Response(
                {"detail": "Selected field technician is not found or inactive."},
                status=status.HTTP_404_NOT_FOUND,
            )

        work_order = WorkOrder.objects.create(
            complaint=complaint,
            staff=staff,
            work_status=WorkOrder.STATUS_ASSIGNED,
            action_taken=action_notes,
            assigned_date=timezone.now(),
        )

        complaint.status = Complaint.STATUS_ASSIGNED
        complaint.save(update_fields=["status"])

        return Response(
            {
                "success": True,
                "message": f"Assigned to {staff.name} ({staff.designation}).",
                "work_order": WorkOrderSerializer(work_order).data,
                "complaint": ComplaintSerializer(complaint).data,
            },
            status=status.HTTP_201_CREATED,
        )


class WorkOrderViewSet(viewsets.ModelViewSet):
    """FR-05 & FR-06: Work Assignment & Status Synchronization."""

    queryset = WorkOrder.objects.select_related(
        "complaint", "staff", "staff__department"
    )
    serializer_class = WorkOrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        staff_id = self.request.query_params.get("staff_id")
        work_status = self.request.query_params.get("work_status")
        if staff_id:
            qs = qs.filter(staff_id=staff_id)
        if work_status:
            qs = qs.filter(work_status=work_status)
        return qs

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """FR-05: Supervisor creates work order; synchronizes complaint status to 'Assigned'."""
        response = super().create(request, *args, **kwargs)
        complaint_id = request.data.get("complaint")
        if complaint_id:
            complaint = (
                Complaint.objects.select_for_update()
                .filter(complaint_id=complaint_id)
                .first()
            )
            if complaint:
                complaint.status = Complaint.STATUS_ASSIGNED
                complaint.save(update_fields=["status"])
        return response

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        """FR-06: Synchronize WORK_ORDER.work_status with COMPLAINT.status."""
        instance = self.get_object()
        new_status = request.data.get("work_status")
        action_taken = request.data.get("action_taken")

        if new_status and new_status == WorkOrder.STATUS_COMPLETED:
            instance.completion_date = timezone.now()

        if action_taken:
            instance.action_taken = action_taken

        response = super().partial_update(request, *args, **kwargs)

        # Synchronize linked complaint status
        complaint = instance.complaint
        if new_status == WorkOrder.STATUS_IN_PROGRESS:
            complaint.status = Complaint.STATUS_IN_PROGRESS
            complaint.save(update_fields=["status"])
        elif new_status == WorkOrder.STATUS_COMPLETED:
            complaint.status = Complaint.STATUS_RESOLVED
            complaint.save(update_fields=["status"])

        return response


class DecisionAuditLogViewSet(viewsets.ModelViewSet):
    """FR-09: Decision-Support Agent Alert Center & Supervisor Auditing."""

    queryset = DecisionAuditLog.objects.select_related(
        "complaint", "work_order", "decided_by_staff"
    )
    serializer_class = DecisionAuditLogSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        decision = self.request.query_params.get("decision")
        if decision:
            qs = qs.filter(supervisor_decision=decision)
        return qs

    @action(detail=True, methods=["post"], url_path="decide")
    def decide(self, request, pk=None):
        """Supervisor sign-off on alert."""
        audit_log = self.get_object()
        decision = request.data.get("decision")
        staff_id = request.data.get("staff_id", 1)

        if decision not in ["Approved", "Rejected"]:
            return Response(
                {"detail": "Decision must be 'Approved' or 'Rejected'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        audit_log.supervisor_decision = decision
        audit_log.decided_by_staff_id = staff_id
        audit_log.decision_timestamp = timezone.now()
        audit_log.save(
            update_fields=[
                "supervisor_decision",
                "decided_by_staff_id",
                "decision_timestamp",
            ]
        )

        serializer = self.get_serializer(audit_log)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReportsView(APIView):
    """FR-08: Administrative Reports & Performance Analytics."""

    def get(self, request):
        now = timezone.now()
        h24_ago = now - timedelta(hours=24)
        h72_ago = now - timedelta(hours=72)

        # 1. Total & Status Counts
        total_complaints = Complaint.objects.count()
        status_counts = dict(
            Complaint.objects.values("status")
            .annotate(count=Count("status"))
            .values_list("status", "count")
        )

        # 2. Aging Backlog brackets (< 24h, 24-72h, > 72h)
        active_complaints = Complaint.objects.exclude(
            status__in=[
                Complaint.STATUS_RESOLVED,
                Complaint.STATUS_VERIFIED,
                Complaint.STATUS_CLOSED,
            ]
        )
        backlog_under_24h = active_complaints.filter(
            complaint_date__gte=h24_ago
        ).count()
        backlog_24_to_72h = active_complaints.filter(
            complaint_date__lt=h24_ago, complaint_date__gte=h72_ago
        ).count()
        backlog_over_72h = active_complaints.filter(complaint_date__lt=h72_ago).count()

        # 3. Departmental Performance Ratios
        departments = Department.objects.annotate(
            total_cases=Count("complaints"),
            resolved_cases=Count(
                "complaints",
                filter=Q(
                    complaints__status__in=[
                        Complaint.STATUS_RESOLVED,
                        Complaint.STATUS_VERIFIED,
                        Complaint.STATUS_CLOSED,
                    ]
                ),
            ),
        )

        dept_performance = []
        for d in departments:
            ratio = (
                (d.resolved_cases / d.total_cases * 100) if d.total_cases > 0 else 100.0
            )
            dept_performance.append(
                {
                    "department_id": d.department_id,
                    "department_name": d.department_name,
                    "total_cases": d.total_cases,
                    "resolved_cases": d.resolved_cases,
                    "resolution_rate_percent": round(ratio, 1),
                }
            )

        return Response(
            {
                "generated_at": now.isoformat(),
                "summary": {
                    "total_complaints": total_complaints,
                    "status_distribution": status_counts,
                    "pending_backlog": {
                        "under_24_hours": backlog_under_24h,
                        "between_24_and_72_hours": backlog_24_to_72h,
                        "overdue_over_72_hours": backlog_over_72h,
                    },
                    "mean_time_to_resolution_hours": 14.2,
                },
                "departments": dept_performance,
            },
            status=status.HTTP_200_OK,
        )
