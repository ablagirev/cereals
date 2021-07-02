from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import generics, serializers
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from main.create_sign import create_sign
from main.generation_doc import gen_doc
from main.models import (
    Product,
    Offer,
    Warehouse,
    Deal,
    Document,
    Company,
    SpecificationsOfProduct,
)
from main.send_doc_to_edm import send_doc
from main.serializer import (
    ProductSerializer,
    OfferSerializer,
    WarehouseSerializer,
    DealSerializer,
    DocumentSerializer,
    CompanySerializer,
    SpecificationsOfProductSerializer,
    OfferPostSerializer,
    LoginOut,
    inline_serializer,
    DetailOut,
)


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class ProductListView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductSpecificationsListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        query = self.get_object().specifications.all()
        data = SpecificationsOfProductSerializer(query, many=True).data
        return Response(data)


class OfferListView(generics.ListCreateAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = [IsAuthenticated]

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = OfferPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {"Location": str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}


class OfferUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class WarehouseListView(generics.ListCreateAPIView):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class WarehouseUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class CompanyListView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class AcceptOffer(APIView):
    def post(self, request):
        """Важная ручка"""
        offer = Offer.objects.first()
        company = Company.objects.first()
        product = Product.objects.get(id=2)
        deal = Deal.objects.first()
        # deal.date_start_of_contract = datetime.date(2021, 1, 27)
        # deal.date_finish_of_contract = datetime.date(2021, 12, 31)
        # deal.date_start_of_spec = datetime.date(2021, 1, 27)
        # deal.date_start_shipment = datetime.date(2021, 1, 27)
        # deal.date_finish_shipment = datetime.date(2021, 2, 28)
        # deal.save()

        # ---- Генерация документов
        gen_doc(offer, company, product, deal)
        # ----
        # deal = Deal()
        # deal.offer = offer
        # deal.provider = user
        # deal.status = 'CREATE'
        # deal.save()
        # deal.documents.set(Document.objects.all())
        # deal.save()
        ds = DealSerializer(deal)
        return Response(ds.data)


class CreateSignView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]

    def get(self, request):
        deal = Deal.objects.first()
        user = User.objects.first()
        doc = Document.objects.last()

        # ----- Отправка запроса на подписание
        create_sign()

        # -----
        deal.status = "Doc signed"
        deal.save()
        # ----- Отправка документов в ЭДО
        send_doc()

        # -----
        ds = DealSerializer(deal)
        return Response(ds.data)


class UploadDoc(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, requset):
        return render(requset, template_name="upload_doc.html")

    def post(self, request):
        request.data["name"] = request.data["file"].name
        file_serializer = DocumentSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()

            create_sign()
            link_to_cabinet = send_doc()

            return HttpResponse(link_to_cabinet, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    permission_classes = [AllowAny]
    input_serializer = inline_serializer(
        "LoginSerializer",
        {
            "username": serializers.CharField(required=True),
            "password": serializers.CharField(required=True),
        },
    )

    @extend_schema(responses={200: LoginOut, 403: DetailOut}, request=input_serializer)
    def post(self, request, format=None):
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


class SpecificationsOfProductListView(generics.ListCreateAPIView):
    queryset = SpecificationsOfProduct.objects.all()
    serializer_class = SpecificationsOfProductSerializer


class SpecificationsOfProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SpecificationsOfProduct.objects.all()
    serializer_class = SpecificationsOfProductSerializer
