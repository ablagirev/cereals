from rest_framework import serializers
from .. import models
from .company import CompanySerializer


class LoginOut(serializers.Serializer):
    token = serializers.CharField()


class ProfileSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = models.Profile
        exclude = ("type", "user")
