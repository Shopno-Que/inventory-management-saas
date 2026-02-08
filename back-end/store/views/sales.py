from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from store.models import Store

@login_required
def sales(request, store_id):
    store = get_object_or_404(Store, id=store_id)
    return render(request, "store/sales.html", {"store": store,})
