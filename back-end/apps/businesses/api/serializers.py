from rest_framework import serializers
from apps.businesses.models import Business


class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]
