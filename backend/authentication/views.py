from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer, SingleUserProfileSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class PersonalProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        data = request.data  # Assuming the request data is in JSON format

        # Check if 'display_name' or 'bio' is present in the request data
        if 'display_name' in data:
            user_profile.display_name = data['display_name']

        if 'bio' in data:
            user_profile.bio = data['bio']

        if 'avatar_name' in data:
            user_profile.avatar_name = data['avatar_name']

        user_profile.save()
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
