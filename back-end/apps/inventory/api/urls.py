from rest_framework.routers import DefaultRouter
from .views import StockViewSet, StockTransactionViewSet

router = DefaultRouter()

router.register("stocks", StockViewSet)
router.register("stock-transactions", StockTransactionViewSet)

urlpatterns = router.urls
