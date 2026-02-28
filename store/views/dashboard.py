from store.decorators import store_member_required
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from store.models import Team
from django.utils import timezone
from sales.models import Order, OrderItem
from store.views import store
from django.db.models import Sum, Count, F
from catalog.models import Product

@login_required
@store_member_required
def dashboard(request, store, team):
    today = timezone.localdate()
    month_start = today.replace(day=1)
    members = Team.objects.filter(store=store).select_related("user")
    orders = Order.objects.filter(store=store)
    today_orders = orders.filter(created_at__date=today)
    today_sales = (
        today_orders.aggregate(total=Sum("total_amount"))["total"] or 0
    )
    today_order_count = today_orders.count()
    avg_order_value = (
        today_sales / today_order_count if today_order_count else 0
    )
    monthly_sales = (
        orders.filter(created_at__date__gte=month_start)
        .aggregate(total=Sum("total_amount"))["total"] or 0
    )
    recent_orders = (
        orders.select_related("customer")
        .order_by("-created_at")[:5]
    )
    products = Product.objects.filter(store=store)
    stock_out_count = products.filter(stock_qty=0).count()
    top_products = (
        OrderItem.objects
        .filter(order__store=store)
        .values("product_name")
        .annotate(
            sold_qty=Sum("qty"),
            revenue=Sum("subtotal"),
        )
        .order_by("-sold_qty")[:5]
    )

    context = {
        "store": store,
        "team": team,
        "members": members,

        # cards
        "today_sales": today_sales,
        "today_order_count": today_order_count,
        "avg_order_value": avg_order_value,
        "monthly_sales": monthly_sales,
        "stock_out_count": stock_out_count,

        # tables
        "recent_orders": recent_orders,
        "top_products": top_products,
    }

    return render(request, "store/dashboard.html", context)