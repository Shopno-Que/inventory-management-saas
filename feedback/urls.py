from django.urls import path
from .views import feedback_post

app_name = "feedback"
urlpatterns = [
    path('post/', feedback_post, name='post'),
]
