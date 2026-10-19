"""
URL configuration for Municipal Complaint Management System (MCMS).
"""

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse


def health_check(request):
    return JsonResponse(
        {"status": "healthy", "service": "mcms-backend-api", "version": "1.0.0"}
    )


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check, name="health_check"),
]
