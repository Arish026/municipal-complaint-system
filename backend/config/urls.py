"""
URL configuration for Municipal Complaint Management System (MCMS).
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    from django.db import connection
    from django.utils import timezone
    from complaints.models import Complaint, Department, Staff

    db_status = "connected"
    try:
        connection.ensure_connection()
    except Exception as e:
        db_status = f"error: {str(e)}"

    return JsonResponse(
        {
            "status": "healthy" if db_status == "connected" else "degraded",
            "service": "mcms-backend-api",
            "version": "1.0.0",
            "database": db_status,
            "timestamp": timezone.now().isoformat(),
            "counts": {
                "departments": Department.objects.count(),
                "complaints": Complaint.objects.count(),
                "staff": Staff.objects.count(),
            },
        }
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health_check"),
    path("api/health", health_check),
    path("api/", include("complaints.urls")),
]
