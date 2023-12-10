from django.shortcuts import render
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Messages
from .serializers import RoomMessageSerializer, MemberRecentMessageSerializer
from django.forms import ValidationError



# Create your views here.
# ======================= REST API for Message In Room================================================


class RoomMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        messages = Messages.objects.filter(
            room=room_id).order_by('-created_at')[:100]

        serializer = RoomMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, room_id):
        writer = request.user  # Assuming the user is authenticated

        content = request.data.get('content', '').strip()

        # Validate the content
        if not content:
            raise ValidationError("Message content is required")

        # Create a new message
        message = Messages.objects.create(
            writer=writer,
            room_id=room_id,
            content=content
        )

        serializer = RoomMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MemberRecentMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        messages = Messages.objects.filter(
            writer=user_id).order_by('-created_at')[:10]

        serializer = MemberRecentMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
