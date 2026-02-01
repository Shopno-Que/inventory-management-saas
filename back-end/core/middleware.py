class BusinessMiddleware:
    """
    Attach user's business to every request.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            request.business = user.business
        else:
            request.business = None
        response = self.get_response(request)
        return response
