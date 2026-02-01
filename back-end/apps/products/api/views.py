from rest_framework.viewsets import ModelViewSet

from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness

from apps.products.models import Category, Product, Supplier
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    SupplierSerializer
)


class CategoryViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["name"]


class SupplierViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["name", "email"]


class ProductViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Product.objects.select_related("category", "supplier")
    serializer_class = ProductSerializer
    permission_classes = [IsSameBusiness]

    search_fields = ["name", "sku"]
    filterset_fields = ["category", "supplier"]
    ordering_fields = ["price", "created_at"]
