from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from .models import VideoChatRooms, VideoChatRooms_Members
from .serializers import VideoChatRoomMetaContentSerializer



# Create your views here.

class VideoChatRoomManagerAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, videochat_room_id):
        try:
            item = VideoChatRooms.objects.get(id=videochat_room_id)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room Content not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        # Pass the context with the request to the serializer
        serializer = VideoChatRoomMetaContentSerializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
