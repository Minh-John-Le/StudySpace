

# class TestConsumer(WebsocketConsumer):
#     def connect(self):
#         self.accept()

#         self.send(text_data=json.dumps(
#             {'type': 'connection_established',
#              'message': 'You are now'}
#         ))


from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json


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
        # Remove the consumer from the group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        user_token = data.get('token')
        message_text = data.get('message')

        if user_token and message_text:
            user = await self.get_user_from_token(user_token)

            if user is not None:
                # Save the message to the database
                message = await self.save_message(user, message_text)
                user_profile = await self.get_user_profile(user)

                if message and user_profile:
                    message_data = {
                        "id": message.id,
                        "writer_avatar_name": user_profile.avatar_name,
                        "writer_name": user_profile.display_name,
                        "content": message.content,
                        "created_at": str(message.created_at),
                        "writer": user.id,
                        "room": self.room_name,
                    }

                    # Send the serialized message data to the room group
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'message_data': message_data
                        }
                    )
                else:
                    await self.close()
            else:
                await self.close()
        else:
            await self.close()

    async def chat_message(self, event):
        # Send the message to the WebSocket
        message_data = event['message_data']
        await self.send(text_data=json.dumps({
            'type': 'chat.message',
            'message_data': message_data
        }))

    @database_sync_to_async
    def save_message(self, user, message_text):
        from database.models import Messages, Rooms
        room_id = self.room_name  # Get the room ID from the URL or another source
        try:
            room = Rooms.objects.get(id=room_id)
            message = Messages(writer=user, room=room, content=message_text)
            message.save()  # Save the message to the database
            return message
        except Rooms.DoesNotExist:
            return None

    @database_sync_to_async
    def get_user_from_token(self, token):
        # Import the User model here to avoid issues
        from django.contrib.auth.models import User

        try:
            user = User.objects.get(auth_token=token)
            return user
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_user_profile(self, user):
        # Import the User model here to avoid issues
        from authentication.models import UserProfile

        try:
            user_profile = UserProfile.objects.get(user=user)
            return user_profile
        except UserProfile.DoesNotExist:
            return None
