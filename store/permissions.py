from .models import StorePermission
DEFAULT_STORE_PERMISSIONS = [
    {"code": "manage_staff", "name": "Manage staff"},
    {"code": "delete_store", "name": "Delete store"},
    {"code": "store_settings", "name": "Manage store settings"},
]

def ensure_permissions():
    for perm in DEFAULT_STORE_PERMISSIONS:
        StorePermission.objects.get_or_create(
            code=perm["code"],
            defaults={"name": perm["name"]}
        )
        