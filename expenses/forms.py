from django import forms
from .models import Expense


class ExpenseForm(forms.ModelForm):
    class Meta:
        model = Expense
        exclude = ("store", "created_at")

        widgets = {
            "title": forms.TextInput(attrs={
                "class": "w-full rounded-xl border-slate-200 focus:ring-indigo-500",
                "placeholder": "খরচের নাম (যেমন: ভাড়া, বিদ্যুৎ বিল)"
            }),

            "amount": forms.NumberInput(attrs={
                "class": "w-full rounded-xl border-slate-200 focus:ring-indigo-500",
                "step": "0.01",
                "placeholder": "টাকা",
                "min": 0
            }),

            "date": forms.DateInput(attrs={
                "type": "date",
                "class": "w-full rounded-xl border-slate-200 focus:ring-indigo-500",
            }),

            "note": forms.Textarea(attrs={
                "rows": 3,
                "class": "w-full rounded-xl border-slate-200 focus:ring-indigo-500",
                "placeholder": "অতিরিক্ত নোট (ঐচ্ছিক)"
            }),
        }