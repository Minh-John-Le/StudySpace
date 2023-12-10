from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RoomMessageAPI, MemberRecentMessageAPI

urlpatterns = [
    path('room-message/<int:room_id>/', RoomMessageAPI.as_view()),
    path('recent-message/<int:user_id>/', MemberRecentMessageAPI.as_view()),
]