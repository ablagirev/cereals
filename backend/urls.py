from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
# from rest_framework.schemas import get_schema_view
from rest_framework import schemas
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from backend.views import ProductListView, OfferListView, WarehouseListView, WarehouseUpdateDestroyView, \
    OfferUpdateDestroyView, AcceptOffer, CreateSign, UploadDoc, CreateSignView, CompanyListView, \
    CompanyUpdateDestroyView, LoginView, LogoutView, ProductUpdateDestroyView

schema_view = get_schema_view(
    openapi.Info(
        #  add your swagger doc title
        title="DM swagger",
        #  version of the swagger doc
        default_version='v1',
        # first line that appears on the top of the doc
        description="Test description",
    ),
    public=True,
)

urlpatterns = [
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='openapi-schema'),
    path('', TemplateView.as_view(
        template_name='swagger_ui.html',
        extra_context={'schema_url': 'openapi-schema'}),
        name='swagger-ui'),

    path('auth/login/', LoginView.as_view(), name='login_view'),
    path('auth/logout/', LogoutView.as_view(), name='logout_view'),


    # API Product
    path('product/', ProductListView.as_view(), name='product_view_set'),
    path('product/<int:pk>/', ProductUpdateDestroyView.as_view(), name='product_update_destroy_view'),


    # API Offer
    path('offer/', OfferListView.as_view(), name='offer_view_set'),
    path('offer/<int:pk>/', OfferUpdateDestroyView.as_view(),
         name='offer_update_destroy_view'),

    # API Warehouse
    path('warehouse/', WarehouseListView.as_view(), name='warehouse_view_set'),
    path('warehouse/<int:pk>/', WarehouseUpdateDestroyView.as_view(),
         name='warehouse_update_destroy_view'),

    # API Company
    path('company/', CompanyListView.as_view(), name='company_view_set'),
    path('company/<int:pk>/', CompanyUpdateDestroyView.as_view(), name='company_update_destroy_view'),

    # API AcceptOffer
    path('accept_offer/', AcceptOffer.as_view(), name='accept_offer_view'),

    # API CreateSign
    path('create_sign/', CreateSignView.as_view(), name='create_sign_view'),

    path('upload_doc/', UploadDoc.as_view(), name='upload_doc_view'),

]
