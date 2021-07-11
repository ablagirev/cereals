from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from main.views.mixins import UpdateViewSetMixin
from .. import models
from ..serializers import OrderSerializer


@extend_schema(tags=["order"])
class OrderViewSet(UpdateViewSetMixin, ModelViewSet):
    queryset = models.Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.action == "list":
            return super().get_queryset().filter(customer_id=self.request.user.id)
        return super().get_queryset()
