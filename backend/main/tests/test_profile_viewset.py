import json

import pytest
from django.urls import reverse


@pytest.mark.django_db(transaction=True)
def test_profile_for_farmer(admin_user, admin_token, client):
    response = client.get(
        reverse("auth-profile"), HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 200, response.json()


@pytest.mark.django_db(transaction=True)
def test_add_warehouse_for_farmer(admin_user, admin_token, client):
    response = client.post(
        reverse("auth-add-warehouse"),
        HTTP_AUTHORIZATION=f"Bearer {admin_token}",
        content_type="application/json",
        data=json.dumps(({"title": "test", "address": "test"})),
    )
    assert response.status_code == 200, response.json()
