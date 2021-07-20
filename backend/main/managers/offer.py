import json
from dataclasses import dataclass
import datetime
from django.db.transaction import atomic
from jsonschema import validate, ValidationError
from main.managers.update import DefaultUpdateManager
from .. import models
from ..enums import OfferStatus, SCHEMA_BUILDERS, SpecificationTypes
from django.contrib.auth import models as auth_models

from ..exceptions import UnprocessableEntityError
from ..utils import get_price_for_between_warehouses


@dataclass
class AcceptPayload:
    volume: int
    user_id: int
    warehouse_id: int


@dataclass
class SpecificationsValue:
    id: int
    value: str
    specification: "models.SpecificationsOfProduct"


@dataclass
class CreateOfferPayload:
    volume: int
    shipment_start: datetime.date
    shipment_end: datetime.date
    warehouse: "models.Warehouse"
    product: "models.Product"
    specifications: list[SpecificationsValue]
    cost: int


@dataclass
class OfferSpecUpdate:
    value: str
    offer_spec: "models.OfferSpecification"


class OfferManager(DefaultUpdateManager):
    @atomic()
    def accept(self, *, offer: "models.Offer", payload: AcceptPayload):
        warehouse = models.Warehouse.objects.filter(id=payload.warehouse_id).first()
        if warehouse is None:
            raise ValidationError("Выбранный склад не найден")
        price_holder = get_price_for_between_warehouses(offer.warehouse, warehouse)
        order = models.Order.objects.create(
            offer_id=offer.id,
            accepted_volume=payload.volume,
            provider_id=offer.creator.id,
            customer_id=payload.user_id,
            selected_warehouse_id=payload.warehouse_id,
            price_for_delivery=(price_holder.price_for_delivery * payload.volume),
            total=(price_holder.price_for_delivery * payload.volume)
            + (offer.cost * payload.volume),
            customer_cost=(offer.cost * payload.volume),
        )
        offer.status = OfferStatus.pending.value
        offer.save()
        return order

    @atomic()
    def create_offer(
        self, payload: CreateOfferPayload, user: "auth_models.User"
    ) -> "models.Offer":
        company = user.profile.company
        if company is None:
            raise UnprocessableEntityError(
                detail="Требуется заполнить профиль перед созданием предложенй"
            )
        needed_specs = set(
            spec.id for spec in self._get_needed_specs(product=payload.product)
        )
        provided_specs = set(spec.id for spec in payload.specifications)
        if needed_specs & provided_specs != needed_specs:
            raise UnprocessableEntityError(
                detail="Были указаны не все требуемые показатели"
            )
        allowed_specs = set(
            spec.id for spec in payload.product.culture.specifications.all()
        )
        if allowed_specs & provided_specs != provided_specs:
            raise UnprocessableEntityError(
                detail="Были указаны не существующие аттрибуты"
            )
        specs = {spec.id: spec for spec in payload.product.culture.specifications.all()}
        offer = self.create(
            title=payload.product.culture.name,
            product_id=payload.product.id,
            warehouse_id=payload.warehouse.id,
            volume=payload.volume,
            creator_id=user.id,
            date_start_shipment=payload.shipment_start,
            date_end_shipment=payload.shipment_end,
            cost=payload.cost,
            company_name=company.name_of_provider,
        )
        for spec in payload.specifications:
            models.OfferSpecification.objects.create(
                offer=offer,
                specification=specs[spec.id],
                value=self._validate_spec_value(value=spec.value, spec=specs[spec.id]),
            )
        return offer

    @atomic()
    def update_specs(self, *, specs: list[OfferSpecUpdate]):
        for payload in specs:
            payload.offer_spec.value = payload.value
            payload.offer_spec.save()

    def _get_needed_specs(
        self, product: "models.Product"
    ) -> list["models.SpecificationsOfProduct"]:
        def _is_required(spec: "models.SpecificationsOfProduct"):
            return bool(spec.required)

        return list(filter(_is_required, product.culture.specifications.all()))

    def _validate_spec_value(self, value: str, spec: "models.SpecificationsOfProduct"):
        try:
            validate(
                instance=json.loads(value),
                schema=SCHEMA_BUILDERS[SpecificationTypes(spec.type)](spec),
            )
        except ValidationError as e:
            raise UnprocessableEntityError(
                detail=f"Указаное значпение: '{value}' не действителен для {spec.name} ({spec.id})"
            )
        return value
