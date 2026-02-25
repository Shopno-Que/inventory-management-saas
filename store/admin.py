from django.contrib import admin
from .models import Store, Team, Invitation, StorePermission

admin.site.register(Store)
@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("user", "store", "role")
    filter_horizontal = ("permissions",)

admin.site.register(Invitation)
admin.site.register(StorePermission)
