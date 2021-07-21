from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from . import PriceField
from .. import models
from .. import serializers as ser
from ..enums import TaxTypes


class OrderSerializer(serializers.ModelSerializer):
    """
    Cтатусы:
    active - Новая сделка
    finished - Завершенная
    failed - Провалененная сделка

    Документы:
        id - ИД сущности.
        name - Название загруженного файла.
        typeDoc - Тип документа. Пример см. в ручке /api/orders/upload_doc/.
        file - url чтобы скачать файл.
        signFile - url чтобы скачать файл подписи. Если его нет, значит файл не подписывали.
    """

    title = serializers.CharField(source="offer.product.title")
    cost_with_nds = serializers.IntegerField(
        source="offer.cost_with_NDS", help_text="Цена предложения (продавца) с НДС"
    )
    cost = PriceField(
        source="offer.cost", help_text="Цена предложения (продавца) с НДС"
    )
    period_of_export = serializers.IntegerField(source="offer.period_of_export")
    cost_by_tonne = serializers.SerializerMethodField(
        "get_cost_by_tonne", help_text="Цена предложения (продавца) с за тонну"
    )
    offer = ser.OfferSerializer()
    tax_type = serializers.ChoiceField(
        source="offer.tax_type", choices=list(TaxTypes.readable())
    )
    provider_name = serializers.CharField(source="offer.company_name")
    customer_cost_with_nds = PriceField(
        source="customer_cost_with_NDS", help_text="Цена пользователя с НДС"
    )
    total_with_nds = serializers.IntegerField(
        source="total_with_NDS", help_text="Сделака (Цена полная)"
    )
    amount_of_nds = serializers.IntegerField(source="amount_of_NDS")
    selected_warehouse = ser.WarehouseSerializer(help_text="Склад вывоза")
    price_for_delivery = PriceField(required=True, help_text="Цена за доставку")
    documents = ser.DocumentSerializer(many=True)

    @extend_schema_field(OpenApiTypes.INT)
    def get_cost_by_tonne(self, instance: models.Order) -> int:
        return round(instance.total / instance.accepted_volume)

    class Meta:
        model = models.Order
        exclude = ("amount_of_NDS",)
