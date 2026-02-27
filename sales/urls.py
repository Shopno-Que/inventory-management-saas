from django.urls import path
from . import views

app_name = "sales"

urlpatterns = [
    path("orders/",views.order_list,name="order_list"),
    path("orders/new/",views.order_create,name="order_create"),
    path("orders/<int:order_id>/edit/",views.order_edit,name="order_edit"),
    path("orders/<int:order_id>/",views.order_view,name="order_view"),
]