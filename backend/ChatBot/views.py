from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import ChatBotMessages
from rest_framework.response import Response
from .serializers import ChatBotMessageSerializer
from rest_framework import status


# Create your views here.
class RoomMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        messages = ChatBotMessages.objects.filter(
            writer=request.user).order_by('-created_at')[:100]

        serializer = ChatBotMessageSerializer(messages, many=True)
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
