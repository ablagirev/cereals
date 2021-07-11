from rest_framework import serializers
from .. import models


class RateForDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RateForDelivery
        fields = "__all__"


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouse
        fields = "__all__"
