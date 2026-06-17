from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, AdminStatsView

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = router.urls + [
    path("admin/stats/", AdminStatsView.as_view()),
]