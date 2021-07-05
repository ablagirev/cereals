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
    return user


@pytest.fixture()
def admin_token(admin_user) -> str:
    return str(RefreshToken.for_user(admin_user).access_token)


@pytest.fixture()
def products():
    baker.make("main.Product")
    baker.make("main.Product")
