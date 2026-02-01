from rest_framework.viewsets import ModelViewSet
from apps.businesses.models import Business
from .serializers import BusinessSerializer
from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness


class BusinessViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["name"]
