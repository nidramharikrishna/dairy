from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, WishlistViewSet, ReviewViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet, basename="products")
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("reviews", ReviewViewSet, basename="reviews")

urlpatterns = router.urls