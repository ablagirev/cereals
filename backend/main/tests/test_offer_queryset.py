import pytest

from .. import models


@pytest.mark.django_db(transaction=True)
def test_getting_offers_by_group(offer_groping_case, admin_user):
    expect_order = ("1", "2")
    count = 0
    for offers, expected in zip(
        models.Offer.objects.iterator_grouped_by_harvest(admin_user), expect_order
    ):
        assert offers.type == expected
        assert len(offers.offers) == 2
        count += 1
    assert count == 2
