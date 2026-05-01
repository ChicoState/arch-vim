from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view()),
    path('auth/me/', views.UserDetailView.as_view()),
    path('progress/', views.save_load_levels.as_view()), #called in frontend/src/progress.js
]

# path('backend url endpoint', command written in views.py())
# I don't think you need the .as_view() since mine was working without it (I forgot it), however might as well add it since it still works
# I don't think you need the .as_view() IF its written with the @api_view thing in views