from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.http import HttpResponse

from .. import models
from .. import serializers
from ..utils import load_data_for_spec


@extend_schema(tags=["product"])
class ProductViewSet(ReadOnlyModelViewSet):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductSerializer
    permission_classes = (IsAuthenticated,)


def load_spec_view(request):
    load_data_for_spec()
    return HttpResponse('loaded')
