from django.contrib.auth.decorators import login_required
from django.db import transaction
from catalog.models import Product
from sales.forms import OrderCreateForm
from store.decorators import store_member_required, store_permission_required
from django.shortcuts import redirect, render, get_object_or_404
from .models import Order
from django.contrib import messages
from core.utils import paginated_list_view
from .utils import handle_order_customer, save_order_items, get_products_for_order

# List Orders
@login_required
@store_member_required
@store_permission_required("manage_orders")
def order_list(request, store, team):
    qs = Order.objects.filter(store=store).order_by('-created_at')
    return paginated_list_view(
        request,
        queryset=qs,
        search_field=["total_amount", "id"],
        partial_template_name="order_table.html",
        template_name="orders/list.html",
        extra_context={"store": store},
    )

# View a Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
def order_view(request, store, team, order_id):
    order = get_object_or_404(Order, id=order_id, store=store)
    if order.status == 'draft':
        return redirect("sales:order_edit", store.id, order.id)
    return render(request, "orders/detail.html", {"order": order, "store": store})

# Create Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
def order_create(request, store, team):
    q = request.GET.get("q", "")
    page_number = request.GET.get("page", 1)
    page_obj = get_products_for_order(store, query=q, page=page_number)

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return render(request, f"partials/order_item_list.html", {"page_obj": page_obj,"q": q,})

    form = OrderCreateForm(request.POST or None)
    context = {
        "page_obj": page_obj,
        "store": store,
        "q": q,
        "form": form,
    }

    if request.method == "POST" and form.is_valid():
        with transaction.atomic():
            product_ids = request.POST.getlist("product_id")
            quantities = request.POST.getlist("qty")

            if not product_ids:
                messages.error(request, "Please add at least one product.")
                return render(request, "orders/form.html", context)

            order = form.save(commit=False)
            order.store = store

            # handle customer
            name = (request.POST.get("customer_name") or "").strip()
            phone = (request.POST.get("customer_phone") or "").strip()
            handle_order_customer(order, store, name, phone)

            order.save()

            total = save_order_items(order, product_ids, quantities, store)
            order.total_amount = total
            order.save(update_fields=["total_amount"])

            return redirect("sales:order_list", store.id)

    return render(request, "orders/form.html", context)

# Edit Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
def order_edit(request, store, team, order_id):
    order = get_object_or_404(Order, id=order_id, store=store)
    if order.status != 'draft':
        return redirect("sales:order_view", store.id, order.id)
    
    q = request.GET.get("q", "")
    page_number = request.GET.get("page", 1)
    page_obj = get_products_for_order(store, query=q, page=page_number)
    selected_product_ids = list(order.items.values_list('product_id', flat=True))

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return render(
            request,
            "partials/order_item_list.html",
            {"page_obj": page_obj, "q": q, "order": order, "selected_product_ids": selected_product_ids,},
        )

    form = OrderCreateForm(request.POST or None, instance=order)
        
    context = {
        "page_obj": page_obj,
        "store": store,
        "q": q,
        "form": form,
        "order": order,
        "selected_product_ids": selected_product_ids,
    }

    if request.method == "POST" and form.is_valid():
        with transaction.atomic():
            action = request.POST.get("action")
            if action == "delete":
                order.delete()
                return redirect("sales:order_list", store.id)

            product_ids = request.POST.getlist("product_id")
            quantities = request.POST.getlist("qty")

            if not product_ids:
                messages.error(request, "Please add at least one product.")
                return render(request, "orders/form.html", context)

            order = form.save(commit=False)
            order.store = store

            # customer
            name = (request.POST.get("customer_name") or "").strip()
            phone = (request.POST.get("customer_phone") or "").strip()
            handle_order_customer(order, store, name, phone)

            order.save()

            total = save_order_items(order, product_ids, quantities, store)
            order.total_amount = total
            order.save(update_fields=["total_amount"])

            return redirect("sales:order_list", store.id)

    return render(request, "orders/form.html", context)