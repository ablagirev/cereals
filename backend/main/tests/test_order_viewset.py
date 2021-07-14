import pytest
from django.urls import reverse
from model_bakery import baker


def orders():
    baker.make("main.Order")


@pytest.mark.django_db(transaction=True)
def test_order_list(client, admin_token):
    client.get(reverse("orders-list"))
