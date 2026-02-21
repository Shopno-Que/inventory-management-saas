from django.urls import path
from django.contrib.auth import views as auth_views
from .views import settings, signup, stores
from django.urls import reverse_lazy

app_name = "user"
urlpatterns = [
    path('signin/', auth_views.LoginView.as_view(
      template_name='user/signin.html',
      redirect_authenticated_user = True
    ), 
      name='signin'
    ),
    path('signout/', auth_views.LogoutView.as_view(
        template_name='user/signout.html'
    ),
        name='signout'
    ),
    path("signup/", signup, name="signup"),
    path('settings/', settings, name='settings'),
    path('stores/', stores, name='stores'),
    path('password_change/',
        auth_views.PasswordChangeView.as_view(
          template_name='user/password_change.html', 
          success_url = reverse_lazy("user:password_change_done"),
        ),
        name='password_change',
    ),
    path('password_change/done/',
        auth_views.PasswordChangeDoneView.as_view(
          template_name='user/password_change_done.html'
        ),
        name='password_change_done'
    ),
    path('password_reset/',
        auth_views.PasswordResetView.as_view(
            template_name='user/password_reset_form.html',
            email_template_name = "email/password_reset_email.html",
            subject_template_name = "email/password_reset_subject.txt",
            success_url=reverse_lazy('user:password_reset_done')
        ),
        name='password_reset'
    ),
    path(
        'password_reset/done/',
        auth_views.PasswordResetDoneView.as_view(
          template_name='user/password_reset_done.html'
        ),
        name='password_reset_done'
    ),
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
          template_name='user/password_reset_confirm.html',
          success_url = reverse_lazy("user:password_reset_complete"),
        ),
        name='password_reset_confirm',
    ),
    path(
        'reset/done/',
        auth_views.PasswordResetCompleteView.as_view(
          template_name='user/password_reset_complete.html'
        ),
        name='password_reset_complete'
    ),
]
