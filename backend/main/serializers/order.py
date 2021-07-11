from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from .. import models
from ..enums import TaxTypes


class OrderSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="offer.product.title")
    cost_with_nds = serializers.IntegerField(source="offer.cost_with_NDS")
    cost = serializers.IntegerField(source="offer.cost")
    period_of_export = serializers.IntegerField(source="offer.period_of_export")
    cost_by_tonne = serializers.SerializerMethodField("get_cost_by_tonne")
    tax_type = serializers.ChoiceField(
        source="offer.tax_type", choices=list(TaxTypes.readable())
    )
    provider_name = serializers.CharField(source="offer.company_name")

    @extend_schema_field(OpenApiTypes.INT)
    def get_cost_by_tonne(self, instance: models.Order) -> int:
        return round(instance.offer.cost_by_kg / 1000)

    class Meta:
        model = models.Order
        fields = "__all__"
