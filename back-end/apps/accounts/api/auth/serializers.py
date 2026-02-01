from rest_framework import serializers
from apps.accounts.models import User, Role
from apps.businesses.models import Business
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.Serializer):
    # Register business + owner
    business_name = serializers.CharField()
    owner_email = serializers.EmailField()
    owner_full_name = serializers.CharField()
    password = serializers.CharField(write_only=True, validators=[validate_password])

    def create(self, validated_data):
        # create business
        business = Business.objects.create(name=validated_data["business_name"])
        role = Role.objects.get(name=Role.OWNER)
        # create owner user
        user = User.objects.create_user(
            email=validated_data["owner_email"],
            full_name=validated_data["owner_full_name"],
            password=validated_data["password"],
            business=business,
            role=role,
            is_staff=True,
        )
        return user
