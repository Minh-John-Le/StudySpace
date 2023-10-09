# api/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserProfile  # Import your UserProfile model
from django.http import Http404


class UserSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'repeat_password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['repeat_password']:
            raise serializers.ValidationError(
                {"password_validation_errors": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('repeat_password')
        user = User.objects.create_user(**validated_data)

        # Create a user profile for the newly created user
        UserProfile.objects.create(user=user, display_name=user.username)

        # Generate a token for the user
        token, _ = Token.objects.get_or_create(user=user)
        user.token = token.key
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user', 'display_name', 'profile_image_url']

