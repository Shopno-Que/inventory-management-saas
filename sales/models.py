from django.db import models
from catalog.models import Product
from store.models import Store
from customers.models import Customer

class Order(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]

    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    customer = models.ForeignKey(
        Customer,
        on_delete=models.SET_NULL,
        related_name="orders",
        null=True,
        blank=True
    )
    customer_name = models.CharField(max_length=255, blank=True)
    customer_phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    product_name = models.CharField(max_length=255)  # snapshot of product name
    price_at_sale = models.DecimalField(max_digits=10, decimal_places=2)  # snapshot of price
    qty = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        # auto-calculate subtotal if not set
        if not self.subtotal:
            self.subtotal = self.price_at_sale * self.qty
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product_name} x {self.qty}"