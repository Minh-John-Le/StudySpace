from rest_framework import serializers
from .models import Rooms, Users_Rooms
from authentication.models import UserProfile

class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'  # You can specify specific fields if needed

class UsersRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users_Rooms
        fields = '__all__'  # You can specify specific fields if needed

class RoomCardSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rooms
        fields = '__all__'

    def get_host_display_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.display_name
        except UserProfile.DoesNotExist:
            return "StudySpace User"
