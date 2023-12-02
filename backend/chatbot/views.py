from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import ChatBotMessages
from rest_framework.response import Response
from .serializers import ChatBotMessageSerializer
from rest_framework import status
import environ
import openai
from django.forms import ValidationError


env = environ.Env()
environ.Env.read_env()

# Access the OpenAI key
OPENAI_KEY = env('OpenAIKey')
openai.api_key = OPENAI_KEY

# Create your views here.


class ChatBotMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def ask_openai(self, prompt_message):
        completion = openai.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an helpful assistant."},
                {"role": "user", "content": prompt_message}
            ]
        )

        answer = completion.choices[0].message.content.strip()
        return answer

    def get(self, request):
        messages = ChatBotMessages.objects.filter(
            writer=request.user).order_by('-created_at')[:100]

        serializer = ChatBotMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        writer = request.user  # Assuming the user is authenticated

        content = request.data.get('content', '').strip()

        # Validate the content
        if not content:
            raise ValidationError("Message content is required")

        response_from_openai = self.ask_openai(content)

        # Create a new message
        message = ChatBotMessages.objects.create(
            writer=writer,
            message=content,
            response=response_from_openai
        )

        serializer = ChatBotMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
