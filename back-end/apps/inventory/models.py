from django.db import models
from core.models.base import BusinessBaseModel


class Stock(BusinessBaseModel):
    product = models.OneToOneField("products.Product", on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"


class StockTransaction(BusinessBaseModel):
    IN = "IN"
    OUT = "OUT"

    TYPE_CHOICES = [
        (IN, "Stock In"),
        (OUT, "Stock Out"),
    ]

    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    type = models.CharField(max_length=3, choices=TYPE_CHOICES)
    quantity = models.IntegerField()
    note = models.TextField(blank=True)
