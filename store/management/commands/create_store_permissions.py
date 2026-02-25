from django.core.management.base import BaseCommand
from store.permissions import ensure_permissions

class Command(BaseCommand):
    def handle(self, *args, **options):
        ensure_permissions()
        self.stdout.write(self.style.SUCCESS('Permissions ensured in DB.'))
        