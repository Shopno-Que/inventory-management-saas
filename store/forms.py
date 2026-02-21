from django import forms
from .models import Store, Invitation, Team

class StoreCreateForm(forms.ModelForm):
    class Meta:
        model = Store
        fields = ["name"]
        labels = {
            "name": "স্টোরের নাম",
        }
        widgets = {
            "name": forms.TextInput(attrs={
                "placeholder": "স্টোরের নাম লিখুন",
            })
        }

class StoreEditForm(StoreCreateForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class InviteStaffForm(forms.Form):
    email = forms.EmailField(
        label="Staff Email",
        widget=forms.EmailInput(attrs={
        })
    )
    role = forms.ChoiceField(
        label="Role",
        choices=Team.ROLE_CHOICES,  # use the same choices as model
        widget=forms.Select(attrs={
        })
    )

class EditStaffForm(forms.Form):
    role = forms.ChoiceField(
        label="Role",
        choices=Team.ROLE_CHOICES,  # use the same choices as model
        widget=forms.Select(attrs={
        })
    )