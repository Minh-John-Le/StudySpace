from rest_framework import serializers
from .models import ChatBotMessages


class ChatBotMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatBotMessages
        fields = '__all__'  # You can specify specific fields if needed
