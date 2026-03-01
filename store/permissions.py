from .models import StorePermission
DEFAULT_STORE_PERMISSIONS = [
    {"code": "manage_staff", "name": "Manage staff"},
    {"code": "delete_store", "name": "Delete store"},
    {"code": "store_settings", "name": "Manage store settings"},
    {"code": "delete_products", "name": "Delete products"},
    {"code": "manage_products", "name": "Manage products"},
    {"code": "manage_orders", "name": "Manage orders"},
    {"code": "manage_customers", "name": "Manage customers"},
    {"code": "manage_expenses", "name": "Manage expenses"},
]

def ensure_permissions():
    for perm in DEFAULT_STORE_PERMISSIONS:
        StorePermission.objects.get_or_create(
            code=perm["code"],
            defaults={"name": perm["name"]}
        )
        