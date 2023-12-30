from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer, SingleUserProfileSerializer, \
    UpdatePasswordSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db import models, transaction
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings 


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
                return Response({'detail': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

            # Update the password
            new_password = serializer.validated_data['new_password']
            user.set_password(new_password)
            user.save()

            return Response({'success': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
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


