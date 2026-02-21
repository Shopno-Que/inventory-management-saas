from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import EditUserProfileForm, CustomUserCreationForm
from django.contrib.auth import login

@login_required
def settings(request):
    teams = request.user.teams.select_related('store')
    own_stores_count = teams.filter(role='owner').count() or 0
    staff_stores_count = teams.exclude(role='owner').count() or 0
    context = {
        'own_stores_count': own_stores_count,
        'staff_stores_count': staff_stores_count,
    }
    user = request.user
    if request.method == 'POST':
        form = EditUserProfileForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect("user:settings")
    else:
        form = EditUserProfileForm(instance=user)
                                   
    context['form'] = form
    return render(request, "user/settings.html", context)

PALETTES = [
    ("from-amber-400 to-orange-500", "text-amber-500"),
    ("from-indigo-400 to-purple-500", "text-indigo-500"),
    ("from-green-400 to-teal-500", "text-green-500"),
    ("from-pink-400 to-rose-500", "text-pink-500"),
    ("from-yellow-400 to-lime-500", "text-yellow-500"),
    ("from-purple-400 to-indigo-500", "text-purple-500"),
    ("from-red-400 to-rose-500", "text-red-500"),
    ("from-cyan-400 to-sky-500", "text-cyan-500"),
    ("from-fuchsia-400 to-purple-500", "text-fuchsia-500"),
    ("from-emerald-400 to-green-500", "text-emerald-500"),
    ("from-pink-500 to-rose-600", "text-pink-600"),
    ("from-indigo-500 to-purple-600", "text-indigo-600"),
    ("from-orange-400 to-amber-500", "text-orange-500"),
    ("from-teal-400 to-cyan-500", "text-teal-500"),
    ("from-lime-400 to-green-500", "text-lime-500"),
    ("from-violet-400 to-purple-500", "text-violet-500"),
    ("from-rose-400 to-red-500", "text-rose-500"),
    ("from-sky-400 to-indigo-500", "text-sky-500"),
    ("from-emerald-500 to-teal-600", "text-emerald-600"),
    ("from-fuchsia-500 to-pink-600", "text-fuchsia-600"),
]

@login_required
def stores(request):
    teams = request.user.teams.select_related('store')
    own_stores_count = teams.filter(role='owner').count() or 0
    staff_stores_count = teams.exclude(role='owner').count() or 0

    # assign color palettes
    for i, team in enumerate(teams):
        bg_class, text_class = PALETTES[i % len(PALETTES)]
        team.bg_class = bg_class
        team.text_class = text_class

    context = {
        'own_stores_count': own_stores_count,
        'staff_stores_count': staff_stores_count,
        'teams': teams,
    }
    return render(request, "user/stores.html", context)

def logged_out_only(user):
    return not user.is_authenticated

@user_passes_test(logged_out_only, login_url="user:stores")
def signup(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.email
            user.save()
            login(request, user)
            return redirect("user:stores")
    else:
        form = CustomUserCreationForm()

    return render(request, "user/signup.html", {"form": form})
