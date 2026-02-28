from django.shortcuts import render
from store.decorators import store_member_required
from django.contrib.auth.decorators import login_required
from .models import Customer
from django.db.models import Q
from django.http import JsonResponse

# customers list with search
# create
# edit
# search customer
@login_required
@store_member_required
def customer_search(request, store, team):
    if not team.has_perms("manage_orders"):
        return JsonResponse({"error": "Permission denied"}, status=403)
    q = request.GET.get("q", "")
    qs = Customer.objects.filter(store=store)
    if q:
        qs = qs.filter(Q(name__icontains=q) | Q(phone__icontains=q))
    qs = qs[:10]
    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
      data = [
          {
              "id": c.id,
              "name": c.name,
              "phone": c.phone,
          }
          for c in qs
      ]
      return JsonResponse(data, safe=False)
    return JsonResponse({"error": "Invalid request"}, status=400)