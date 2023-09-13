from rest_framework import serializers
from .models import Rooms, Rooms_Members
from authentication.models import UserProfile

class RoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms
        fields = '__all__'  # You can specify specific fields if needed

class UsersRoomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rooms_Members
        fields = '__all__'  # You can specify specific fields if needed

class RoomCardSerializer(serializers.ModelSerializer):
    host_display_name = serializers.SerializerMethodField(read_only=True)
    total_member = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Rooms
        fields = '__all__'

    def get_host_display_name(self, obj):
        try:
            profile = UserProfile.objects.get(user=obj.host)
            return profile.display_name
        except UserProfile.DoesNotExist:
            return "StudySpace User"
        
    def get_total_member(self, obj):
        try:
            # Count the number of Users_Rooms records related to the current room
            member_count = Rooms_Members.objects.filter(room=obj).count()
            return member_count
        except Exception as e:
            return 0  # Return 0 in case of an error
            
        
    
