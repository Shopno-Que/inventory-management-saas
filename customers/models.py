from django.db import models
from store.models import Store

class Customer(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="customers")

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        unique_together = ("store", "phone")

    def __str__(self):
        return self.name