from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import SignupView, PersonalProfileView, SingleUserProfileView, TokenValidationView, \
    SendEmailAPIView, UpdatePasswordView, UpdateUsernameView, VerifyEmailView, \
    UnbindEmailView, RefreshSecurityTokenView, UpdateEmailView, \
    SendVerifyEmailView, SendUnbindEmailView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', obtain_auth_token, name='api_token_auth'),
    path('profile/', PersonalProfileView.as_view()),
    path('user/<int:id>/', SingleUserProfileView.as_view()),
    path('validate-token/', TokenValidationView.as_view()),
    path('send-email/', SendEmailAPIView.as_view(), name='send_email'),
    #------------------ Authentication Update -------------------------
    path('update-password/', UpdatePasswordView.as_view()),
    path('update-username/', UpdateUsernameView.as_view()),
    path('update-email/', UpdateEmailView.as_view()),
    #------------------ Verify Account -------------------------
    path('verify-email/', VerifyEmailView.as_view()),
    path('send-verify-email/', SendVerifyEmailView.as_view()),
    path('unbind-email/', UnbindEmailView.as_view()),
    path('send-unbind-email/', SendUnbindEmailView.as_view()),
    path('refresh-security-token/', RefreshSecurityTokenView.as_view()),

]
