from django.contrib.auth.decorators import login_required
from django.db import transaction
from catalog.models import Product
from sales.forms import OrderCreateForm
from store.decorators import store_member_required, store_permission_required
from django.shortcuts import redirect, render, get_object_or_404
from .models import Order, OrderItem
from django.contrib import messages
from core.utils import paginated_list_view
from django.db.models import Q
from django.core.paginator import Paginator

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
    qs = Product.objects.filter(store=store, active=True).order_by("created_at")

    q = request.GET.get("q", "")
    if q:
        qs = qs.filter(Q(name__icontains=q) | Q(sku__icontains=q))

    paginator = Paginator(qs, 3)
    page_obj = paginator.get_page(int(request.GET.get("page", 1)))
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
            product_ids = request.POST.getlist('product_id')
            quantities = request.POST.getlist('qty')

            if not product_ids:
                messages.error(request, "Please add at least one product.")
                return render(request, "orders/form.html", context)

            order = form.save(commit=False)
            order.store = store
            order.total_amount = 0
            order.save()

            total = 0
            for pid, qty_str in zip(product_ids, quantities):
                qty = int(qty_str)
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
            return redirect('sales:order_list', store.id)

    return render(request, "orders/form.html", context)

# Edit Order
@login_required
@store_member_required
@store_permission_required("manage_orders")
@transaction.atomic
def order_edit(request, store, team, order_id):
    order = get_object_or_404(Order, id=order_id, store=store)
    if order.status != 'draft':
        return redirect("sales:order_view", store.id, order.id)
    qs = Product.objects.filter(store=store, active=True).order_by("created_at")

    q = request.GET.get("q", "")
    if q:
        qs = qs.filter(Q(name__icontains=q) | Q(sku__icontains=q))

    paginator = Paginator(qs, 3)
    page_obj = paginator.get_page(int(request.GET.get("page", 1)))
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
            order.total_amount = 0
            order.save()

            existing_items = {item.product_id: item for item in order.items.all()}
            new_items = []
            total = 0

            for pid, qty_str in zip(product_ids, quantities):
                qty = int(qty_str)
                if qty <= 0:
                    continue

                product = get_object_or_404(Product, id=pid, store=store)
                subtotal = product.price * qty
                total += subtotal

                if int(pid) in existing_items:
                    item = existing_items[int(pid)]
                    item.qty = qty
                    item.subtotal = subtotal
                    item.price_at_sale = product.price
                    item.save(update_fields=["qty", "subtotal", "price_at_sale"])
                    existing_items.pop(int(pid))
                else:
                    new_items.append(
                        OrderItem(
                            order=order,
                            product=product,
                            product_name=product.name,
                            price_at_sale=product.price,
                            qty=qty,
                            subtotal=subtotal,
                        )
                    )

            # remove unchecked items
            for item in existing_items.values():
                item.delete()

            # add new items
            OrderItem.objects.bulk_create(new_items)

            order.total_amount = total
            order.save(update_fields=["total_amount"])

            return redirect("sales:order_list", store.id)

    return render(request, "orders/form.html", context)