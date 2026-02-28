from customers.models import Customer
from django.shortcuts import get_object_or_404
from catalog.models import Product
from .models import OrderItem
from django.core.paginator import Paginator
from django.db.models import Q

def handle_order_customer(order, store, name, phone):
    customer = None

    if phone and order.status == 'paid':
        customer = Customer.objects.filter(store=store, phone=phone).first()
        if not customer:
            customer = Customer.objects.create(
                store=store,
                name=name if name else "Unknown",
                phone=phone
            )

    if customer:
        order.customer = customer
        order.customer_name = customer.name
        order.customer_phone = customer.phone
    elif phone and name:
        order.customer_phone = phone
        order.customer_name = name
    elif name:
        order.customer_name = name
    elif phone:
        order.customer_phone = phone
    

def save_order_items(order, product_ids, quantities, store):
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
    if new_items:
        OrderItem.objects.bulk_create(new_items)

    return total

def get_products_for_order(store, query="", page=1, per_page=3):
    qs = Product.objects.filter(store=store, active=True).order_by("created_at")

    if query:
        qs = qs.filter(Q(name__icontains=query) | Q(sku__icontains=query))

    paginator = Paginator(qs, per_page)
    page_obj = paginator.get_page(page)

    return page_obj