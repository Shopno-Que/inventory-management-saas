from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import CustomUserCreationForm as UserCreationForm
from django.contrib.auth import login

@login_required
def profile(request):
    teams = request.user.teams.select_related('store')
    return render(request, "user/profile.html", {"teams": teams})

def logged_out_only(user):
    return not user.is_authenticated

@user_passes_test(logged_out_only, login_url="user:profile")
def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.email
            user.save()
            login(request, user)
            return redirect("user:profile")
    else:
        form = UserCreationForm()

    return render(request, "user/signup.html", {"form": form})
