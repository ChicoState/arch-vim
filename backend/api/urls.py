from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/me/', views.UserDetailView.as_view()),
    path('progress/', views.save_load_levels),
]