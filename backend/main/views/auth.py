from django.contrib.auth import authenticate
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from main import serializers as ser


@extend_schema(tags=["auth"])
class AuthViewSet(GenericViewSet):
    permission_classes = [AllowAny]
    input_serializer = ser.inline_serializer(
        "LoginSerializer",
        {
            "username": serializers.CharField(required=True),
            "password": serializers.CharField(required=True),
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

    @extend_schema()
    @action(methods=("GET",), detail=False)
    def get_profile(self, request: Request):
        user = request.user
        if user.profile:
            pass
