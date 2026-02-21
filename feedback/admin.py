from django.contrib import admin
from django.utils.html import format_html
from .models import Feedback, FeedbackImage


class FeedbackImageInline(admin.TabularInline):
    model = FeedbackImage
    extra = 0
    can_delete = True
    readonly_fields = ("preview", "image")

    def preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height:120px;" />',
                obj.image.url
            )
        return "-"
    preview.short_description = "Preview"

    def has_add_permission(self, request, obj=None):
        return False


class FeedbackAdmin(admin.ModelAdmin):
    inlines = [FeedbackImageInline]

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


admin.site.register(Feedback, FeedbackAdmin)