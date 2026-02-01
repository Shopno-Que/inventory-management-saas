from rest_framework import serializers
from apps.finance.models import Expense, FinancialTransaction


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
        read_only_fields = ("id", "business", "created_at", "updated_at")


class FinancialTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialTransaction
        fields = "__all__"
        read_only_fields = ("id", "business", "created_at", "updated_at")
