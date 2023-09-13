from rest_framework import generics, permissions
from .serializers import UserSerializer


class SignupView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
