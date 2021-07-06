from django.db import models


from main.exceptions import UnprocessableEntityError


def get_or_unprocessable(queryset: models.QuerySet, message: str) -> models.Model:
    obj = queryset.first()
    if obj is None:
        raise UnprocessableEntityError(detail=message)
    return obj
