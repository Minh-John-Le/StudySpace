from datetime import datetime
from django.utils.timesince import timesince
from rest_framework import serializers
from .models import VideoChatRooms, VideoChatRooms_Members
from authentication.models import UserProfile


# ================================= ROOM Serializer =================================

class VideoChatRoomMetaContentSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)
    host_avatar_name = serializers.SerializerMethodField(read_only=True)
    created_ago = serializers.SerializerMethodField(read_only=True)
    invitation_uuid = serializers.CharField(write_only=True, required=False)
    invitation_exp = serializers.DateTimeField(write_only=True, required=False)

    class Meta:
        model = VideoChatRooms
        fields = '__all__'

    def get_host_display_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.display_name
        except UserProfile.DoesNotExist:
            return "StudySpace User"

    def get_host_avatar_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.avatar_name
        except UserProfile.DoesNotExist:
            return ""

    def get_created_ago(self, obj):
        if obj.created_at:
            created_at = datetime.fromisoformat(str(obj.created_at))
            time_difference = timesince(created_at)
            return time_difference
        return ""

    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = self.context['request'].user

        if user == instance.host:
            # If the user is the host, include invitation_uuid and invitation_exp
            data['is_host'] = True
        else:
            # If the user is not the host, hide invitation_uuid and invitation_exp
            data.pop('invitation_uuid', None)
            data.pop('invitation_exp', None)
            data['is_host'] = False

        return data

