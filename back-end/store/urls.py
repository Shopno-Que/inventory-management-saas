from django.urls import path
from . import views

app_name = "store"

urlpatterns = [
    path('create/', views.create_store, name='create_store'),
    path('<int:store_id>/delete/', views.delete_store, name='delete_store'),
    path('<int:store_id>/dashboard/', views.dashboard, name='dashboard'),
    path('<int:store_id>/products/', views.products, name='products'),
    path('<int:store_id>/customers/', views.customers, name='customers'),
    path('<int:store_id>/sales/', views.sales, name='sales'),
    path('<int:store_id>/expenses/', views.expenses, name='expenses'),
    path('<int:store_id>/settings/info', views.store_info_settings, name='store_info_settings'),
    path('<int:store_id>/settings/staff', views.store_staff, name='store_staff'),
    path('<int:store_id>/settings/staff/invite', views.invite_staff, name='invite_staff'),
    path('<int:store_id>/settings/staff/<int:staff_id>', views.staff_details, name='staff_details'),
    path('accept-invite/<uuid:token>/', views.accept_invite, name='accept_invite'),
    path('accept-invite/<uuid:token>/confirm/', views.confirm_invite, name='confirm_invite'),
]
