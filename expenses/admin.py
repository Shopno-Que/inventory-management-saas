from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("title", "amount", "date", "store")
    list_filter = ("store",)
    search_fields = ("title", "amount", "date")