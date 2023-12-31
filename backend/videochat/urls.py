from django.urls import path
from .views import VideoChatRoomManagerAPI, NewVideoChatRoomAPI, \
    UpdateVideoChatRoomInvitationAPI, JoinVideoChatRoomAPI, \
    VideoChatRoomListAPI, GetAgoraTokenAPI, \
    LeaveVideoChatRoomAPI

urlpatterns = [
    path('videochat-room-manager/<int:room_id>/', VideoChatRoomManagerAPI.as_view()),
    path('new-videochat-room/', NewVideoChatRoomAPI.as_view()),
    path('videochat-invitation-update/<int:room_id>/', UpdateVideoChatRoomInvitationAPI.as_view()),
    path('join-videochat-room/', JoinVideoChatRoomAPI.as_view()),
    path('leave-videochat-room/<int:room_id>/', LeaveVideoChatRoomAPI.as_view()),
    path('videochat-room-list/', VideoChatRoomListAPI.as_view()),
    path('get-agora-token/<int:room_id>/', GetAgoraTokenAPI.as_view()),
]