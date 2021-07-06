import json

import pytest
from django.contrib.auth.models import User
from django.urls import reverse


@pytest.mark.django_db(transaction=True)
def test_login(client, admin_user: User):
    response = client.post(
        reverse("auth-login"),
        content_type="application/json",
        data=json.dumps({"username": "test", "password": "test"}),
    )
    assert response.status_code == 200
    data = response.json()
    assert data["token"]
