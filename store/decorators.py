from django.shortcuts import get_object_or_404
from store.models import Store, Team

def store_member_required(view):
    def wrapper(request, store_id, *args, **kwargs):
        store = get_object_or_404(Store, id=store_id)
        team = get_object_or_404(Team, user=request.user, store=store)
        return view(request, store, team, *args, **kwargs)
    return wrapper