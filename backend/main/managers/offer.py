from dataclasses import dataclass

from django.db.transaction import atomic

from main.managers.update import DefaultUpdateManager
from .. import models
from ..enums import OfferStatus


@dataclass
class AcceptPayload:
    volume: int
    user_id: int
    warehouse_id: int


class OfferManager(DefaultUpdateManager):
    @atomic()
    def accept(self, *, offer: "models.Offer", payload: AcceptPayload):
        order = models.Order.objects.create(
            offer_id=offer.id,
            accepted_volume=payload.volume,
            provider_id=offer.creator.id,
            customer_id=payload.user_id,
            selected_warehouse_id=payload.warehouse_id,
        )
        offer.status = OfferStatus.pending.value
        offer.save()
        return order
