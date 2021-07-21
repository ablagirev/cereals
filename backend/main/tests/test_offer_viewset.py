import json

import pytest
from django.urls import reverse
from model_bakery import baker

from main import models
from main.enums import SpecificationTypes


@pytest.fixture()
def offer() -> "models.Offer":
    return baker.make("main.Offer")


@pytest.fixture()
def product() -> "models.Product":
    culture = baker.make("main.Culture", name="culture")
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


@pytest.mark.django_db(transaction=True)
def test_offer_creating(client, admin_token, product):
    range_spec = models.SpecificationsOfProduct.objects.first()
    response = client.post(
        reverse("offer-list"),
        content_type="application/json",
        data=json.dumps(
            {
                "cost": 100,
                "volume": 10,
                "product": {"id": models.Product.objects.first().id},
                "warehouse": {"id": models.Warehouse.objects.first().id},
                "shipmentStart": "2021-10-10",
                "shipmentEnd": "2021-11-10",
                "specifications": [{"id": range_spec.id, "value": '{"min": 10}'}],
            }
        ),
        HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 201, response.json()
    assert response.json()
    assert models.Offer.objects.count() == 1

    response = client.post(
        reverse("offer-list"),
        content_type="application/json",
        data=json.dumps(
            {
                "cost": 100,
                "volume": 10,
                "product": {"id": models.Product.objects.first().id},
                "warehouse": {"id": models.Warehouse.objects.first().id},
                "shipmentStart": "2021-10-10",
                "shipmentEnd": "2021-11-10",
                "specifications": [
                    {"id": range_spec.id, "value": '{"min": 10, "max": 15}'}
                ],
            }
        ),
        HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 201, response.json()
    assert response.json()
    assert models.Offer.objects.count() == 2


@pytest.mark.django_db(transaction=True)
def test_offer_patching(client, offer: models.Offer, products, admin_token):
    response = client.patch(
        reverse("offer-detail", kwargs={"pk": offer.id}),
        content_type="application/json",
        data=json.dumps({"product": {"id": models.Product.objects.first().id}}),
        HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 200, response.json()
    assert response.json()
    assert models.Offer.objects.count() == 1
    assert models.Offer.objects.first().product_id == models.Product.objects.first().id


@pytest.mark.django_db(transaction=True)
def test_offer_grouped(client, offer_groping_case, farmer_token):
    res = client.get(
        reverse("offer-grouped"), HTTP_AUTHORIZATION=f"Bearer {farmer_token}",
    )
    assert res.status_code == 200, res.json()
    data = res.json()
    assert data[0]["offers"][0]["prices"]


@pytest.mark.django_db(transaction=True)
def test_order_accept(client, farmer_token, products, offer: "models.Offer"):
    offer = models.Offer.objects.first()
    warehouse = models.Warehouse.objects.first()
    res = client.post(
        reverse("offer-accept", kwargs={"pk": offer.id}),
        content_type="application/json",
        HTTP_AUTHORIZATION=f"Bearer {farmer_token}",
        data=json.dumps(
            {"volume": round(offer.volume / 2), "warehouseId": warehouse.id}
        ),
    )
    assert res.status_code == 200, res.json()

    assert models.Order.objects.count() == 1
