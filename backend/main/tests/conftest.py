import pytest
from model_bakery import baker
from rest_framework_simplejwt.tokens import RefreshToken

from main import models
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
    category_1 = baker.make("Category")
    category_2 = baker.make("Category")
    culture_1 = baker.make("Culture", category_id=category_1.id)
    culture_2 = baker.make("Culture", category_id=culture_1.id)
    culture_3 = baker.make("Culture", category_id=category_2.id)
    one_p = baker.make("Product", title="Пшено", culture_id=culture_1.id)
    two_p = baker.make("Product", title="Пшено", culture_id=culture_2.id)
    three_p = baker.make("Product", title="Другое", culture_id=culture_3.id)
    four_p = baker.make("Product", title="Другое", culture_id=culture_3.id)
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
    already_existing_warehouses = models.Warehouse.objects.all()
    user_warehouse = baker.make("Warehouse", owner_id=user.id)
    baker.make("Profile", user_id=user.id, type=ProfileType.farmer.value)
    for existing_warehouse in already_existing_warehouses:
        baker.make(
            "WarehouseDistance", start_id=existing_warehouse.id, to_id=user_warehouse.id
        )
    return user


@pytest.fixture()
def farmer_token(farmer) -> str:
    return str(RefreshToken.for_user(farmer).access_token)
