from typing import Iterable

from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .common import get_or_unprocessable
from .mixins import UpdateViewSetMixin
from .. import models
from .. import serializer
from ..managers.offer import AcceptPayload
from ..querysets.offer import GroupedOffers
from ..serializer import (
    inline_serializer,
    DetailOut,
    DetailOfferSerializer,
    OrderSerializer,
)


@extend_schema(tags=["offer"])
class OfferViewSet(UpdateViewSetMixin, ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = models.Offer.objects.all()
    serializer_class = serializer.OfferSerializer
    grouped_serializer = serializer.GroupedOffers
    partial_update_output_serializer = serializer_class
    partial_update_serializer = inline_serializer(
        "OfferPartialUpdate",
        {
            "product": inline_serializer(
                "ProductById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
            "warehouse": inline_serializer(
                "WarehouseById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
        },
    )
    create_serializer = inline_serializer(
        "OfferCreate",
        {
            "product": inline_serializer(
                "ProductById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
            "warehouse": inline_serializer(
                "WarehouseById", {"id": serializers.IntegerField(required=True)}
            )(required=False),
            "cost": serializers.IntegerField(required=True),
            "volume": serializers.IntegerField(required=True),
        },
    )
    accept_serializer = inline_serializer(
        "AcceptOffer", {"volume": serializers.IntegerField(),}
    )

    @extend_schema(responses={200: DetailOfferSerializer, 403: DetailOut})
    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        obj.prices = models.Offer.objects.get_price_for(offer=obj, user=request.user)
        return Response(DetailOfferSerializer(instance=obj).data)

    @extend_schema(
        request=partial_update_serializer,
        responses={
            200: partial_update_output_serializer,
            403: DetailOut,
            422: DetailOut,
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
        models.Offer.service.update(instance=instance, **update_kwargs)
        return instance

    @extend_schema(request=create_serializer)
    def create(self, request, *args, **kwargs):
        serializer: serializers.Serializer = self.create_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        create_data = validated_data
        if product_data := validated_data.pop("product", None):
            product = get_or_unprocessable(
                models.Product.objects.filter(id=product_data["id"]),
                message="Продукт с указанным id не найден",
            )
            create_data["product_id"] = product.id
        if warehouse_data := validated_data.pop("warehouse", None):
            warehouse = get_or_unprocessable(
                models.Warehouse.objects.filter(id=warehouse_data["id"]),
                message="Склад с указанным id не найден",
            )
            create_data["warehouse_id"] = warehouse.id
        offer = models.Offer.service.create(creator_id=request.user.id, **create_data)
        return Response(
            data=self.serializer_class(instance=offer).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(responses={200: grouped_serializer(many=True), 403: DetailOut})
    @action(methods=["GET"], detail=False)
    def grouped(self, request: Request):
        offers_iter: Iterable[
            GroupedOffers
        ] = models.Offer.objects.iterator_grouped_by_harvest(request.user)
        return Response(
            data=self.grouped_serializer(instance=offers_iter, many=True).data
        )

    @extend_schema(
        responses={200: OrderSerializer, 403: DetailOut}, request=accept_serializer
    )
    @action(methods=["POST"], detail=True)
    def accept(self, request: Request, pk: int):
        serializer: serializers.Serializer = self.accept_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        offer = models.Offer.objects.get(id=pk)
        order = models.Offer.service.accept(
            offer=offer,
            payload=AcceptPayload(volume=data["volume"], user_id=request.user.id),
        )
        return Response(OrderSerializer(instance=order).data)
