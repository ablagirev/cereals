from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import Serializer


class UpdateViewSetMixin:
    partial_update_serializer = None
    serializer_class = None
    partial_update_output_serializer = None

    def get_partial_update_instance(self):
        # noinspection PyUnresolvedReferences
        return self.get_object()

    def apply_partial_update(self, instance, validated_data):
        pass

    def partial_update(self, request, *args, **kwargs):
        # noinspection PyUnresolvedReferences
        self.kwargs["partial"] = True
        serializer: Serializer = self.partial_update_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # noinspection PyUnresolvedReferences
        instance = self.get_partial_update_instance()
        instance = self.apply_partial_update(instance, serializer.validated_data)
        return Response(
            status=status.HTTP_200_OK,
            data=self.partial_update_output_serializer(instance=instance).data,
        )
