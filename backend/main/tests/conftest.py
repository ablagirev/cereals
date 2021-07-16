import pytest
from model_bakery import baker
from rest_framework_simplejwt.tokens import RefreshToken

from main.enums import ProfileType


@pytest.fixture()
def admin_user():
    user = baker.make("User", username="test")
    user.set_password("test")
    user.is_staff = True
    user.is_superadmin = True
    user.save()
    baker.make("Warehouse", owner_id=user.id)
    baker.make("Profile", user_id=user.id, type=ProfileType.provider.value)
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
    one_p = baker.make("Product", harvest_type="2", title="Пшено")
    two_p = baker.make("Product", harvest_type="3", title="Пшено")
    three_p = baker.make("Product", harvest_type="4", title="Другое")
    four_p = baker.make("Product", harvest_type="5", title="Другое")
    warehouse = baker.make("Warehouse")
    baker.make(
        "Offer", product_id=one_p.id, warehouse_id=warehouse.id,
    )
    baker.make(
        "Offer", product_id=two_p.id, warehouse_id=warehouse.id,
    )
    baker.make(
        "Offer", product_id=three_p.id, warehouse_id=warehouse.id,
    )
    baker.make(
        "Offer", product_id=four_p.id, warehouse_id=warehouse.id,
    )


@pytest.fixture()
def farmer():
    user = baker.make("User", username="farmer")
    user.set_password("test")
    user.is_staff = False
    user.is_superadmin = False
    user.save()
    baker.make("Warehouse", owner_id=user.id)
    baker.make("Profile", user_id=user.id, type=ProfileType.farmer.value)
    return user


@pytest.fixture()
def farmer_token(farmer) -> str:
    return str(RefreshToken.for_user(farmer).access_token)
