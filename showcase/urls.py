
from django.contrib import admin
from django.contrib.auth.decorators import login_required
from django.urls import path, include, re_path, reverse_lazy
from django.views.generic.base import TemplateView

from . import views


app_name = 'showcase'

from django.contrib.auth import views as auth_views


urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    ]