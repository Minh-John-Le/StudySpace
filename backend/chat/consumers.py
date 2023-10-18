

# class TestConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()

#         self.send(text_data=json.dumps(
#             {'type': 'connection_established',
#              'message': 'You are now'}
#         ))


from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Perform disconnection logic here
        pass

    async def receive(self, text_data):
        # Handle received data here
        pass


    
