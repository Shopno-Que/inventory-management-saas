from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Store, Team, Invitation
from django.contrib.auth import get_user_model
import uuid
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.http import HttpResponse
from datetime import timedelta

User = get_user_model()

@login_required
def create_store(request):
    if request.method == "POST":
        name = request.POST.get("name")
        if name:
            store = Store.objects.create(name=name, created_by=request.user)
            Team.objects.create(user=request.user, store=store, role="owner")
            return redirect("user:profile")
    return render(request, "store/create_store.html")

@login_required
def store_detail(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    team = Team.objects.filter(user=request.user, store=store).first()
    if not team:
        return redirect("user:profile")  # user is not part of this store
    members = store.team_members.all()
    return render(request, "store/store_detail.html", {"store": store, "members": members, "team": team})

@login_required
def invite_staff(request, store_id):
    store = get_object_or_404(Store, id=store_id)

    team = Team.objects.filter(user=request.user, store=store).first()
    if not team or team.role not in ["owner"]:
        return HttpResponse(f"You do not have permission to send invite.")

    invite_link = None  # to show in template

    if request.method == "POST":
        email = request.POST.get("email")
        role = request.POST.get("role")  # 'staff' or 'owner'
        if email and role:
            # Create the invitation
            Invitation.objects.filter(
                email=email,
                store=store,
                status="pending"
            ).delete()

            invite = Invitation.objects.create(
                email=email,
                store=store,
                invited_by=request.user,
                role=role,
                token=uuid.uuid4()
            )

            invite_link = request.build_absolute_uri(
                reverse("store:accept_invite", kwargs={"token": invite.token})
            )

            send_mail(
                subject=f"You are invited to join {store.name}",
                message=f"Click this link to accept the invite: {invite_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            return HttpResponse(f"Invitation link sent to {email}")

    return render(request, "store/invite_staff.html", {"store": store})

@login_required
def accept_invite(request, token):
    invite = get_object_or_404(Invitation, token=token, status='pending')

    if not request.user.email == invite.email:
        return HttpResponse("This invitation is not for your account.")

    if invite.created_at < timezone.now() - timedelta(days=7):
        invite.status = "expired"
        invite.save()
        return render(request, "store/invite_invalid.html")

    return render(request, "store/accept_invite_page.html", {"invite": invite})

@login_required
def confirm_invite(request, token):
    invite = get_object_or_404(Invitation, token=token, status='pending')
    
    if not request.user.email == invite.email:
        return HttpResponse("This invitation is not for your account.")

    # Add the logged-in user to the team
    Team.objects.get_or_create(user=request.user, store=invite.store, role=invite.role)

    # Mark invite as accepted
    invite.status = 'accepted'
    invite.accepted_at = timezone.now()
    invite.save()

    return redirect('store:store_detail', store_id=invite.store.id)
