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
    invitation_uuid = serializers.CharField(required=False)
    invitation_exp = serializers.DateTimeField(required=False)
    remaining_duration = serializers.SerializerMethodField(read_only=True)


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
            data.pop('remaining_duration', None)
            data['is_host'] = False

        return data
    
    def get_remaining_duration(self, obj):
        if obj.invitation_exp:
            remaining_time = obj.invitation_exp - datetime.now(obj.invitation_exp.tzinfo)
            if remaining_time.total_seconds() > 0:
                return {
                    'days': remaining_time.days,
                    'hours': remaining_time.seconds // 3600,
                    'minutes': (remaining_time.seconds // 60) % 60,
                }
        return None


class SingleVideoChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoChatRooms
        fields = '__all__'  


class VideoChatRoomsMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoChatRooms_Members
        fields = '__all__'


class VideoChatRoomUpdateInvitationSerializer(serializers.ModelSerializer):
    remaining_duration = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = VideoChatRooms
        fields = ['invitation_uuid', 'invitation_exp', 'remaining_duration', ]


    def get_remaining_duration(self, obj):
        if obj.invitation_exp:
            remaining_time = obj.invitation_exp - datetime.now(obj.invitation_exp.tzinfo)
            if remaining_time.total_seconds() > 0:
                return {
                    'days': remaining_time.days,
                    'hours': remaining_time.seconds // 3600,
                    'minutes': (remaining_time.seconds // 60) % 60,
                }
        return None


class RoomMemberResponseSerializer(serializers.Serializer):
    success = serializers.CharField()
    room = serializers.IntegerField()
    id = serializers.IntegerField()
    member = serializers.IntegerField()
    room_name = serializers.CharField()
    host = serializers.IntegerField()
    host_display_name = serializers.CharField()
    host_avatar_name = serializers.CharField()
    created_at = serializers.DateTimeField()
