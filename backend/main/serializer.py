from drf_writable_nested.serializers import WritableNestedModelSerializer
from rest_framework import serializers
from rest_framework.serializers import Serializer


def inline_serializer(name: str, fields: dict[str, object]) -> type:
    return type(name, (Serializer,), fields)


from main.models import (
    Product,
    Offer,
    Warehouse,
    Document,
    Company,
    SpecificationsOfProduct,
    UnitOfMeasurementOfSpecification,
    Order,
    RateForDelivery,
)


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = "__all__"


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        # fields = ['file', 'name']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class UnitOfMeasurementOfSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasurementOfSpecification
        fields = "__all__"


class SpecificationsOfProductSerializer(WritableNestedModelSerializer):
    class Meta:
        model = SpecificationsOfProduct
        fields = "__all__"

    unit_of_measurement = UnitOfMeasurementOfSpecificationSerializer()


class ProductSerializer(WritableNestedModelSerializer):
    specifications = SpecificationsOfProductSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"

    # def update(self, instance, validated_data):
    #     specifications_data = validated_data.pop("specifications")
    #
    #     instance.title = validated_data.get("title")
    #     instance.description = validated_data.get("description")
    #     instance.harvest_year = validated_data.get("harvest_year")
    #     instance.harvest_type = validated_data.get("harvest_type")
    #
    #     for index, specification in enumerate(instance.specifications.all()):
    #         specification.min_value = specifications_data[index].get("min_value")
    #         specification.max_value = specifications_data[index].get("max_value")
    #         specification.save()
    #
    #     instance.save()
    #     return instance


class DeliveryPrice(serializers.Serializer):
    price = serializers.IntegerField()
    price_per_tonne = serializers.IntegerField()
    warehouse = WarehouseSerializer()


class OfferSerializer(WritableNestedModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

    cost_with_nds = serializers.IntegerField(read_only=True, source="cost_with_NDS")
    period_of_export = serializers.IntegerField(read_only=True)
    product = ProductSerializer(allow_null=True)
    warehouse = WarehouseSerializer(allow_null=True)
    days_till_end = serializers.IntegerField()


class DetailOfferSerializer(OfferSerializer):
    prices = DeliveryPrice(many=True)


class LoginOut(serializers.Serializer):
    token = serializers.CharField()


class DetailOut(serializers.Serializer):
    detail = serializers.CharField()


class RateForDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = RateForDelivery
        fields = "__all__"


class SettingsSerializer(serializers.Serializer):
    base_rate = RateForDelivery()
    warehouses = WarehouseSerializer(many=True)


class GroupOfferItem(serializers.ModelSerializer):
    days_till_end = serializers.IntegerField()
    cost_with_nds = serializers.IntegerField(source="cost_with_NDS")

    class Meta:
        model = Offer
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
