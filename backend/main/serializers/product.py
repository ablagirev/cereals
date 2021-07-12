from rest_framework import serializers
from .. import models


class UnitOfMeasurementOfSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UnitOfMeasurementOfSpecification
        fields = "__all__"


class SpecificationsOfProductSerializer(serializers.ModelSerializer):
    unit_of_measurement = UnitOfMeasurementOfSpecificationSerializer()

    class Meta:
        model = models.SpecificationsOfProduct
        fields = "__all__"


class ProductSpecificationsSerializer(serializers.ModelSerializer):
    specification = SpecificationsOfProductSerializer()

    class Meta:
        model = models.ProductSpecification
        exclude = ("product",)


class ProductSerializer(serializers.ModelSerializer):
    specifications = ProductSpecificationsSerializer(
        many=True, source="specification_values"
    )

    class Meta:
        model = models.Product
        fields = "__all__"
