from rest_framework import serializers


def inline_serializer(name: str, fields: dict[str, object]) -> type:
    return type(name, (serializers.Serializer,), fields)


class DetailOut(serializers.Serializer):
    detail = serializers.CharField()
