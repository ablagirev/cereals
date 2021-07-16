from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from main import serializers as ser
from main.exceptions import UnprocessableEntityError
from main.managers.warehouse import AddWarehousePayload
from .. import models


class AuthPermission(BasePermission):
    def has_permission(self, request, view):
        if view.action in ("profile", "add_warehouse", "warehouses"):
            return request.user and request.user.is_authenticated
        return True


@extend_schema(tags=["auth"])
class AuthViewSet(GenericViewSet):
    permission_classes = (AuthPermission,)
    input_serializer = ser.inline_serializer(
        "LoginSerializer",
        {
            "username": serializers.CharField(required=True),
            "password": serializers.CharField(required=True),
        },
    )
    warehouse_add_serializer = ser.inline_serializer(
        "AddWarehouse",
        {
            "title": serializers.CharField(required=True),
            "address": serializers.CharField(required=True),
        },
    )

    @extend_schema(request=input_serializer, responses={200: ser.LoginOut})
    @action(detail=False, methods=["post"])
    def login(self, request: Request):
        serializer = self.input_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=400, data=serializer.errors)
        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                token = RefreshToken.for_user(user)
                return Response(
                    data={"token": str(token.access_token)}, status=status.HTTP_200_OK
                )
        return Response(
            status=status.HTTP_403_FORBIDDEN, data={"detail": "Доступ запрещен"}
        )

    @extend_schema(responses={200: ser.ProfileSerializer, 403: ser.DetailOut})
    @action(methods=("GET",), detail=False)
    def profile(self, request: Request):
        user = request.user
        try:
            profile = user.profile
        except models.Profile.DoesNotExist:
            raise UnprocessableEntityError(
                detail="Запросите администратора добавить вас в клиентскую базу"
            )
        return Response(data=ser.ProfileSerializer(instance=profile).data)

    @extend_schema(
        responses={200: ser.WarehouseSerializer, 403: ser.DetailOut},
        request=warehouse_add_serializer,
    )
    @action(methods=("POST",), detail=False, url_path="warehouse/add")
    def add_warehouse(self, request: Request):
        serializer: serializers.Serializer = self.warehouse_add_serializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        payload = AddWarehousePayload(title=data["title"], address=data["address"])
        warehouse = models.Warehouse.service.create_for_user(
            user=request.user, payload=payload
        )
        return Response(ser.WarehouseSerializer(instance=warehouse).data)

    @extend_schema(
        responses={200: ser.WarehouseSerializer(many=True), 403: ser.DetailOut}
    )
    @action(methods=("GET",), detail=False, url_path="warehouse")
    def warehouses(self, request: Request):
        warehouses = models.Warehouse.objects.filter(owner_id=request.user.id)
        return Response(ser.WarehouseSerializer(instance=warehouses, many=True).data)
