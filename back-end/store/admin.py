from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Store, Team, Invitation

admin.site.register(Store)
admin.site.register(Team)
admin.site.register(Invitation)
