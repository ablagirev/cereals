import datetime
import json

import pytest
from model_bakery import baker

from main import models
from main.enums import SpecificationTypes
from main.managers.offer import CreateOfferPayload, SpecificationsValue


@pytest.fixture()
def simple_case(admin_user):
    culture = baker.make("main.Culture")
    specs = [
        baker.make(
            "main.SpecificationsOfProduct",
            type=SpecificationTypes.int.value,
            spec="",
            required=True,
        ),
        baker.make(
            "main.SpecificationsOfProduct",
            type=SpecificationTypes.range.value,
            spec='{"isEditableMin": true, "isEditableMax": true, "required": ["min", "max"]}',
            required=False,
        ),
    ]
    culture.specifications.add(*specs)
    baker.make("main.Product", culture_id=culture.id)
    baker.make("main.Warehouse", owner_id=admin_user.id)


@pytest.mark.django_db(transaction=True)
def test_simple_case(admin_user, simple_case):
    warehouse = models.Warehouse.objects.first()
    product = models.Product.objects.first()
    simple_spec = models.SpecificationsOfProduct.objects.filter(
        type=SpecificationTypes.int.value
    ).first()
    range_spec = models.SpecificationsOfProduct.objects.filter(
        type=SpecificationTypes.range.value
    ).first()
    payload = CreateOfferPayload(
        volume=100,
        shipment_start=datetime.date(2021, 1, 1),
        shipment_end=datetime.date(2021, 1, 10),
        warehouse=warehouse,
        product=product,
        cost=100,
        specifications=[
            SpecificationsValue(
                id=simple_spec.id, value="10", specification=simple_spec,
            )
        ],
    )
    first_offer: models.Offer = models.Offer.service.create_offer(
        payload=payload, user=admin_user
    )

    assert first_offer
    assert first_offer.warehouse == warehouse
    assert first_offer.product == product
    assert first_offer.creator == admin_user
    assert first_offer.specification_values.count() == 2
    offer_int: models.OfferSpecification = first_offer.specification_values.first()
    assert offer_int.value == "10"
    assert offer_int.specification == simple_spec

    payload = CreateOfferPayload(
        volume=100,
        shipment_start=datetime.date(2021, 1, 1),
        shipment_end=datetime.date(2021, 1, 10),
        warehouse=warehouse,
        product=product,
        cost=100,
        specifications=[
            SpecificationsValue(
                id=simple_spec.id, value="11", specification=simple_spec,
            ),
            SpecificationsValue(
                id=range_spec.id,
                value=json.dumps({"min": 0, "max": 10}),
                specification=range_spec,
            ),
        ],
    )
    second_offer = models.Offer.service.create_offer(payload=payload, user=admin_user)

    assert second_offer
    assert second_offer.warehouse == warehouse
    assert second_offer.product == product
    assert second_offer.creator == admin_user
    assert second_offer.specification_values.count() == 2
    sec_offer_int = second_offer.specification_values.filter(
        specification__type=SpecificationTypes.int.value
    ).first()
    sec_offer_range = second_offer.specification_values.filter(
        specification__type=SpecificationTypes.range.value
    ).first()
    assert sec_offer_int.value == "11"
    assert sec_offer_range.value == json.dumps({"min": 0, "max": 10})
