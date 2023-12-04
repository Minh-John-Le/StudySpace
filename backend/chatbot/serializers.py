from rest_framework import serializers
from .models import ChatBotMessages


class ChatBotMessageSerializer(serializers.ModelSerializer):
    writer_avatar_name = serializers.SerializerMethodField()
    writer_name = serializers.SerializerMethodField()

    class Meta:
        model = ChatBotMessages
        fields = '__all__'

    def get_writer_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.writer, 'userprofile'):
            return obj.writer.userprofile.display_name
        return None

    def get_writer_avatar_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.writer, 'userprofile'):
            return obj.writer.userprofile.avatar_name
        return None
