from django.urls import path
from . import views

app_name = "expenses"

urlpatterns = [
    path("", views.expense_list, name="expense_list"),
    path("add/", views.expense_create, name="add"),
    path("<int:expense_id>/edit/", views.expense_update, name="edit"),
]