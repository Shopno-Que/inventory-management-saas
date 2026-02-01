from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderItemViewSet, PaymentViewSet

router = DefaultRouter()

router.register("orders", OrderViewSet)
router.register("order-items", OrderItemViewSet)
router.register("payments", PaymentViewSet)

urlpatterns = router.urls
