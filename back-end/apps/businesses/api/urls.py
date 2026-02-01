from rest_framework.routers import DefaultRouter
from .views import BusinessViewSet

router = DefaultRouter()
router.register("businesses", BusinessViewSet)

urlpatterns = router.urls
