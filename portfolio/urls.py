from django.urls import path
from . import views

app_name = "portfolio"  # 👈 registers the namespace

urlpatterns = [
    path("", views.index, name="index"),
    path("resume/", views.resume, name="resume"),
    path("about/", views.about, name="about"),
]
