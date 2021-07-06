from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from main import models
from main.serializer import (
    SettingsSerializer,
    BaseRateForDeliverySerializer,
    WarehouseSerializer,
    CoefficientOfDistanceSerializer,
    DetailOut,
)


@extend_schema(tags=["settings"])
class SettingsViewSet(GenericViewSet):
    serializer_class = SettingsSerializer
    permission_classes = [IsAuthenticated]

    def get_data(self, user):
        coefficients = models.CoefficientOfDistance.objects.all()
        base_rate = models.BaseRateForDelivery.objects.first()
        warehouses = models.Warehouse.objects.filter(owner=user)
        data = {
            "coefficients": coefficients,
            "base_rate": base_rate,
            "warehouses": warehouses,
        }
        return data

    @extend_schema(responses={200: SettingsSerializer, 403: DetailOut})
    @action(methods=["GET"], detail=False, url_path="")
    def get(self, request, *args, **kwargs):
        serializer = SettingsSerializer(self.get_data(request.user))

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(methods=["PATCH"], detail=False, url_path="")
    def patch(self, request, *args, **kwargs):
        base_rate = request.data.get("base_rate")
        if base_rate:
            obj_base_rate = models.BaseRateForDelivery.objects.get(
                id=base_rate.get("id")
            )
            serializer = BaseRateForDeliverySerializer(obj_base_rate, data=base_rate)
            if serializer.is_valid():
                serializer.save()

        coefficients = request.data.get("coefficients")
        if coefficients:
            for coefficient in coefficients:
                obj_coefficient = models.CoefficientOfDistance.objects.get(
                    id=coefficient.get("id")
                )
                serializer = CoefficientOfDistanceSerializer(
                    obj_coefficient, data=coefficient
                )
                if serializer.is_valid():
                    serializer.save()

        warehouses = request.data.get("warehouses")
        if warehouses:
            for warehouse in warehouses:
                obj_warehouses = models.Warehouse.objects.get(id=warehouse.get("id"))
                serializer = WarehouseSerializer(obj_warehouses, data=warehouse)
                if serializer.is_valid():
                    serializer.save()

        out_serializer = SettingsSerializer(self.get_data(request.user))
        return Response(data=out_serializer.data, status=status.HTTP_200_OK)
