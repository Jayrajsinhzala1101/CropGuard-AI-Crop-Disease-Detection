"""
URL configuration for crop_disease_detection project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from detection.views import api_info

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('detection.urls')),
    path('', api_info, name='api_info'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 