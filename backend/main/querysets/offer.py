import functools
import itertools
from collections import Iterable
from dataclasses import dataclass

from django.db.models import QuerySet


@dataclass
class GroupedOffers:
    name: str
    offers: list


class OfferQuerySet(QuerySet):
    def ordered_by_type(self) -> QuerySet:
        return self.order_by("product__harvest_type")

    def iterator_grouped_by_harvest(self) -> Iterable[GroupedOffers]:
        def _get_harvest_type(offer):
            return functools.reduce(getattr, ("product", "harvest_type"), offer)

        offers = self.ordered_by_type()
        for k, g in itertools.groupby(offers, _get_harvest_type):
            yield GroupedOffers(name=k, offers=list(offer for offer in g))
