from rest_framework import serializers

from main.models import (
    Product,
    Offer,
    Warehouse,
    Deal,
    Document,
    Company,
    SpecificationsOfProduct,
)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        depth = 2


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

    cost_with_NDS = serializers.IntegerField(read_only=True)
    period_of_export = serializers.IntegerField(read_only=True)


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = "__all__"


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = "__all__"


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class SpecificationsOfProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecificationsOfProduct
        fields = "__all__"
        depth = 1
