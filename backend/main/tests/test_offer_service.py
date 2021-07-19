import json

import pytest
from model_bakery import baker

from main import models
from main.enums import SpecificationTypes
from main.managers.offer import OfferSpecUpdate


@pytest.fixture()
def offer() -> "models.Offer":
    return baker.make("main.Offer")


@pytest.fixture()
def product() -> "models.Product":
    culture = baker.make("main.Culture")
    product = baker.make("main.Product", culture_id=culture.id)
    range_spec = baker.make(
        "main.SpecificationsOfProduct",
        required=True,
        spec=json.dumps(
            {"isEditableMin": True, "isEditableMax": True, "required": ["min"]}
        ),
        type=SpecificationTypes.range.value,
    )
    culture.specifications.add(range_spec)
    return product


@pytest.fixture()
def warehouse() -> "models.Warehouse":
    return baker.make("main.Warehouse")


@pytest.fixture()
def offer(product: "models.Product", warehouse: "models.Warehouse") -> "models.Offer":
    offer = baker.make("main.Offer", product_id=product.id, warehouse_id=warehouse.id)
    range_spec = models.SpecificationsOfProduct.objects.first()
    models.OfferSpecification.objects.create(
        offer_id=offer.id, specification_id=range_spec.id, value='{"min": 0}'
    )
    return offer


@pytest.mark.django_db()
def test_offer_spec_update(offer):
    offer = models.Offer.objects.first()
    range_spec = models.OfferSpecification.objects.first()
    models.Offer.service.update_specs(
        specs=[OfferSpecUpdate(offer_spec=range_spec, value=json.dumps({"min": 100}))]
    )
    assert range_spec.value == json.dumps({"min": 100})
