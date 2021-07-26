from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import serializers

from main.views.mixins import UpdateViewSetMixin
from .. import models
from ..serializers import OrderSerializer, DetailOut
from .. import serializers as ser
from ..serializers.steps import Step1Docs


@extend_schema(tags=["order"])
class OrderViewSet(UpdateViewSetMixin, ModelViewSet):
    queryset = models.Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.action == "list":
            return (
                super()
                .get_queryset()
                .filter(
                    Q(customer_id=self.request.user.id)
                    | Q(provider_id=self.request.user.id)
                )
                .distinct()
            )
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
        """
        Ручка для загрузки документов.
        orderId - это ИД ордера к которому нужно прикрепить этот документ.
        typeDoc - Тип документа. Указать один из вариантов ниже.
        Например specification. Если ни один не подходит, то указываем other.
        file - сам файл, отправляем через form-data.

        Типы документов:
            other: "Прочее",
            specification: "Спецификация",
            contract_for_signing: "Договор на подписание",
            payment_invoice: "Счет на оплату",
            quality_certificate: "Сертификат качества",
            contract: "Договор",
            payment_order: "Платежное поручение",
            verification_act: "Акт сверки",
            book_of_purchases_or_sales: "Книга покупок/продаж",
            letter_for_refund: "Письмо на возврат",
            loading_plan: "План погрузки",
            report_on_the_shipped_goods: "Отчет о погруженном товаре",
            additional_payment_invoice: "Счет на доплату",
        """
        order_id = request.data.pop("order_id")[0]
        request.data["name"] = request.data.get("file").name
        serializer = ser.DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        # Добавление документа к ордеру
        doc = models.Document.objects.get(id=serializer.data.get("id"))
        models.Order.objects.get(id=order_id).documents.add(doc)
        return Response(data="uploaded")


class StepsViewSet(ViewSet):
    @action(methods=("GET",), detail=False)
    @extend_schema(responses={200: Step1Docs, 403: DetailOut})
    def get_step_1_docs(self):
        return {
            "forSign": "",
            "specification": "",
            "bill": "",
        }
