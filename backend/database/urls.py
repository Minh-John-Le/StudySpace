from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RoomCardAPI, FollowStatusAPI, FollowerAPI, FollowingAPI, \
    NewRoomAPI, SingleMemberInRoomAPI, RoomMessageAPI, RoomMetaContentAPI, \
    AllMembersInRoomAPI

urlpatterns = [
    path('room-card/', RoomCardAPI.as_view()),
    path('follow-status/<int:id>/', FollowStatusAPI.as_view()),
    path('follower/<int:id>/', FollowerAPI.as_view()),
    path('following/<int:id>/', FollowingAPI.as_view()),
    path('new-room/', NewRoomAPI.as_view()),
    path('member-in-room/<int:room_id>/', SingleMemberInRoomAPI.as_view()),
    path('all-member-in-room/<int:room_id>/', AllMembersInRoomAPI.as_view()),
    path('room-message/<int:room_id>/', RoomMessageAPI.as_view()),
    path('room-meta-content/<int:room_id>/', RoomMetaContentAPI.as_view()),

]
