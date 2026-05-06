from django.urls import path
from . import views
from .views import StarView, ProgressView

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/me/', views.UserDetailView.as_view()),
    path('progress/', views.UserProgress),
    path('progress/save/', views.save_level),
    path("api/stars/<int:level_id>/", StarView.as_view(), name="star-view"),
    path("api/progress/", ProgressView.as_view(), name="progress"),
    path("api/progress/save/", ProgressView.as_view(), name="progress-save"),
]