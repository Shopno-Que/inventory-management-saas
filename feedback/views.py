from django.http import JsonResponse
from .models import Feedback, FeedbackImage


def feedback_post(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user = request.user

    if user.is_authenticated:
        name = user.name or "Anonymous"
        email = user.email or ""
    else:
        name = "Anonymous"
        email = ""

    feedback = Feedback.objects.create(
        name=name,
        email=email,
        message=request.POST.get("message", "")
    )

    # save multiple images
    for img in request.FILES.getlist("images"):
        FeedbackImage.objects.create(
            feedback=feedback,
            image=img
        )

    return JsonResponse({
        "status": "success",
        "id": feedback.id
    })
