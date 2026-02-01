from rest_framework import serializers
from apps.inventory.models import Stock, StockTransaction


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"
        read_only_fields = ("id", "business", "created_at", "updated_at")


class StockTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockTransaction
        fields = "__all__"
        read_only_fields = ("id", "business", "created_at", "updated_at")
