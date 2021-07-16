from django.http import HttpResponse
from rest_framework.authentication import SessionAuthentication
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from main.serializers.document import DocumentSerializer
from rest_framework import status
from main.create_sign import create_sign
from main.generation_doc import gen_doc
from main.send_doc_to_edm import send_doc
from django.shortcuts import render

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class UploadDoc(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        return render(request, template_name="upload_doc.html")

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
