from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from .. import models
from .. import serializers


@extend_schema(tags=["company"])
class CompanyViewSet(ModelViewSet):
    queryset = models.Company.objects.all()
    serializer_class = serializers.CompanySerializer
