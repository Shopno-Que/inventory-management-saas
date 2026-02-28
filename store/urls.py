from django.urls import path
from . import views

app_name = "store"

urlpatterns = [
    path('create/', views.create_store, name='create_store'),
    path('<int:store_id>/delete/', views.delete_store, name='delete_store'),
    path('<int:store_id>/dashboard/', views.dashboard, name='dashboard'),
    path('<int:store_id>/expenses/', views.expenses, name='expenses'),

    # settings
    path('<int:store_id>/settings/info', views.store_info_settings, name='store_info_settings'),
    
    # staff
    path('<int:store_id>/staff', views.store_staff, name='store_staff'),
    path('<int:store_id>/staff/invite', views.invite_staff, name='invite_staff'),
    path('<int:store_id>/staff/invite/<int:invite_id>/cancel', views.cancel_staff_invite, name='cancel_staff_invite'),
    path('<int:store_id>/staff/<int:staff_id>', views.staff_details, name='staff_details'),
    path("<int:store_id>/staff/<int:staff_id>/remove/", views.remove_staff, name="remove_staff"),
    path('invites/<uuid:token>/accept', views.accept_invite, name='accept_invite'),
]
