from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RoomCardAPI, FollowStatusAPI, FollowerAPI, FollowingAPI, \
    NewRoomAPI, SingleMemberInRoomAPI, RoomMessageAPI, RoomManagerAPI, \
    AllMembersInRoomAPI, TopMembersAPI, MemberRecentMessageAPI, \
    AllRoomHotTopicAPI, ProfileRoomCardAPI

urlpatterns = [
    path('room-card/', RoomCardAPI.as_view()),
    path('follow-status/<int:id>/', FollowStatusAPI.as_view()),
    path('follower/<int:id>/', FollowerAPI.as_view()),
    path('following/<int:id>/', FollowingAPI.as_view()),
    path('new-room/', NewRoomAPI.as_view()),
    path('member-in-room/<int:room_id>/', SingleMemberInRoomAPI.as_view()),
    path('all-member-in-room/<int:room_id>/', AllMembersInRoomAPI.as_view()),
    path('room-message/<int:room_id>/', RoomMessageAPI.as_view()),
    path('recent-message/<int:user_id>/', MemberRecentMessageAPI.as_view()),
    path('room-manager/<int:room_id>/', RoomManagerAPI.as_view()),
    path('top-member/', TopMembersAPI.as_view()),
    path('top-topic/', AllRoomHotTopicAPI.as_view()),
    path('user-room/<int:user_id>/', ProfileRoomCardAPI.as_view()),

]
