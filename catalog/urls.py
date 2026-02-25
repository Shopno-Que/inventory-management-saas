from django.urls import path
from . import views

app_name = "catalog"

urlpatterns = [
    path("products/", views.product_list, name="product_list"),
    path("products/new/", views.product_create_or_edit, name="product_create"),
    path("products/<int:product_id>/edit/", views.product_create_or_edit, name="product_update"),
]