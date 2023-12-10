
from datetime import datetime
from django.utils.timesince import timesince
from rest_framework import serializers
from .models import  Messages

class RoomMessageSerializer(serializers.ModelSerializer):
    writer_avatar_name = serializers.SerializerMethodField()
    writer_name = serializers.SerializerMethodField()

    class Meta:
        model = Messages
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


class MemberRecentMessageSerializer(serializers.ModelSerializer):
    writer_avatar_name = serializers.SerializerMethodField()
    writer_name = serializers.SerializerMethodField()
    room_name = serializers.SerializerMethodField()
    created_ago = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Messages
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

    def get_room_name(self, obj):
        return obj.room.room_name

    def get_created_ago(self, obj):
        if obj.created_at:
            created_at = datetime.fromisoformat(str(obj.created_at))
            time_difference = timesince(created_at)

            return time_difference

        return ""

