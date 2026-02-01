from rest_framework.viewsets import ModelViewSet

from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness

from apps.finance.models import Expense, FinancialTransaction
from .serializers import ExpenseSerializer, FinancialTransactionSerializer


class ExpenseViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["title"]


class FinancialTransactionViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = FinancialTransaction.objects.all()
    serializer_class = FinancialTransactionSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["note", "type"]
    ordering_fields = ["amount", "created_at"]
