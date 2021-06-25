import base64
import datetime
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
from backend.create_sign import CreateSign, create_sign
from backend.generation_doc import gen_doc
from backend.models import Product, Offer, Warehouse, Deal, Document, Company, SpecificationsOfProduct, \
    NameOfSpecification
from rest_framework import generics
from rest_framework.views import APIView
import json

from backend.send_doc_to_edm import send_doc, SendDocToSBIS
from backend.serializer import ProductSerializer, OfferSerializer, WarehouseSerializer, DealSerializer, \
    DocumentSerializer, CompanySerializer, SpecificationsOfProductSerializer


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class ProductListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductSpecificationsListView(generics.ListAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        query = self.get_object().specifications.all()
        data = SpecificationsOfProductSerializer(query, many=True).data
        return Response(data)



class OfferListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class OfferUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]

    queryset = Offer.objects.all()
    serializer_class = OfferSerializer


class WarehouseListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class WarehouseUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer


class CompanyListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class AcceptOffer(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]

    def post(self, request):
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

        # create_sing = CreateSign(user=user, document=doc)
        #
        # snils = '170-483-113-48'
        # inn = '638605201104'
        #
        # create_sing.find_user(inn, snils)
        # create_sing.send_file_to_cloud()
        # create_sing.init_sign()
        # create_sing.init_confirm_operation()
        # create_sing.get_document_id()
        # create_sing.get_document()

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
    authentication_classes = [CsrfExemptSessionAuthentication]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, requset):
        return render(requset, template_name='upload_doc.html')

    def post(self, request):
        file_serializer = DocumentSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()

            create_sign()
            send_doc()

            return Response("uploaded", status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
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
                    'token': base64.b64encode('{0}:{1}'.format(username, password).encode('ascii'))
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


class SpecificationsOfProductListView(generics.ListCreateAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = SpecificationsOfProduct.objects.all()
    serializer_class = SpecificationsOfProductSerializer


class SpecificationsOfProductUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    queryset = SpecificationsOfProduct.objects.all()
    serializer_class = SpecificationsOfProductSerializer
