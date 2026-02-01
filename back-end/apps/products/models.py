from django.db import models
from core.models.base import BusinessBaseModel


class Category(BusinessBaseModel):
    name = models.CharField(max_length=255)

    class Meta:
        indexes = [models.Index(fields=["business", "name"])]

    def __str__(self):
        return self.name


class Supplier(BusinessBaseModel):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)

    def __str__(self):
        return self.name


class Product(BusinessBaseModel):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, db_index=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=["business", "sku"]),
        ]

    def __str__(self):
        return self.name
