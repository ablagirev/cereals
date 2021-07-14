from .common import inline_serializer
from .warehouse import WarehouseSerializer, RateForDeliverySerializer
from .common import inline_serializer, DetailOut
from .settings import SettingsSerializer
from .product import (
    ProductSerializer,
    SpecificationsOfProductSerializer,
    UnitOfMeasurementOfSpecificationSerializer,
)
from .offer import (
    OfferSerializer,
    GroupedOffers,
    GroupOfferItem,
    GroupedOfferWithPrice,
    DetailOfferSerializer,
    ProductSpecificationsSerializer,
    DeliveryPrice,
)
from .company import CompanySerializer
from .order import OrderSerializer
from .auth import LoginOut, ProfileSerializer
