from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from .. import models
from .. import serializer


@extend_schema(tags=["company"])
class CompanyViewSet(ModelViewSet):
    queryset = models.Company.objects.all()
    serializer_class = serializer.CompanySerializer
