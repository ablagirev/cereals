import datetime
import functools
import itertools
from collections import Iterable
from dataclasses import dataclass
from typing import Optional

from django.db.models import QuerySet

from .. import models
from ..utils import get_data_of_cost_delivery


@dataclass
class DeliveryPrice:
    warehouse: "models.Warehouse"
    price: int
    price_per_tonne: int


@dataclass
class OfferWithPrices:
    offer: "models.Offer"
    prices: list[DeliveryPrice]


@dataclass
class GroupedOffers:
    name: str
    offers: list[OfferWithPrices]


class OfferQuerySet(QuerySet):
    def ordered_by_type(self) -> QuerySet:
        return self.order_by("product__harvest_type")

    def get_price_for(self, offer: "models.Offer", user):
        prices_data = get_data_of_cost_delivery(user, offer.warehouse, offer)
        prices = list(
            DeliveryPrice(
                warehouse=price["warehouse_from"],
                price=price["cost_delivery"],
                price_per_tonne=price["cost_delivery_per_tonne"],
            )
            for price in prices_data
        )
        return prices

    def iterator_grouped_by_harvest(self, user) -> Iterable[GroupedOffers]:
        def _get_harvest_type(offer):
            return functools.reduce(getattr, ("product", "title"), offer)

        offers = self.ordered_by_type().filter(status="active")
        for k, g in itertools.groupby(offers, _get_harvest_type):
            any_: Optional["models.Offer"] = None
            group_offers = []
            for offer in g:
                any_ = offer
                prices = self.get_price_for(offer, user)
                group_offers.append(OfferWithPrices(offer=offer, prices=prices))
            yield GroupedOffers(offers=group_offers, name=any_.product.title)
