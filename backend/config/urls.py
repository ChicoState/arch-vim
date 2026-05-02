from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from backend.api.views import ProgressView, StarView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', TokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/', include('api.urls')),
    path("api/stars/<int:level_id>/", StarView.as_view(), name="star-view"),
    path("api/progress/", ProgressView.as_view(), name="progress"),
    path("api/progress/save/", ProgressView.as_view(), name="progress-save"),
]