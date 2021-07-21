from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import serializers

from main.views.mixins import UpdateViewSetMixin
from .. import models
from ..serializers import OrderSerializer
from .. import serializers as ser


@extend_schema(tags=["order"])
class OrderViewSet(UpdateViewSetMixin, ModelViewSet):
    queryset = models.Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.action == "list":
            return super().get_queryset().filter(customer_id=self.request.user.id)
        return super().get_queryset()


    upload_doc_serializer = ser.inline_serializer(
        "Upload_doc",
        {
            "file": serializers.FileField(required=True),
            "order_id": serializers.IntegerField(required=True),
            "type_doc": serializers.CharField(required=True),
        },
    )
    @extend_schema(request=upload_doc_serializer)
    @action(methods=("POST",), detail=False, url_path="upload_doc")
    def upload_doc_for_order(self, request: Request):
        order_id = request.data.pop('order_id')[0]
        request.data["name"] = request.data.get("file").name
        serializer = ser.DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        # Добавление документа к ордеру
        doc = models.Document.objects.get(id=serializer.data.get('id'))
        models.Order.objects.get(id=order_id).documents.add(doc)
        return Response(data='uploaded')