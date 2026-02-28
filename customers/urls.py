from django.urls import path
from . import views

app_name = "customers"

urlpatterns = [
    path("all/",views.customer_list,name="customer_list"),
    path("new/",views.customer_create,name="customer_create"),
    path("<int:customer_id>/edit/",views.customer_edit,name="customer_edit"),
    path("search/", views.customer_search, name="customer_search"),
]