from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.decorators import login_required
from .models import Customer
from django.db.models import Q, ProtectedError
from django.http import JsonResponse
from core.utils import paginated_list_view
from store.decorators import store_member_required, store_permission_required
from .forms import CustomerForm
from django.contrib import messages

# customers list with search
@login_required
@store_member_required
@store_permission_required("manage_customers")
def customer_list(request, store, team):
    qs = Customer.objects.filter(store=store).order_by('-created_at')
    return paginated_list_view(
        request,
        queryset=qs,
        search_field=["name", "phone"],
        partial_template_name="customer_table.html",
        template_name="customers/list.html",
        extra_context={"store": store},
    )

# create
@login_required
@store_member_required
@store_permission_required("manage_customers")
def customer_create(request, store, team):
    form = CustomerForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        customer = form.save(commit=False)
        customer.store = store
        customer.save()
        return redirect("customers:customer_list", store.id)
    return render(request, "customers/form.html", {"form": form, "store": store})

# edit
@login_required
@store_member_required
@store_permission_required("manage_customers")
def customer_edit(request, store, team, customer_id):
    customer = get_object_or_404(Customer, id=customer_id, store=store)
    form = CustomerForm(request.POST or None, instance=customer)
    if request.method == "POST" and form.is_valid():
        action = request.POST.get("action")
        if action == "delete":
            try:            
                customer.delete()
                return redirect("customers:customer_list", store.id)
            except ProtectedError:
                messages.error(request, "Cannot delete customer with existing orders.")
                return render(request, "customers/form.html", {"form": form, "store": store, "customer": customer,})
        customer = form.save(commit=False)
        customer.store = store
        customer.save()
        return redirect("customers:customer_list", store.id)
    return render(request, "customers/form.html", {"form": form, "store": store, "customer": customer})

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