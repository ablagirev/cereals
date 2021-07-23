import datetime
import json

import pytest
from django.urls import reverse
from model_bakery import baker

from main import models
from main.enums import SpecificationTypes, OrderStatus


@pytest.fixture()
def orders(admin_user):
    baker.make("main.Order", customer_id=admin_user.id)


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
def offer(product: "models.Product", admin_user) -> "models.Offer":
    warehouse = baker.make("main.Warehouse", owner_id=admin_user.id)
    offer = baker.make(
        "main.Offer",
        product_id=product.id,
        volume=100,
        creator_id=admin_user.id,
        warehouse_id=warehouse.id,
        date_start_shipment=datetime.date(2021, 10, 1),
        date_finish_shipment=datetime.date(2021, 10, 11),
        cost=1000,
        company_name=admin_user.profile.company.name_of_provider,
    )
    range_spec = product.culture.specifications.first()
    baker.make(
        "main.OfferSpecification",
        offer_id=offer.id,
        specification_id=range_spec.id,
        value=json.dumps({"min": 10}),
    )
    return offer


@pytest.mark.django_db(transaction=True)
def test_order_list(client, admin_token, orders):
    response = client.get(
        reverse("orders-list"), HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 200
    assert len(response.json()) == 1, models.Order.objects.count()


@pytest.mark.django_db(transaction=True)
def test_order_creating(offer: "models.Offer", farmer_token, farmer, client):
    assert models.Order.objects.count() == 0

    farmer_warehouse = farmer.warehouses.first()
    response = client.post(
        reverse("offer-accept", kwargs={"pk": offer.id}),
        HTTP_AUTHORIZATION=f"Bearer {farmer_token}",
        content_type="application/json",
        data=json.dumps({"volume": 50, "warehouseId": farmer_warehouse.id}),
    )
    assert response.status_code == 200, response.json()

    assert models.Order.objects.count() == 1
    order = models.Order.objects.first()
    assert order.accepted_volume == 50
    data = response.json()
    assert data["periodOfExport"] == 11
    assert data["status"] == OrderStatus.active.value
    assert data["customerCost"]
    assert data["customerCostWithNds"]
    assert data["cost"]
    assert data["costWithNds"]
    assert data["costByTonne"]
    assert data["total"]
    assert data["totalWithNds"]
    # assert data["dateStartShipment"]
    # assert data["dateFinishShipment"]
