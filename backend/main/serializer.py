from rest_framework import serializers

from main.models import Product, Offer, Warehouse, Deal, Document, Company, SpecificationsOfProduct, \
    NameOfSpecification, TypeOfSpecification, UnitOfMeasurementOfSpecification

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"

    cost_with_NDS = serializers.IntegerField(read_only=True)
    period_of_export = serializers.IntegerField(read_only=True)


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = '__all__'


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        # fields = ['file', 'name']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class NameOfSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = NameOfSpecification
        fields = '__all__'



class TypeOfSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfSpecification
        fields = '__all__'


class UnitOfMeasurementOfSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitOfMeasurementOfSpecification
        fields = '__all__'


class SpecificationsOfProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpecificationsOfProduct
        fields = '__all__'

    name_of_specification = NameOfSpecificationSerializer()
    type_field = TypeOfSpecificationSerializer()
    unit_of_measurement = UnitOfMeasurementOfSpecificationSerializer()


class ProductSerializer(serializers.ModelSerializer):
    specifications = SpecificationsOfProductSerializer(many=True)

    class Meta:
        model = Product
        fields = '__all__'

    def update(self, instance, validated_data):
        specifications_data = validated_data.pop('specifications')

        instance.title = validated_data.get('title')
        instance.description = validated_data.get('description')
        instance.harvest_year = validated_data.get('harvest_year')
        instance.harvest_type = validated_data.get('harvest_type')

        for index, specification in enumerate(instance.specifications.all()):
            specification.min_value = specifications_data[index].get('min_value')
            specification.max_value = specifications_data[index].get('max_value')
            specification.save()

        instance.save()
        return instance
