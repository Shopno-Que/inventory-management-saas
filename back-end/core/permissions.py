from rest_framework.permissions import BasePermission
from apps.accounts.models import Role

class IsSameBusiness(BasePermission):
    """
    Extra safety check for object-level access.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return obj.business == request.user.business

class IsOwner(BasePermission):
    """
    Allows access only to Owner role.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.name == Role.OWNER


class IsManagerOrOwner(BasePermission):
    """
    Allows access to Manager or Owner roles.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.name in [Role.OWNER, Role.MANAGER]


class IsStaffOrHigher(BasePermission):
    """
    Allows access to Staff, Manager, Owner.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role.name in [Role.OWNER, Role.MANAGER, Role.STAFF]
