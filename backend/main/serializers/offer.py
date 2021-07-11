from rest_framework import serializers
from . import product
from . import warehouse
from .. import models


class DeliveryPrice(serializers.Serializer):
    price = serializers.IntegerField()
    price_per_tonne = serializers.IntegerField()
    warehouse = warehouse.WarehouseSerializer()


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Offer
        fields = "__all__"

    cost_with_nds = serializers.IntegerField(read_only=True, source="cost_with_NDS")
    period_of_export = serializers.IntegerField(read_only=True)
    product = product.ProductSerializer(allow_null=True)
    warehouse = warehouse.WarehouseSerializer(allow_null=True)
    days_till_end = serializers.IntegerField()


class DetailOfferSerializer(OfferSerializer):
    prices = DeliveryPrice(many=True)


class GroupOfferItem(serializers.ModelSerializer):
    days_till_end = serializers.IntegerField()
    cost_with_nds = serializers.IntegerField(source="cost_with_NDS")

    class Meta:
        model = models.Offer
        fields = (
            "volume",
            "days_till_end",
            "id",
            "title",
            "cost",
            "cost_with_nds",
        )


class GroupedOfferWithPrice(serializers.Serializer):
    offer = GroupOfferItem()
    prices = DeliveryPrice(many=True)


class GroupedOffers(serializers.Serializer):
    name = serializers.CharField()
    offers = GroupedOfferWithPrice(many=True)
