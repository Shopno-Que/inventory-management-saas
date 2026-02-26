from django import forms
from .models import Order


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = []  # no static fields for now (draft only)

    def clean(self):
        cleaned = super().clean()
        return cleaned