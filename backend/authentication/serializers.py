# api/serializers.py
from django.db import IntegrityError
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from database.models import Followers
from .models import UserProfile  # Import your UserProfile model
from django.http import Http404


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'display_name',
                  'avatar_name', 'email', 'username']


class SingleUserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'display_name',
                  'avatar_name', 'followers_count']

    def get_followers_count(self, obj):
        # Count the number of followers for the UserProfile object (obj)
        return Followers.objects.filter(user=obj.user).count()
