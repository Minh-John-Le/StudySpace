from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import SignupView, PersonalProfileView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('personal-profile/', PersonalProfileView.as_view()),
]
