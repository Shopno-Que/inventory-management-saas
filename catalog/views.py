from django.http import HttpResponseForbidden
from django.shortcuts import render, get_object_or_404, redirect
from .models import Product
from .forms import ProductForm
from django.contrib.auth.decorators import login_required
from store.decorators import store_member_required, store_permission_required
import random
import string
from django.core.paginator import Paginator

# Product List
@login_required
@store_member_required
@store_permission_required("manage_products")
def product_list(request, store, team):
    products = Product.objects.filter(store=store).order_by("-created_at")
    paginator = Paginator(products, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "products/list.html", {"store": store, "page_obj": page_obj,})

@login_required
@store_member_required
@store_permission_required("manage_products")
def product_create_or_edit(request, store, team, product_id=None):
    # If product_id is provided, fetch it; else None for create
    product = None
    if product_id:
        product = get_object_or_404(Product, pk=product_id, store=store)

    if request.method == "POST":
        action = request.POST.get("action")

        if action == "save":
            form = ProductForm(request.POST, instance=product)
            if form.is_valid():
                product = form.save(commit=False)
                product.store = store

                # Ensure non-null fields at view level
                if not product.sku:
                    prefix = ''.join(e for e in product.name[:3].upper() if e.isalnum())
                    suffix = ''.join(random.choices(string.digits, k=4))
                    product.sku = f"{prefix}-{suffix}"
                if product.price is None:
                    product.price = 0
                if product.stock_qty is None:
                    product.stock_qty = 0

                product.save()
                return redirect("catalog:product_list", store_id=store.id)

        elif action == "delete" and product:
            if not team.has_perms("delete_products"):
                return HttpResponseForbidden("Permission denied.")
            product.delete()
            return redirect("catalog:product_list", store_id=store.id)

    else:
        # initial values for create
        initial = {}
        if not product:
            initial = {"price": 0, "stock_qty": 0}

        form = ProductForm(instance=product, initial=initial)

    return render(
        request,
        "products/form.html",
        {"form": form, "store": store, "product": product},
    )
