from django.db import models
from core.models.base import BusinessBaseModel


class Expense(BusinessBaseModel):
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)


class FinancialTransaction(BusinessBaseModel):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

    TYPE_CHOICES = [
        (CREDIT, "Credit"),
        (DEBIT, "Debit"),
    ]

    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    note = models.TextField(blank=True)
