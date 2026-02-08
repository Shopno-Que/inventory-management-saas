from django.http import HttpResponse
from store.forms import StoreCreateForm, StoreEditForm
from store.models import Store, Team
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
# from django.contrib.auth import get_user_model
# User = get_user_model()

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
