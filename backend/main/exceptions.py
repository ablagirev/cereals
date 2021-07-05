from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class UnprocessableEntityError(APIException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = "Entity unprocessable"


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    return response
