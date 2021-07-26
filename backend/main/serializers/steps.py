from rest_framework import serializers


class Step1Docs(serializers.Serializer):
    for_sign = serializers.CharField()
    specification = serializers.CharField()
    bill = serializers.CharField()
