from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .. import models
from .. import serializer


@extend_schema(tags=["product"])
class ProductViewSet(ModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializer.ProductSerializer
    permission_classes = (IsAuthenticated,)
