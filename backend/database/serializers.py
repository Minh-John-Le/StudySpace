from datetime import datetime
from django.utils.timesince import timesince
from rest_framework import serializers
from .models import Rooms, Rooms_Members, Followers
from authentication.models import UserProfile


class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'  # You can specify specific fields if needed


class SingleRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'  # You can specify specific fields if needed


class RoomsMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms_Members
        fields = '__all__'  # You can specify specific fields if needed


class RoomCardSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)
    host_image_url = serializers.SerializerMethodField(read_only=True)
    total_member = serializers.SerializerMethodField(read_only=True)
    created_ago = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rooms
        fields = '__all__'

    def get_host_display_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.display_name
        except UserProfile.DoesNotExist:
            return "StudySpace User"

    def get_host_image_url(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.profile_image_url
        except UserProfile.DoesNotExist:
            return ""

    def get_total_member(self, obj):
        try:
            # Count the number of Users_Rooms records related to the current room
            member_count = Rooms_Members.objects.filter(room=obj).count()
            return member_count
        except Exception as e:
            return 0  # Return 0 in case of an error

    def get_created_ago(self, obj):
        if obj.created_at:
            created_at = datetime.fromisoformat(str(obj.created_at))

            time_difference = timesince(created_at)

            return time_difference

        return ""


class FollowStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = '__all__'


class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = '__all__'


class FollowerSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='follower.id')

    class Meta:
        model = Followers
        fields = '__all__'

    def get_display_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.follower, 'userprofile'):
            return obj.follower.userprofile.display_name
        return None

    def get_profile_image_url(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.follower, 'userprofile'):
            return obj.follower.userprofile.profile_image_url
        return None


class FollowingSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Followers
        fields = '__all__'

    def get_display_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.display_name
        return None

    def get_profile_image_url(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.profile_image_url
        return None
