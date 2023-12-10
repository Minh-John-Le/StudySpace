from datetime import datetime
from django.utils.timesince import timesince
from rest_framework import serializers
from .models import Rooms, Rooms_Members, Followers
from authentication.models import UserProfile


# ================================= ROOM Serializer =================================
class RoomMetaContentSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)
    host_avatar_name = serializers.SerializerMethodField(read_only=True)
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


class SingleRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'  # You can specify specific fields if needed


class RoomCardSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)
    host_avatar_name = serializers.SerializerMethodField(read_only=True)
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

    def get_host_avatar_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.avatar_name
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


class AllRoomHotTopicSerializer(serializers.ModelSerializer):
    topic = serializers.CharField()
    topic_count = serializers.IntegerField()

    class Meta:
        model = Rooms
        fields = ['topic', 'topic_count']

# ================================ Room Member ==========================================


class RoomsMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms_Members
        fields = '__all__'


class AllMembersInRoomSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    avatar_name = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='member.id')

    class Meta:
        model = Rooms_Members
        fields = '__all__'

    def get_display_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.member, 'userprofile'):
            return obj.member.userprofile.display_name
        return None

    def get_avatar_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.member, 'userprofile'):
            return obj.member.userprofile.avatar_name
        return None

# ================================= FOllOWERS Serializer =================================


class FollowStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = '__all__'


class FollowerSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    avatar_name = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='follower.id')

    class Meta:
        model = Followers
        fields = '__all__'

    def get_display_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.follower, 'userprofile'):
            return obj.follower.userprofile.display_name
        return None

    def get_avatar_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.follower, 'userprofile'):
            return obj.follower.userprofile.avatar_name
        return None


class FollowingSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    avatar_name = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Followers
        fields = '__all__'

    def get_display_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.display_name
        return None

    def get_avatar_name(self, obj):
        # Check if UserProfile exists for the follower
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.avatar_name
        return None

# ================================= MESSAGE Serializer =================================


# ================================= Top Member Serializer =================================


class TopMemberSerializer(serializers.ModelSerializer):
    display_name = serializers.CharField(
        source="user.userprofile.display_name")
    avatar_name = serializers.URLField(
        source="user.userprofile.avatar_name")
    profile_id = serializers.ReadOnlyField(source="user.id")
    follower_count = serializers.IntegerField()

    class Meta:
        model = UserProfile
        fields = '__all__'
