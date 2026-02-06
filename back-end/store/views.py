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
from .forms import StoreCreateForm, InviteStaffForm, StoreEditForm

User = get_user_model()

@login_required
def create_store(request):
    form = StoreCreateForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        store = form.save(commit=False)
        store.created_by = request.user
        store.save()

        Team.objects.create(
            user=request.user,
            store=store,
            role="owner"
        )

        return redirect("user:stores")
    
    context = {
        "form": form
    }

    return render(request, "store/create_store.html", context)

@login_required
def dashboard(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    team = Team.objects.filter(user=request.user, store=store).first()
    if not team:
        return redirect("user:stores")  # user is not part of this store
    members = store.team_members.all()
    return render(request, "store/dashboard.html", {"store": store, "members": members, "team": team})


@login_required
def products(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    return render(request, "store/products.html", {"store": store,})


@login_required
def customers(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    return render(request, "store/customers.html", {"store": store,})


@login_required
def sales(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    return render(request, "store/sales.html", {"store": store,})


@login_required
def expenses(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    return render(request, "store/expenses.html", {"store": store,})

@login_required
def store_info_settings(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    team = Team.objects.filter(user=request.user, store=store).first()
    if not team:
        return redirect("user:stores")
    
    if request.method == "POST":
        form = StoreEditForm(request.POST, instance=store)
        if form.is_valid():
            form.save()
    else:
        form = StoreEditForm(instance=store)
    
    return render(request, "store/store_info_settings.html", {"store": store, "team": team, "form": form})


# 3️⃣ View for deleting the store
@login_required
def delete_store(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    
    # Only owner can delete
    team = Team.objects.filter(user=request.user, store=store, role="owner").first()
    if not team:
        return HttpResponse("You do not have permission to delete this store.")

    if request.method == "POST":
        store.delete()
        return redirect("user:stores")
    
    # GET request → confirm deletion page
    return render(request, "store/confirm_delete_store.html", {"store": store})

@login_required
def store_staff(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    team = Team.objects.filter(user=request.user, store=store).first()
    if not team:
        return redirect("user:stores")
    members = store.team_members.all()
    context = {
        "store": store, 
        "members": members
    }
    return render(request, "store/store_staff.html", context)

@login_required
def staff_details(request, store_id, staff_id):
    store = get_object_or_404(Store, id=store_id)
    team = Team.objects.filter(user=request.user, store=store).first()
    if not team:
        return redirect("user:stores")
    members = store.team_members.all()
    staff = get_object_or_404(Team, id=staff_id, store=store)
    context = {
        "store": store, 
        "members": members,
        "staff": staff
    }
    return render(request, "store/staff_details.html", context)

@login_required
def invite_staff(request, store_id):
    store = get_object_or_404(Store, id=store_id)

    team = Team.objects.filter(user=request.user, store=store).first()
    if not team or team.role != "owner":
        return HttpResponse("You do not have permission to send invite.")
    
    invite_link = None  # to show in template

    if request.method == "POST":
        form = InviteStaffForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            role = form.cleaned_data["role"]

            # Remove existing pending invites
            Invitation.objects.filter(email=email, store=store, status="pending").delete()

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
    else:
        form = InviteStaffForm()

    return render(request, "store/invite_staff.html", {"store": store, "form": form,})

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

    return redirect('store:dashboard', store_id=invite.store.id)
