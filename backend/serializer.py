from rest_framework import serializers

from backend.models import Product, Offer, Warehouse, Deal, Document, Company


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['title', 'description', 'amount_of_gluten', 'vitreous',
                  'nature', 'moisture', 'weed_admixture', 'harvest_year',
                  'harvest_type', 'humidity', 'grain_impurity', 'broken',
                  'damaged_by_mold', 'aflatoxin', 'vomitoxin', 'protein',
                  'drop_number', 'damage_bedbug_turtle', 'alveographic_characteristics_of_the_test',
                  'gluten_strain_gauge', 'damaged', 'colored', 'oilseed_admixture',
                  'oil_content', 'acid_number_of_the_oil', 'free_fatty_acids', 'salmonella',
                  'pesticides', 'erucic_acid', 'glucosinolates', 'genetically_modified_organism',
                  'fiber', 'dirty_chickpeas', 'passing_through_the_sieve', 'smell',
                  'harmful_substances', 'urea', 'potassium_hydroxide', 'trypsin',
                  'ochratoxin', 'zearalenon', 'fumonisin', 'damaged_by_drying',
                  'damaged_by_pests', 'other_cereals', 'infection_is_not_allowed']


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['title', 'volume', 'description', 'offer_lifetime', 'status',
                  'creator', 'created_at',
                  'product', 'warehouses', 'period_of_export']


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['title', 'address', 'owner']


class DealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deal
        fields = ['offer', 'status', 'documents', 'quality_control',
                  'payment', 'shipment', 'control', 'provider']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['name', 'type_doc', 'file', 'sign_file']


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

