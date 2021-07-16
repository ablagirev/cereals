import pytest
from django.urls import reverse


@pytest.mark.django_db(transaction=True)
def test_profile_for_farmer(admin_user, admin_token, client):
    response = client.get(
        reverse("auth-profile"), HTTP_AUTHORIZATION=f"Bearer {admin_token}",
    )
    assert response.status_code == 200, response.json()
