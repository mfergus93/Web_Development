from django.shortcuts import render

def index(request):
    return render(request, "portfolio/index.html")

def resume(request):
    return render(request, "portfolio/resume.html")

def about(request):
    return render(request, "portfolio/about.html")
