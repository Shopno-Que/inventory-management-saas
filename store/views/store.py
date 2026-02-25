from store.decorators import store_member_required
from store.forms import StoreCreateForm, StoreEditForm
from store.models import Team
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.db import transaction

@login_required
def create_store(request):
    form = StoreCreateForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        store = form.save(commit=False)
        store.created_by = request.user
        with transaction.atomic():
            store.save()
            Team.objects.create(
                user=request.user,
                store=store,
                role="owner"
            )

        return redirect("store:dashboard", store_id=store.id)
    
    context = {
        "form": form
    }

    return render(request, "store/create_store.html", context)

@login_required
@store_member_required
def dashboard(request, store, team):
    members = Team.objects.filter(store=store).select_related("user")
    return render(request, "store/dashboard.html", {"store": store, "members": members, "team": team})

@login_required
@store_member_required
def store_info_settings(request, store, team):
    if request.method == "POST":
        form = StoreEditForm(request.POST, instance=store)
        if form.is_valid():
            form.save()
    else:
        form = StoreEditForm(instance=store)
    
    return render(request, "store/store_info_settings.html", {"store": store, "team": team, "form": form})


@login_required
@store_member_required
def delete_store(request, store, team):
    if request.method == "POST":
        store.delete()
        return redirect("user:stores")
    
    return render(request, "store/confirm_delete_store.html", {"store": store})
