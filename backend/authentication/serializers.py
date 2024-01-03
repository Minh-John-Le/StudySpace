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

    def validate_username(self, value):
        if not (8 <= len(value) <= 32):
            raise serializers.ValidationError(
                "Username must be between 8 and 32 characters.")
        return value

    def validate_email(self, value):
        errors = []
        if '@' not in value:
            errors.append(
                "Email must contain the '@' symbol.")

        if User.objects.filter(email=value).exists():
            errors.append("This email is already in use.")

        if errors:
            raise serializers.ValidationError(errors)

        return value

    def validate_password(self, value):
        errors = []

        if len(value) < 8:
            errors.append("Password must be at least 8 characters long.")

        if not any(char.isupper() for char in value):
            errors.append("Password must contain at least 1 UPPERCASE letter.")

        if not any(char.islower() for char in value):
            errors.append("Password must contain at least 1 lowercase letter.")

        if not any(char.isdigit() for char in value):
            errors.append("Password must contain at least 1 number.")

        if ' ' in value:
            errors.append("Password cannot contain spaces.")

        if errors:
            raise serializers.ValidationError(errors)

        return value



class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'display_name',
                  'avatar_name', 'email', 'username', 'email_verified', 'timezone']


class SingleUserProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['user', 'bio', 'display_name',
                  'avatar_name', 'followers_count', "following_count"]

    def get_followers_count(self, obj):
        # Count the number of followers for the UserProfile object (obj)
        return Followers.objects.filter(user=obj.user).count()
    
    def get_following_count(self, obj):
        # Count the number of followers for the UserProfile object (obj)
        return Followers.objects.filter(follower_id=obj.user).count()

#=================================== AUTHENTICATION UPDATE =======================================
class UpdatePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)
    old_password = serializers.CharField(required=True)

    def validate(self, value):
        new_password = value.get('new_password', '')
        confirm_password = value.get('confirm_password', '')

        if new_password != confirm_password:
            raise serializers.ValidationError({
                'new password errors': "New password and confirm password do not match."})

        # Validate the new password using the same logic as the UserSerializer
        errors = []

        if len(new_password) < 8:
            errors.append("Password must be at least 8 characters long.")

        if not any(char.isupper() for char in new_password):
            errors.append("Password must contain at least 1 UPPERCASE letter.")

        if not any(char.islower() for char in new_password):
            errors.append("Password must contain at least 1 lowercase letter.")

        if not any(char.isdigit() for char in new_password):
            errors.append("Password must contain at least 1 number.")

        if ' ' in new_password:
            errors.append("Password cannot contain spaces.")

        if errors:
            raise serializers.ValidationError({
                'new password errors': errors
            })

        return value
    
    class Meta:
        fields = '__all__'


class ResetAccountSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, value):
        new_password = value.get('new_password', '')
        confirm_password = value.get('confirm_password', '')

        if new_password != confirm_password:
            raise serializers.ValidationError({
                'new password errors': "New password and confirm password do not match."})

        # Validate the new password using the same logic as the UserSerializer
        errors = []

        if len(new_password) < 8:
            errors.append("Password must be at least 8 characters long.")

        if not any(char.isupper() for char in new_password):
            errors.append("Password must contain at least 1 UPPERCASE letter.")

        if not any(char.islower() for char in new_password):
            errors.append("Password must contain at least 1 lowercase letter.")

        if not any(char.isdigit() for char in new_password):
            errors.append("Password must contain at least 1 number.")

        if ' ' in new_password:
            errors.append("Password cannot contain spaces.")

        if errors:
            raise serializers.ValidationError({
                'new password errors': errors
            })

        return value
    
    class Meta:
        fields = '__all__'


class UpdateUsernameSerializer(serializers.Serializer):
    new_username = serializers.CharField(min_length=8, max_length=32)

    def validate_new_username(self, value):
        existing_user = User.objects.filter(username=value).exclude(pk=self.instance.pk).first()
        if existing_user:
            raise serializers.ValidationError("This username is already in use.")
        return value
    

class UpdateEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField()

    def validate_new_email(self, value):
        errors = []

        # Check if email contains '@' symbol
        if '@' not in value:
            errors.append("Email must contain the '@' symbol.")

        # Check if email is already in use
        if User.objects.filter(email=value).exists():
            errors.append("This email is already in use.")

        if errors:
            raise serializers.ValidationError(errors)

        return value