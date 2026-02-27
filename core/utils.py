from django.core.paginator import Paginator
from django.shortcuts import render
from django.db.models import Q

def paginated_list_view(request, queryset, template_name, partial_template_name, extra_context=None, search_field=None):
    query = request.GET.get("q", "")
    
    if search_field and query:
        q_filter = Q()
        for field in search_field:
            q_filter |= Q(**{f"{field}__icontains": query})
        queryset = queryset.filter(q_filter)

    queryset = queryset.order_by("-created_at")
    paginator = Paginator(queryset, 10)
    page_obj = paginator.get_page(request.GET.get("page"))

    context = {"page_obj": page_obj}
    if extra_context:
        context.update(extra_context)

    if request.headers.get("X-Requested-With") == "XMLHttpRequest":
        return render(request, f"partials/{partial_template_name}", context)

    return render(request, template_name, context)