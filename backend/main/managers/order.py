from dataclasses import dataclass

from django.db import models
from django.db.models import Q
from rest_framework.exceptions import ValidationError

from main import models as app_models


@dataclass
class PriceBetweenWarehouses:
    from_: "app_models.Warehouse"
    to: "app_models.Warehouse"
    price_for_delivery_per_tonne: int


class OrderPriceService(models.Manager):
    @classmethod
    def get_delivery_price(cls, distance: int):
        """
        CNPT - стоимость доставки
        """
        if distance < 100:
            return 500
        if distance <= 700:
            return distance * 4
        return distance * 3.8

    @classmethod
    def farmer_price(cls, offer: "app_models.Offer", delivery_cost: int) -> int:
        """
        CNEXW = CNCPT - CNPT - цена продавца
        """
        cost = offer.cost - delivery_cost
        return cost

    @classmethod
    def farmer_price_with_nds(
        cls, offer: "app_models.Offer", delivery_cost: int
    ) -> int:
        return round(cls.farmer_price(offer=offer, delivery_cost=delivery_cost) * 1.1)

    @classmethod
    def buyer_cost(cls, offer: "app_models.Offer") -> int:
        return offer.cost

    @classmethod
    def buyer_cost_with_nds(cls, offer: "app_models.Offer") -> int:
        """CVEXW = CNEXW * 1.1"""
        return round(offer.cost * 1.1)

    @classmethod
    def warehouse_price(
        cls, from_: "app_models.Warehouse", to: "app_models.Warehouse"
    ) -> PriceBetweenWarehouses:
        distance = (
            app_models.WarehouseDistance.objects.filter(
                Q(start=from_, to=to) | Q(start=to, to=from_)
            )
            .order_by()
            .distinct()
            .first()
        )
        if distance is None:
            raise ValidationError(
                detail=f"Не найдено расстояние от {from_.title} до {to.title}"
            )
        return PriceBetweenWarehouses(
            from_=from_,
            to=to,
            price_for_delivery_per_tonne=cls.get_delivery_price(distance.distance),
        )
