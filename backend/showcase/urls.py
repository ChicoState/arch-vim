
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include, re_path, reverse_lazy
from django.views.generic.base import TemplateView
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

from . import views


app_name = 'showcase'

from django.contrib.auth import views as auth_views


router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('', include(router.urls)),
    path('mylevel/', views.MyLevelView.as_view(), name='mylevel'),
    path('levels/<int:level>/', views.MyLevelView.as_view(), name='level'), #dynamic url with a pk function appending to the number corresponding to the level from model Level
    ]
