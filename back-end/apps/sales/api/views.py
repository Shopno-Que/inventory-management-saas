from rest_framework.viewsets import ModelViewSet

from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness

from apps.sales.models import Order, OrderItem, Payment
from .serializers import OrderSerializer, OrderItemSerializer, PaymentSerializer


class OrderViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all()
    serializer_class = OrderSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["id"]
    ordering_fields = ["created_at", "total_amount"]


class OrderItemViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = OrderItem.objects.select_related("order", "product").all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["product__name"]


class PaymentViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Payment.objects.select_related("order").all()
    serializer_class = PaymentSerializer
    permission_classes = [IsSameBusiness]
    ordering_fields = ["amount", "created_at"]
