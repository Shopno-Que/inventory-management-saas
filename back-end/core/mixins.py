class BusinessQuerysetMixin:
    """
    Automatically filters queryset by logged-in user's business.
    """

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if user.is_superuser:
            return qs

        return qs.filter(business=user.business)

    def perform_create(self, serializer):
        serializer.save(business=self.request.user.business)
