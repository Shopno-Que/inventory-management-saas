from django.contrib.auth import get_user_model
from django.db import models
from django.conf import settings
import uuid
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

class Store(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class StorePermission(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    

class Team(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('staff', 'Staff'),
    ]

    permissions = models.ManyToManyField(
        StorePermission,
        blank=True,
        related_name="teams"
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='team_members')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    invited_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='invites_sent')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'store')  # avoid duplicates

    def __str__(self):
        return f"{self.user.email} - {self.store.name} ({self.role})"
    
    def has_perms(self, *codes):
        if self.role == "owner":
            return True
        return self.permissions.filter(code__in=codes).count() == len(codes)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.role == "owner":
            self.permissions.set(StorePermission.objects.all())


class Invitation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('expired', 'Expired'),
    ]

    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('staff', 'Staff'),
        ('saas_staff', 'SaaS Staff'),
    ]

    email = models.EmailField()
    store = models.ForeignKey(Store, null=True, blank=True, on_delete=models.CASCADE, related_name='invitations')
    invited_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_invitations')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    accepted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.email} invited as {self.role}"

    @property
    def effective_status(self):
        """Return current status taking expiry into account."""
        if self.status == "pending" and self.created_at < timezone.now() - timedelta(days=7):
            return "expired"
        return self.status