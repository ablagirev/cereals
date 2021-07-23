import pytest

from .. import models


@pytest.mark.django_db(transaction=True)
def test_getting_offers_by_group(offer_groping_case, farmer):
    count = 0
    for offers in list(models.Offer.objects.iterator_grouped_by_harvest(farmer)):
        assert offers.offers
        offer = offers.offers[0]
        assert (
            len(offers.offers)
            == models.Product.objects.filter(
                culture__category__id=offer.offer.product.culture.category.id
            )
            .distinct()
            .count()
        )
        count += 1
    assert (
        count
        == models.Category.objects.filter(culture__product__isnull=False)
        .distinct()
        .count()
    )
