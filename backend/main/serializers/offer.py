from rest_framework import serializers
from . import product, SpecificationsOfProductSerializer
from . import warehouse
from .. import models
from . import PriceField


class ProductSpecificationsSerializer(serializers.ModelSerializer):
    specification = SpecificationsOfProductSerializer()

    class Meta:
        model = models.OfferSpecification
        exclude = ("offer",)


class DeliveryPrice(serializers.Serializer):
    price = PriceField()
    price_per_tonne = PriceField()
    warehouse = warehouse.WarehouseSerializer()


class OfferSerializer(serializers.ModelSerializer):
    """
    Статусы (status):
    active - Сделка активный (создан)
    archived - Сделка зархивирована (завершена)
    accepted = Сделка принята (завершена с успешеыми заказами)
    pending = Сделка в процессе
    partial = Сделка частично заверешена


    Период это два поля
    dateStartShipment
    dateFinishShipment
    а колич-во дней в
    periodOfExport
    """

    class Meta:
        model = models.Offer
        fields = "__all__"

    cost_with_nds = PriceField(
        read_only=True, source="cost_with_NDS", help_text="Цена покупателя с НДС"
    )
    cost = PriceField(required=True, help_text="Цена покупателя без НДС")
    period_of_export = PriceField(read_only=True, help_text="Период поставки")
    product = product.ProductSerializer(allow_null=True)
    warehouse = warehouse.WarehouseSerializer(allow_null=True, help_text="Порт")
    days_till_end = serializers.IntegerField()
    specifications = ProductSpecificationsSerializer(
        many=True, source="specification_values"
    )


class DetailOfferSerializer(OfferSerializer):
    prices = DeliveryPrice(many=True)


class GroupOfferItem(serializers.ModelSerializer):
    days_till_end = serializers.IntegerField()
    cost_with_nds = PriceField(source="cost_with_NDS")

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
