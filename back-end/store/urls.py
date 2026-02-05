from django.urls import path
from . import views

app_name = "store"

urlpatterns = [
    path('create/', views.create_store, name='create_store'),
    path('<int:store_id>/', views.store_detail, name='store_detail'),
    path('<int:store_id>/invite/', views.invite_staff, name='invite_staff'),
    path('accept-invite/<uuid:token>/', views.accept_invite, name='accept_invite'),
    path('accept-invite/<uuid:token>/confirm/', views.confirm_invite, name='confirm_invite'),
]
