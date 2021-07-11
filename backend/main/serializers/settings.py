from rest_framework import serializers
from . import warehouse


class SettingsSerializer(serializers.Serializer):
    base_rate = warehouse.RateForDeliverySerializer()
    warehouses = warehouse.WarehouseSerializer(many=True)
