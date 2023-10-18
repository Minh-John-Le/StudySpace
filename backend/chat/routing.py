from django.urls import path
from . import consumers

websocket_urlpatterns = [
#    path('ws/socket-server/', consumers.TestConsumer.as_asgi()),
    path('ws/room/<int:room_id>/', consumers.ChatConsumer.as_asgi())

]
