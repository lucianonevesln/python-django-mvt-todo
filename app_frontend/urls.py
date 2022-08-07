from django.urls import path
from . import views

urlpatterns = [
    #path('', views.frontendTeste, name='frontend'),
    path('', views.index)
]