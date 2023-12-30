from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import SignupView, PersonalProfileView, SingleUserProfileView, TokenValidationView, \
    SendEmailAPIView, UpdatePasswordView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('profile/', PersonalProfileView.as_view()),
    path('user/<int:id>/', SingleUserProfileView.as_view()),
    path('validate-token/', TokenValidationView.as_view()),
    path('send-email/', SendEmailAPIView.as_view(), name='send_email'),
    path('update-password/', UpdatePasswordView.as_view()),

]
