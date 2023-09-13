from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RoomCardAPI

urlpatterns = [
    path('room-card/', RoomCardAPI.as_view()),

]
