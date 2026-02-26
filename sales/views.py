from django.contrib.auth.decorators import login_required
from django.db import transaction
from catalog.models import Product
from sales.forms import OrderForm
from store.decorators import store_member_required, store_permission_required
from django.shortcuts import redirect, render, get_object_or_404
from .models import Order, OrderItem
from django.contrib import messages
from core.utils import paginated_list_view

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
        template_name="orders/list.html",
        extra_context={"store": store},
    )

# Create Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
@transaction.atomic
def order_create(request, store, team):
    products = Product.objects.filter(store=store, active=True)

    form = OrderForm(request.POST or None)

    if request.method == "POST" and form.is_valid():

        product_ids = request.POST.getlist('product_id')
        quantities = request.POST.getlist('qty')

        # safety check
        if not product_ids:
            messages.error(request, "Please add at least one product.")
            return render(
                request,
                "orders/form.html",
                {"form": form, "store": store, "products": products}
            )

        order = form.save(commit=False)
        order.store = store
        order.status = "draft"
        order.total_amount = 0
        order.save()

        total = 0

        for pid, qty_str in zip(product_ids, quantities):
            try:
                qty = int(qty_str)
            except ValueError:
                continue

            if qty <= 0:
                continue

            product = get_object_or_404(Product, id=pid, store=store)

            subtotal = product.price * qty

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price_at_sale=product.price,
                qty=qty,
                subtotal=subtotal
            )

            total += subtotal

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        messages.success(request, f"Order #{order.id} created successfully.")
        return redirect('sales:order_list', store.id)

    return render(
        request,
        "orders/form.html",
        {
            "form": form,
            "store": store,
            "products": products,
        }
    )

# Edit Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
@transaction.atomic
def order_edit(request, store, team, order_id):
    order = get_object_or_404(Order, id=order_id, store=store)
    products = Product.objects.filter(store=store, active=True)

    form = OrderForm(request.POST or None, instance=order)

    if request.method == "POST" and form.is_valid():

        product_ids = request.POST.getlist('product_id')
        quantities = request.POST.getlist('qty')

        # safety check
        if not product_ids:
            messages.error(request, "Please add at least one product.")
            return render(
                request,
                "orders/form.html",
                {"form": form, "store": store, "products": products, "order": order}
            )

        order = form.save(commit=False)
        order.status = "draft"
        order.total_amount = 0
        order.save()

        # delete existing items
        order.items.all().delete()

        total = 0

        for pid, qty_str in zip(product_ids, quantities):
            try:
                qty = int(qty_str)
            except ValueError:
                continue

            if qty <= 0:
                continue

            product = get_object_or_404(Product, id=pid, store=store)

            subtotal = product.price * qty

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price_at_sale=product.price,
                qty=qty,
                subtotal=subtotal
            )

            total += subtotal

        order.total_amount = total
        order.save(update_fields=["total_amount"])

        messages.success(request, f"Order #{order.id} updated successfully.")
        return redirect('sales:order_list', store.id)

    return render(
        request,
        "orders/form.html",
        {
            "form": form,
            "store": store,
            "products": products,
            "order": order,
        }
    )
