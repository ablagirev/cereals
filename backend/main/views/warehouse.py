from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ReadOnlyModelViewSet

from .. import models
from .. import serializers


@extend_schema(tags=["warehouse"])
class WarehouseViewSet(ReadOnlyModelViewSet):
    queryset = models.Warehouse.objects.all()
    serializer_class = serializers.WarehouseSerializer
