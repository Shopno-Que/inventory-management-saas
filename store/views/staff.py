from django.views.decorators.http import require_POST
import uuid
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from store.decorators import store_member_required
from store.models import Team, Invitation
from store.forms import InviteStaffForm, EditStaffForm

@login_required
@store_member_required
def store_staff(request, store, team):
    members = store.team_members.select_related("user").all()
    pending_invites = [inv for inv in store.invitations.filter(status="pending") if inv.effective_status == "pending"]
    context = {
        "store": store, 
        "pending_invites": pending_invites, 
        "members": members,
        "team": team,
    }
    return render(request, "store/store_staff.html", context)

@login_required
@store_member_required
@require_POST
def cancel_staff_invite(request, store, team, invite_id):
    invite = get_object_or_404(Invitation, id=invite_id, store=store, status="pending")
    invite.delete()
    return redirect("store:store_staff", store_id=store.id)

@login_required
@store_member_required
def staff_details(request, store, team, staff_id):
    staff = get_object_or_404(Team, id=staff_id, store=store)

    if request.method == "POST":
        if staff.user == request.user:
            return HttpResponseForbidden("You cannot edit your own permissions.")

        form = EditStaffForm(request.POST)
        if form.is_valid():
            staff.role = form.cleaned_data["role"]
            staff.save()
    else:
        form = EditStaffForm(initial={"role": staff.role})

    return render(request, "store/staff_details.html", {
        "store": store,
        "staff": staff,
        "form": form,
    })

@login_required
@store_member_required
def invite_staff(request, store, team):    
    if request.method == "POST":
        form = InviteStaffForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            if Team.objects.filter(user__email=email, store=store).exists():
                return HttpResponseBadRequest("This user is already a member of the store.")

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
            return redirect("store:store_staff", store_id=store.id)
    else:
        form = InviteStaffForm()

    return render(request, "store/invite_staff.html", {"store": store, "form": form,})

@login_required
def accept_invite(request, token):
    invite = get_object_or_404(Invitation, token=token, status='pending')

    if not request.user.email == invite.email:
        return HttpResponseForbidden("This invitation is not for your account.")
    
    if request.method == "POST":
        Team.objects.get_or_create(user=request.user, store=invite.store, role=invite.role)
        invite.status = 'accepted'
        invite.accepted_at = timezone.now()
        invite.save()
        return redirect('store:dashboard', store_id=invite.store.id)
    
    return render(request, "store/accept_invite_page.html", {"invite": invite})

@login_required
@store_member_required
def remove_staff(request, store, team, staff_id):
    member = get_object_or_404(Team, id=staff_id, store=store)

    # safety: owner cannot remove himself
    if member.user == request.user:
        return HttpResponseForbidden("You cannot remove yourself from the team.")

    if request.method == "POST":
        member.delete()

    return redirect("store:store_staff", store_id=store.id)
