from rest_framework.viewsets import ModelViewSet
from apps.accounts.models import User, Role
from .serializers import UserSerializer, RoleSerializer
from core.mixins import BusinessQuerysetMixin
from core.permissions import IsSameBusiness


class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsSameBusiness]
    http_method_names = ["get", "post", "put", "patch", "delete"]


class UserViewSet(BusinessQuerysetMixin, ModelViewSet):
    queryset = User.objects.select_related("role").all()
    serializer_class = UserSerializer
    permission_classes = [IsSameBusiness]
    search_fields = ["email", "full_name"]
    ordering_fields = ["created_at"]
