import pytest
from model_bakery import baker
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture()
def admin_user():
    user = baker.make("User", username="test")
    user.set_password("test")
    user.is_staff = True
    user.is_superadmin = True
    user.save()
    baker.make("Warehouse", distance=10, owner_id=user.id)
    return user


@pytest.fixture()
def admin_token(admin_user) -> str:
    return str(RefreshToken.for_user(admin_user).access_token)


@pytest.fixture()
def products():
    baker.make("main.Product")
    baker.make("main.Product")


@pytest.fixture()
def offer_groping_case():
    one_p = baker.make("Product", harvest_type="1")
    two_p = baker.make("Product", harvest_type="1")
    three_p = baker.make("Product", harvest_type="2")
    four_p = baker.make("Product", harvest_type="2")
    warehouse = baker.make("Warehouse", distance=10)
    baker.make("Offer", product_id=one_p.id, warehouse_id=warehouse.id)
    baker.make("Offer", product_id=two_p.id, warehouse_id=warehouse.id)
    baker.make("Offer", product_id=three_p.id, warehouse_id=warehouse.id)
    baker.make("Offer", product_id=four_p.id, warehouse_id=warehouse.id)
