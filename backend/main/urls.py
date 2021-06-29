from django.urls import path, re_path
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from main.views import (
    ProductListView,
    OfferListView,
    WarehouseListView,
    WarehouseUpdateDestroyView,
    OfferUpdateDestroyView,
    AcceptOffer,
    UploadDoc,
    CreateSignView,
    CompanyListView,
    CompanyUpdateDestroyView,
    LoginView,
    LogoutView,
    ProductUpdateDestroyView,
    SpecificationsOfProductUpdateDestroyView,
    SpecificationsOfProductListView,
    ProductSpecificationsListView,
)

urlpatterns = [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("auth/login/", LoginView.as_view(), name="login_view"),
    path("auth/logout/", LogoutView.as_view(), name="logout_view"),
    # API Product
    path("product/", ProductListView.as_view(), name="product_view_set"),
    path(
        "product/<int:pk>/",
        ProductUpdateDestroyView.as_view(),
        name="product_update_destroy_view",
    ),
    path(
        "product/<int:pk>/specifications",
        ProductSpecificationsListView.as_view(),
        name="product_specifications_list_view",
    ),
    # API Offer
    path("offer/", OfferListView.as_view(), name="offer_view_set"),
    path(
        "offer/<int:pk>/",
        OfferUpdateDestroyView.as_view(),
        name="offer_update_destroy_view",
    ),
    # API Warehouse
    path("warehouse/", WarehouseListView.as_view(), name="warehouse_view_set"),
    path(
        "warehouse/<int:pk>/",
        WarehouseUpdateDestroyView.as_view(),
        name="warehouse_update_destroy_view",
    ),
    # API Company
    path("company/", CompanyListView.as_view(), name="company_view_set"),
    path(
        "company/<int:pk>/",
        CompanyUpdateDestroyView.as_view(),
        name="company_update_destroy_view",
    ),
    # API Specifications Of Product
    path(
        "specifications_of_product/",
        SpecificationsOfProductListView.as_view(),
        name="specifications_of_product_view_set",
    ),
    path(
        "specifications_of_product/<int:pk>/",
        SpecificationsOfProductUpdateDestroyView.as_view(),
        name="specifications_of_product_update_destroy_view",
    ),
    # API AcceptOffer
    path("accept_offer/", AcceptOffer.as_view(), name="accept_offer_view"),
    # API CreateSign
    path("create_sign/", CreateSignView.as_view(), name="create_sign_view"),
    path("upload_doc/", UploadDoc.as_view(), name="upload_doc_view"),
    re_path(".*", TemplateView.as_view(template_name="index.html",), name="index",),
]
