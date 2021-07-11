from rest_framework import serializers


class LoginOut(serializers.Serializer):
    token = serializers.CharField()
