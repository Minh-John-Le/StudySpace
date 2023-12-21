from django.urls import path
from .views import VideoChatRoomManagerAPI

urlpatterns = [
    path('videochat-room-manager/<int:videochat_room_id>/', VideoChatRoomManagerAPI.as_view()),

]