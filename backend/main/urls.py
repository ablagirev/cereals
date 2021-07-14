from django.urls import path, re_path, include
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import SimpleRouter

from main import views

router = SimpleRouter()
router.register("auth", views.AuthViewSet, basename="auth")
router.register("offer", views.OfferViewSet, basename="offer")
router.register("warehouse", views.WarehouseViewSet, basename="warehouse")
# router.register("product", views.ProductViewSet, basename="product")
router.register("company", views.CompanyViewSet, basename="company")
router.register("settings", views.SettingsViewSet, basename="settings")
router.register("orders", views.OrderViewSet, basename="orders")

urlpatterns = [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/", include(router.urls)),
    re_path(".*", TemplateView.as_view(template_name="index.html",), name="index",),
]
