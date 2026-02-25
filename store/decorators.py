from django.shortcuts import get_object_or_404
from store.models import Store, Team
from django.http import HttpResponseForbidden

def store_member_required(view):
    def wrapper(request, store_id, *args, **kwargs):
        store = get_object_or_404(Store, id=store_id)
        team = get_object_or_404(Team, user=request.user, store=store)
        return view(request, store, team, *args, **kwargs)
    return wrapper

def store_permission_required(code):
    def decorator(view_func):
        def _wrapped(request, store, team, *args, **kwargs):
            if not team.has_perms(code):
                return HttpResponseForbidden("Permission denied.")
            return view_func(request, store, team, *args, **kwargs)
        return _wrapped
    return decorator
