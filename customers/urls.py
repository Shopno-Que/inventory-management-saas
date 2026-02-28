from django.urls import path
from . import views

app_name = "customers"

urlpatterns = [
    path("search/", views.customer_search, name="customer_search"),
]