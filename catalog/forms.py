from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "sku", "price", "stock_qty"]

        widgets = {
            "name": forms.TextInput(attrs={
                "class": "w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                "placeholder": "প্রোডাক্টের নাম লিখুন",
            }),
            "sku": forms.TextInput(attrs={
                "class": "w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                "placeholder": "SKU (ঐচ্ছিক)",
            }),
            "price": forms.NumberInput(attrs={
                "class": "w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                "placeholder": "মূল্য (টাকা)",
                "min": 0,
            }),
            "stock_qty": forms.NumberInput(attrs={
                "class": "w-full rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                "placeholder": "স্টক সংখ্যা",
                "min": 0,
            }),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only name is required
        self.fields["name"].required = True
        self.fields["sku"].required = False
        self.fields["price"].required = False
        self.fields["stock_qty"].required = False
