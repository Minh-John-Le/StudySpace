from django.urls import path
from .views import ChatBotMessageAPI

urlpatterns = [
    path('', ChatBotMessageAPI.as_view()),

]
