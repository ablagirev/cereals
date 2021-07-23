from typing import Iterable

from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .common import get_or_unprocessable
from .mixins import UpdateViewSetMixin
from .. import models
from .. import serializers as ser
from ..enums import ProfileType
from ..exceptions import UnprocessableEntityError
from ..managers.offer import (
    AcceptPayload,
    CreateOfferPayload,
    SpecificationsValue,
    OfferSpecUpdate,
)
from ..querysets.offer import GroupedOffers


@extend_schema(tags=["offer"])
class OfferViewSet(
    UpdateViewSetMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    queryset = models.Offer.objects.all()
    serializer_class = ser.OfferSerializer
    grouped_serializer = ser.GroupedOffers
    partial_update_output_serializer = serializer_class
    partial_update_serializer = ser.inline_serializer(
        "OfferPartialUpdate",
        {
            "product": ser.inline_serializer(
                "ProductById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
            "warehouse": ser.inline_serializer(
                "WarehouseById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
            "specifications": ser.inline_serializer(
                "SpecificationValue",
                {
                    "id": serializers.IntegerField(required=True),
                    "value": serializers.CharField(required=True),
                },
            )(many=True, required=False),
        },
    )
    specification_create_serializer = ser.inline_serializer(
        "SpecCreate",
        {
            "id": serializers.IntegerField(required=True),
            "value": serializers.CharField(required=True, allow_null=True),
        },
    )
    create_serializer = ser.inline_serializer(
        "OfferCreate",
        {
            "product": ser.inline_serializer(
                "ProductById", {"id": serializers.IntegerField(required=True)}
            )(required=True),
            "warehouse": ser.inline_serializer(
                "WarehouseById", {"id": serializers.IntegerField(required=True)}
            )(required=True),
            "cost": serializers.IntegerField(required=True),
            "volume": serializers.IntegerField(required=True),
            "specifications": specification_create_serializer(many=True),
            "shipment_start": serializers.DateField(required=True),
            "shipment_end": serializers.DateField(required=True),
        },
    )
    accept_serializer = ser.inline_serializer(
        "AcceptOffer",
        {
            "volume": serializers.IntegerField(required=True),
            "warehouse_id": serializers.IntegerField(required=True),
        },
    )

    def get_queryset(self):
        profile: models.Profile = self.request.user.profile
        if self.action in ("list",) and profile.type == ProfileType.provider.value:
            return models.Offer.objects.filter(creator_id=self.request.user.id)
        return super().get_queryset()

    @extend_schema(responses={200: ser.DetailOfferSerializer, 403: ser.DetailOut})
    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.prices = models.Offer.objects.get_price_for(
            offer=obj, user=self.request.user
        )
        return Response(ser.DetailOfferSerializer(instance=obj).data)

    @extend_schema(
        request=partial_update_serializer,
        responses={
            200: partial_update_output_serializer,
            403: ser.DetailOut,
            422: ser.DetailOut,
        },
    )
    def partial_update(self, request: Request, *args, **kwargs):
        """
        Частичное обновление для Offer-ов
        """
        return super().partial_update(request, *args, **kwargs)

    def apply_partial_update(
        self, instance: models.Offer, validated_data: dict
    ) -> models.Offer:
        update_kwargs = validated_data
        if product_data := validated_data.pop("product", None):
            product = get_or_unprocessable(
                models.Product.objects.filter(id=product_data["id"]),
                message="Продукт с указанным id не найден",
            )
            update_kwargs["product_id"] = product.id
        if warehouse_data := validated_data.pop("warehouse", None):
            warehouse = get_or_unprocessable(
                models.Warehouse.objects.filter(id=warehouse_data["id"]),
                message="Склад с указанным id не найден",
            )
            update_kwargs["warehouse_id"] = warehouse.id
        if specifications := validated_data.pop("specifications", None):
            payloads: list[OfferSpecUpdate] = []
            for spec in specifications:
                payload = OfferSpecUpdate(
                    value=spec["value"],
                    offer_spec=models.OfferSpecification.objects.filter(
                        offer_id=instance.id, specification__id=spec["id"]
                    ).first(),
                )
                payloads.append(payload)
            models.Offer.service.update_specs(specs=payloads)
        models.Offer.service.update(instance=instance, **update_kwargs)
        return instance

    @extend_schema(request=create_serializer)
    def create(self, request, *args, **kwargs):
        serializer: serializers.Serializer = self.create_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        create_data = validated_data
        product: models.Product = get_or_unprocessable(
            models.Product.objects.filter(id=validated_data["product"]["id"]),
            message="Продукт с указанным id не найден",
        )
        create_data["product_id"] = product.id
        warehouse: models.Warehouse = get_or_unprocessable(
            models.Warehouse.objects.filter(id=validated_data["warehouse"]["id"]),
            message="Склад с указанным id не найден",
        )
        create_data["warehouse_id"] = warehouse.id
        try:
            specs = {
                spec["id"]: models.SpecificationsOfProduct.objects.get(id=spec["id"])
                for spec in validated_data["specifications"]
            }
        except models.SpecificationsOfProduct.DoesNotExist:
            raise UnprocessableEntityError(detail=f"Показатель не существует")
        offer = models.Offer.service.create_offer(
            payload=CreateOfferPayload(
                product=product,
                warehouse=warehouse,
                cost=validated_data["cost"],
                shipment_end=validated_data["shipment_end"],
                shipment_start=validated_data["shipment_start"],
                specifications=list(
                    SpecificationsValue(
                        id=spec["id"],
                        value=spec["value"],
                        specification=specs[spec["id"]],
                    )
                    for spec in validated_data["specifications"]
                ),
                volume=validated_data["volume"],
            ),
            user=request.user,
        )
        return Response(
            data=self.serializer_class(instance=offer).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(responses={200: grouped_serializer(many=True), 403: ser.DetailOut})
    @action(methods=["GET"], detail=False)
    def grouped(self, request: Request):
        offers_iter: Iterable[
            GroupedOffers
        ] = models.Offer.objects.iterator_grouped_by_harvest(request.user)
        return Response(
            data=self.grouped_serializer(instance=offers_iter, many=True).data
        )

    @extend_schema(
        responses={200: ser.OrderSerializer, 403: ser.DetailOut},
        request=accept_serializer,
    )
    @action(methods=["POST"], detail=True)
    def accept(self, request: Request, pk: int):
        serializer: serializers.Serializer = self.accept_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        offer = models.Offer.objects.get(id=pk)
        order = models.Offer.service.accept(
            offer=offer,
            payload=AcceptPayload(
                volume=data["volume"],
                user_id=request.user.id,
                warehouse_id=data["warehouse_id"],
            ),
        )
        return Response(ser.OrderSerializer(instance=order).data)
