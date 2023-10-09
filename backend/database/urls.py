from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import RoomCardAPI, FollowStatusAPI, FollowerAPI, FollowingAPI

urlpatterns = [
    path('room-card/', RoomCardAPI.as_view()),
    path('follow-status/<int:id>/', FollowStatusAPI.as_view()),
    path('follower/<int:id>/', FollowerAPI.as_view()),
    path('following/<int:id>/', FollowingAPI.as_view()),

]
