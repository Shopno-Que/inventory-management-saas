from rest_framework.routers import DefaultRouter
from .views import ExpenseViewSet, FinancialTransactionViewSet

router = DefaultRouter()

router.register("expenses", ExpenseViewSet)
router.register("transactions", FinancialTransactionViewSet)

urlpatterns = router.urls
