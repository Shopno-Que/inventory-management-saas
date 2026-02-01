from rest_framework.viewsets import ModelViewSet

from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness

from apps.inventory.models import Stock, StockTransaction
from .serializers import StockSerializer, StockTransactionSerializer


class StockViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Stock.objects.select_related("product").all()
    serializer_class = StockSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["product__name"]


class StockTransactionViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = StockTransaction.objects.select_related("product").all()
    serializer_class = StockTransactionSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["note", "type"]
    ordering_fields = ["created_at"]
