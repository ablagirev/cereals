from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from main.views.mixins import UpdateViewSetMixin
from .. import models
from ..serializer import OrderSerializer, DetailOut


@extend_schema(tags=["order"])
class OrderViewSet(UpdateViewSetMixin, ModelViewSet):
    queryset = models.Order.objects.all()
    serializer_class = OrderSerializer
