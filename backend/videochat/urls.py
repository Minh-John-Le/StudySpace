from django.urls import path
from .views import VideoChatRoomManagerAPI, NewVideoChatRoomAPI, \
    UpdateVideoChatRoomInvitationAPI, JoinVideoChatRoomAPI

urlpatterns = [
    path('videochat-room-manager/<int:room_id>/', VideoChatRoomManagerAPI.as_view()),
    path('new-videochat-room/', NewVideoChatRoomAPI.as_view()),
    path('videochat-invitation-update/<int:room_id>/', UpdateVideoChatRoomInvitationAPI.as_view()),
    path('join-videochat-room/', JoinVideoChatRoomAPI.as_view()),
]