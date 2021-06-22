import base64

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import routers, serializers, viewsets, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from Daylesford.settings import BASE_DIR
from backend.create_sign import create_sign, CreateSign
from backend.generation_doc import gen_doc
from backend.models import Product, Offer, Warehouse, Deal, Document, Company
from rest_framework import generics
from rest_framework.views import APIView
import json

from backend.send_doc_to_edm import send_doc, SendDocToSBIS
from backend.serializer import ProductSerializer, OfferSerializer, WarehouseSerializer, DealSerializer, \
    DocumentSerializer, CompanySerializer


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening

class ProductListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class OfferListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class OfferUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
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
        offer = Offer.objects.first()
        user = User.objects.first()
        offer.save()
        # ---- Генерация документов
        gen_doc()
        # ----
        deal = Deal()
        deal.offer = offer
        deal.provider = user
        deal.status = 'CREATE'
        deal.save()
        deal.documents.set(Document.objects.all())
        deal.save()
        ds = DealSerializer(deal)
        return Response(ds.data)


class CreateSignView(APIView):
    def get(self, request):
        deal = Deal.objects.first()
        user = User.objects.first()
        doc = Document.objects.last()

        # ----- Отправка запроса на подписание

        create_sing = CreateSign(user=user, document=doc)

        snils = '170-483-113-48'
        inn = '638605201104'

        create_sing.find_user(inn, snils)
        create_sing.send_file_to_cloud()
        create_sing.init_sign()
        create_sing.init_confirm_operation()
        create_sing.get_document_id()
        create_sing.get_document()

        # -----
        deal.status = 'Doc signed'
        deal.save()
        # ----- Отправка документов в ЭДО

        send_doc = SendDocToSBIS(doc)
        send_doc.authorization()
        send_doc.load_doc()
        send_doc.load_sign()

        # -----
        ds = DealSerializer(deal)
        return Response(ds.data)


class UploadDoc(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        print(request.data)
        file_serializer = DocumentSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        data = request.data

        username = data.get('username', None)
        password = data.get('password', None)

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_active:
                login(request, user)

                data = {
                    'type': 'Basic',
                    'token': base64.b64encode('{0}:{1}'.format(username,password).encode('ascii'))
                }

                return Response(data=data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
