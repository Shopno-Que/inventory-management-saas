from django.contrib.auth.forms import UserCreationForm
from .models import User
from django import forms

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email", "password1", "password2")

class EditUserProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['name', 'email']

        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'আপনার নাম',
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'আপনার ইমেইল',
            }),
        }
