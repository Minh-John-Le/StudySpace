from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile, SecurityToken
from .serializers import UserProfileSerializer, SingleUserProfileSerializer, \
    UpdatePasswordSerializer, UpdateUsernameSerializer, UpdateEmailSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db import models, transaction
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings 
from django.contrib.auth import authenticate
import datetime
from django.utils import timezone
import uuid



class SignupView(generics.CreateAPIView):
    def post(self, request):
        try:
            with transaction.atomic():
                username = request.data.get('username', '')
                email = request.data.get('email', '')
                password = request.data.get('password', '')
                repeat_password = request.data.get('repeat_password', '')
                display_name = request.data.get('display_name', '')

                if password != repeat_password:
                    raise serializers.ValidationError(
                        {"password_validation_errors": "Password and repeat password do not match."})

                # Create the user and save it within the transaction
                user_data = {
                    'username': username,
                    'email': email,
                    'password': password,
                }
                user_serializer = UserSerializer(data=user_data)

                if not user_serializer.is_valid():
                    raise serializers.ValidationError(user_serializer.errors)

                user = User.objects.create_user(
                    username=username, email=email, password=password)

                token, created = Token.objects.get_or_create(user=user)

                # Create the user profile within the same transaction
                user_profile_data = {
                    'user': user.id,
                    'display_name': display_name,
                    'avatar_name': display_name,
                }

                user_profile_serializers = UserProfileSerializer(
                    data=user_profile_data)

                if not user_profile_serializers.is_valid():
                    raise serializers.ValidationError(
                        user_profile_serializers.errors)

                user_profile_serializers.save()

                return Response({'message': 'User and profile created successfully'}, status=status.HTTP_201_CREATED)

        except serializers.ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PersonalProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(
            user_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SingleUserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            user_profile = UserProfile.objects.get(user=id)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if the user being searched for is the same as the authenticated user
        is_authenticated_user = False
        if request.user.id == id:
            is_authenticated_user = True

        serializer = SingleUserProfileSerializer(user_profile)
        data = serializer.data
        data['is_auth_user'] = is_authenticated_user
        return Response(data, status=status.HTTP_200_OK)
    
class TokenValidationView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # If the request reached here, it means the token is valid
        return Response({'valid': True}, status=status.HTTP_200_OK)

#==================================== AUTHENTICATION UPDATE =====================================  
#------------------------------------ Generate Authentication Token -------------------------------------

#------------------------------------ Update Authentication -------------------------------------
class UpdatePasswordView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        serializer = UpdatePasswordSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']

            # Check if the old password is correct
            if not user.check_password(old_password):
                return Response({'error': {'Old password':'Old password is incorrect.'}}, status=status.HTTP_400_BAD_REQUEST)

            # Update the password
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()

            return Response({'success': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUsernameView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        current_password = request.data.get('current_password', '')
        user = authenticate(username=request.user.username, password=current_password)

        if user:
            serializer = UpdateUsernameSerializer(data=request.data, instance=request.user)

            if serializer.is_valid():
                new_username = serializer.validated_data['new_username']
                request.user.username = new_username
                request.user.save()
                return Response({'success': True, 'message': 'Username updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'success': False, 'error': {'password':'Authentication failed. Please provide the correct current password.'}}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateEmailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        current_password = request.data.get('current_password', '')
        user = authenticate(username=request.user.username, password=current_password)

        if not user:
            return Response({'success': False, 'error': {'password':'Authentication failed. Please provide the correct current password.'}}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user_profile = UserProfile.objects.get(user=request.user)

            if not user_profile or user_profile.email_verified:
                return Response({'error': {'Please unbind email before updating it'}}, status=status.HTTP_400_BAD_REQUEST)

            new_email = request.data.get('new_email', '')
            email_validation_serializer = UpdateEmailSerializer(data={'new_email': new_email})
            if not email_validation_serializer.is_valid():
                return Response({'error': email_validation_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
 
            request.user.email = new_email
            request.user.save()

            return Response({'success': 'Email updated successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle any other exceptions if needed
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#------------------------------------ Verify Authentication -------------------------------------
class VerifyEmailView(APIView):
    def patch(self, request):
        token_value = request.data.get('token_value', '')
        token_type = request.data.get('token_type', 'email_verify')

        try:
            with transaction.atomic():
                # Find the token
                token = SecurityToken.objects.get(token_value=token_value, token_type=token_type, used=False)

                if not token:
                        return Response({'message': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)


                            # Check if the invitation has not expired
                if token.expire_at and token.expire_at < timezone.now():
                    return Response(
                        {"error": {"invitation_expired": "Invitation has expired."}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Mark the token as used
                token.used = True
                token.save()

                user = token.user

                # Update email_verified to False in UserProfile
                user_profile = UserProfile.objects.get(user=user)
                user_profile.email_verified = True
                user_profile.save()
            
                return Response({'message': 'Verify Email successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            # Token not found or expired
            return Response({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class UnbindEmailView(APIView):
    def patch(self, request):
        token_value = request.data.get('token_value', '')
        token_type = request.data.get('token_type', 'email_unbind')

        try:
            with transaction.atomic():
                # Find the token
                token = SecurityToken.objects.get(token_value=token_value, token_type=token_type, used=False)

                if not token:
                        return Response({'message': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)


                            # Check if the invitation has not expired
                if token.expire_at and token.expire_at < timezone.now():
                    return Response(
                        {"error": {"invitation_expired": "Invitation has expired."}},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Mark the token as used
                token.used = True
                token.save()

                user = token.user

                # Update email_verified to False in UserProfile
                user_profile = UserProfile.objects.get(user=user)
                user_profile.email_verified = False
                user_profile.save()
            
                return Response({'message': 'Unbind Email successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            # Token not found or expired
            return Response({'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RefreshSecurityTokenView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token_type = request.data.get('token_type', '')

        # Find the user's token based on token_type
        try:
            user = request.user
            token = SecurityToken.objects.get(user=user, token_type=token_type)

            # Update the existing token with a new uuid4 and expire time is 24 hours from now
            token.token_value = uuid.uuid4()
            token.expire_at = timezone.now() + timezone.timedelta(days=1)
            token.used = False
            token.save()

            return Response({'token_value': str(token.token_value), 'token_type': token.token_type}, status=status.HTTP_200_OK)
        except SecurityToken.DoesNotExist:
            # Create a new token if it doesn't exist
            new_token = SecurityToken.objects.create(user=user, token_type=token_type, expire_at=timezone.now() + timezone.timedelta(days=1))

            return Response({'token_value': str(new_token.token_value), 'token_type': new_token.token_type}, status=status.HTTP_200_OK)
        except Exception as e:
            # Raise a more specific error for other exceptions
            raise ValueError(f"An error occurred: {str(e)}")



class SendEmailAPIView(APIView):
    def post(self, request):
        subject = request.data.get('subject', '')
        message = request.data.get('message', '')
        recipient = request.data.get('recipient', '')
        html_message = """<p>This is an HTML-formatted message.</p>
    <a href="https://example.com">This is a link</a>"""


        if subject and message and recipient:
            try:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [recipient], html_message=html_message)
                return Response({'success': True, 'message': 'Email sent successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'success': False, 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'success': False, 'message': 'Missing required data'}, status=status.HTTP_400_BAD_REQUEST)


