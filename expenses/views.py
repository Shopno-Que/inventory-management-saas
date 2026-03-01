from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Sum
from django.utils import timezone
from core.utils import paginated_list_view
from .models import Expense
from django.contrib.auth.decorators import login_required
from store.decorators import store_member_required, store_permission_required
from .forms import ExpenseForm
@login_required
@store_member_required
@store_permission_required("manage_expenses")
def expense_list(request, store, team):
    qs = Expense.objects.filter(store=store).order_by('-created_at')
    return paginated_list_view(
        request,
        queryset=qs,
        search_field=["amount"],
        partial_template_name="expenses_table.html",
        template_name="expenses/list.html",
        extra_context={"store": store},
    )


@login_required
@store_member_required
@store_permission_required("manage_expenses")
def expense_create(request, store, team):
    form = ExpenseForm(request.POST or None)
    context = {
        "store": store,
        "form": form,
    }
    if request.method == "POST" and form.is_valid():
        expense = form.save(commit=False)
        expense.store = store
        expense.save()
        return redirect("expenses:expense_list", store.id,)

    return render(request, "expenses/form.html", context)

@login_required
@store_member_required
@store_permission_required("manage_expenses")
def expense_update(request, store, team, expense_id):
    expense = get_object_or_404(Expense, pk=expense_id, store=store)
    form = ExpenseForm(request.POST or None, instance=expense)
    context = {
        "store": store,
        "form": form,
        "expense": expense,
    }
    if request.method == "POST":
        if request.POST.get("action") == "delete":
            expense.delete()
            return redirect("expenses:expense_list", store.id,)
        if form.is_valid():
            form.save()

        return redirect("expenses:expense_list", store.id,)

    return render(request, "expenses/form.html", context)
