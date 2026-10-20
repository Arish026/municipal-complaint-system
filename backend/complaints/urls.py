"""
URL routing for MCMS complaints application.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CitizenViewSet,
    DepartmentViewSet,
    StaffViewSet,
    ComplaintViewSet,
    WorkOrderViewSet,
    DecisionAuditLogViewSet,
    ReportsView,
)

router = DefaultRouter()
router.register(r"citizens", CitizenViewSet, basename="citizen")
router.register(r"departments", DepartmentViewSet, basename="department")
router.register(r"staff", StaffViewSet, basename="staff")
router.register(r"complaints", ComplaintViewSet, basename="complaint")
router.register(r"work-orders", WorkOrderViewSet, basename="work-order")
router.register(r"agent/alerts", DecisionAuditLogViewSet, basename="agent-alert")

urlpatterns = [
    path("", include(router.urls)),
    path("reports/", ReportsView.as_view(), name="reports"),
]
