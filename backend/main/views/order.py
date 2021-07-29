import datetime
import json
from dataclasses import dataclass

from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from main.views.mixins import UpdateViewSetMixin
from .. import models
from .. import serializers as ser
from ..enums import DocumentTypes
from ..serializers import OrderSerializer, DetailOut
from ..serializers.steps import (
    Step1Docs,
    StepBlockMobile,
    StepWeb,
)


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


@dataclass
class Step1DocPayload:
    specification: models.Document
    for_sign: models.Document
    bill: models.Document
    createdAt: datetime


class StepsViewSet(ViewSet):
    @extend_schema(responses={200: Step1Docs, 403: DetailOut})
    @action(methods=["GET"], detail=False)
    def get_step_1_docs(self, request, order_id: int):
        order = models.Order.objects.get(id=order_id)
        docs = {
            doc.type.value: doc
            for doc in order.documents.filter(
                Q(type=DocumentTypes.specification.value)
                | Q(type=DocumentTypes.contract_for_signing.value)
                | Q(type=DocumentTypes.payment_invoice.value)
            )
        }
        if any(
            (
                DocumentTypes.specification.value not in docs,
                DocumentTypes.contract_for_signing.value not in docs,
                DocumentTypes.payment_invoice.value not in docs,
            )
        ):
            raise ValidationError(detail="Не все документы готовы на выдачу")
        payload = Step1DocPayload(
            specification=docs.get("specification"),
            for_sign=docs.get("for_sign"),
            bill=docs.get("bill"),
            createdAt=datetime.datetime.now(),
        )
        return Response(Step1Docs(instance=payload).data)

    @extend_schema(responses={200: StepWeb(many=True), 403: DetailOut})
    @action(methods=["GET"], detail=False, url_path="web", url_name="")
    def steps(self, request):
        return Response(
            json.dumps(
                [
                    {
                        "stage": "step1",
                        "blocks": [
                            {
                                "type": "docs",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps(
                                    [
                                        {
                                            "title": "Договор на подписание",
                                            "link": "http://www.africau.edu/images/default/sample.pdf",
                                            "format": "pdf",
                                        },
                                        {
                                            "title": "Спецификация",
                                            "link": "http://www.africau.edu/images/default/sample.pdf",
                                            "format": "pdf",
                                        },
                                        {
                                            "title": "Счет на оплату",
                                            "link": "http://www.africau.edu/images/default/sample.pdf",
                                            "format": "pdf",
                                        },
                                    ]
                                ),
                            },
                        ],
                    },
                    {
                        "stage": "step2",
                        "blocks": [
                            {
                                "type": "title",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps(
                                    "Проверка будет произведена по месту хранения:\n Москва"
                                ),
                            },
                            {
                                "type": "action",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps({"code": "specialist-on-way"}),
                            },
                        ],
                    },
                    {
                        "stage": "step3",
                        "blocks": [
                            {
                                "type": "title",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps(
                                    "Проверка будет произведена по месту хранения:\n Москва"
                                ),
                            },
                            {
                                "type": "action-file",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps(
                                    {"code": "certificate", "title": ""}
                                ),
                            },
                            {
                                "type": "heading",
                                "datetime": "2021-07-28T18:21:04.717Z",
                                "value": json.dumps(
                                    {"isExcepted": False, "title": "Зерно не подойдет"}
                                ),
                            },
                        ],
                    },
                ]
            )
        )

    @extend_schema(responses={200: StepBlockMobile(many=True), 403: DetailOut})
    @action(methods=["GET"], detail=False)
    def step1(self, request):
        return Response(
            json.dumps(
                [
                    {
                        "type": "empty",
                        "value": json.dumps("Документы сформированы"),
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                    {
                        "type": "docs",
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                        "value": json.dumps(
                            [
                                {
                                    "title": "Договор на подписание",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                                {
                                    "title": "Спецификация",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                                {
                                    "title": "Счет на оплату",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                            ]
                        ),
                    },
                ]
            )
        )

    @extend_schema(responses={200: StepBlockMobile(many=True), 403: DetailOut})
    @action(methods=["GET"], detail=False)
    def step2(self, request):
        return Response(
            json.dumps(
                [
                    {
                        "type": "empty",
                        "value": json.dumps(
                            "Назначен специалист на проверку качества по адресу"
                        ),
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                    {
                        "type": "address",
                        "status": True,
                        "value": json.dumps({"address": "г Москва ул Тверская"}),
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                    {
                        "type": "empty",
                        "status": True,
                        "value": json.dumps("Специалист выехал по адресу"),
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                ]
            )
        )

    @extend_schema(responses={200: StepBlockMobile(many=True), 403: DetailOut})
    @action(methods=["GET"], detail=False)
    def step3(self, request):
        return Response(
            json.dumps(
                [
                    {
                        "type": "empty",
                        "value": json.dumps("Документы подписаны с двух сторон"),
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                    {
                        "type": "docs",
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                        "value": json.dumps(
                            [
                                {
                                    "title": "Договор",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                                {
                                    "title": "Спецификация",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                            ]
                        ),
                    },
                    {
                        "type": "empty",
                        "value": json.dumps("Покупатель произвел оплату"),
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                    },
                    {
                        "type": "docs",
                        "status": True,
                        "datetime": "2021-07-28T18:21:04.717Z",
                        "value": json.dumps(
                            [
                                {
                                    "title": "Платежное поручение",
                                    "link": "http://www.africau.edu/images/default/sample.pdf",
                                    "format": "pdf",
                                },
                            ]
                        ),
                    },
                ]
            )
        )
