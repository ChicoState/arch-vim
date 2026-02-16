"""
URL configuration for arch-vim project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Add your app URL patterns here
    # path('api/', include('apps.your_app.urls')),
]
