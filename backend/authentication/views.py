from rest_framework import generics, permissions
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from .serializers import UserProfileSerializer
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

class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data, status=status.HTTP_200_OK)