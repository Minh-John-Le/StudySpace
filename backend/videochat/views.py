from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
import uuid
from django.utils import timezone
from django.db import models, transaction
from .models import VideoChatRooms, VideoChatRooms_Members
from .serializers import VideoChatRoomMetaContentSerializer, SingleVideoChatRoomSerializer, \
    VideoChatRoomsMembersSerializer, VideoChatRoomUpdateInvitationSerializer



# Create your views here.
#====================================================================================
#------------ Get Room Meta Data --------------------------------------------
class VideoChatRoomManagerAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            item = VideoChatRooms.objects.get(id=room_id)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room Content not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        # Pass the context with the request to the serializer
        serializer = VideoChatRoomMetaContentSerializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


#----------------- Create new room --------------------------------------------
class NewVideoChatRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
            try:
                with transaction.atomic():
                    room_name = request.data.get('room_name', '')
                    description = request.data.get('description', '')

                    existing_data = {
                        'description': description,
                        'room_name': room_name,
                    }

                    # Generate a random UUID
                    invitation_uuid = str(uuid.uuid4())

                    # Set expiration date to 1 day away from the creation date
                    expiration_date = timezone.now() + timezone.timedelta(days=1)

                    # Append additional data
                    additional_data = {
                        "host": request.user.id,
                        "invitation_uuid": invitation_uuid,
                        "invitation_exp": expiration_date,
                    }

                    # Combine existing data and additional data
                    updated_data = {**existing_data, **additional_data}
                    serialized_item = SingleVideoChatRoomSerializer(data=updated_data)

                    if not serialized_item.is_valid():
                        raise serializers.ValidationError(
                            serialized_item.errors)
                    serialized_item.save()

                    # After creating the room, get the room_id
                    room_id = serialized_item.instance.id

                    # Create a new entry in the Rooms_Members table
                    room_member_data = {
                        'member': request.user.id,
                        'room': room_id,
                        'is_host': True,
                    }
                    room_member_serializer = VideoChatRoomsMembersSerializer(
                        data=room_member_data)
                    if not room_member_serializer.is_valid():
                        raise serializers.ValidationError(
                            room_member_serializer.errors)
                    room_member_serializer.save()

                    return Response(serialized_item.data, status=status.HTTP_200_OK)
            except serializers.ValidationError as e:
                return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                error_message = str(e)
                return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

#----------------- Update room invitation uuid --------------------------------------------
class UpdateVideoChatRoomInvitationAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, room_id):
        try:
            # Check if the user is the host of the room
            room_member = VideoChatRooms_Members.objects.get(room_id=room_id, member=request.user, is_host=True)
        except VideoChatRooms_Members.DoesNotExist:
            return Response(
                {"error": {"not_host": "Only the host can update the room information."}},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            room = VideoChatRooms.objects.get(id=room_id)

            # Update fields based on user input
            room.invitation_uuid = uuid.uuid4()
            
            # Calculate expiration date based on the provided duration or default to 1 day
            duration_in_days = int(request.data.get('duration_in_days', 1))
            expiration_date = timezone.now() + timezone.timedelta(days=duration_in_days)
            room.invitation_exp = request.data.get('invitation_exp', expiration_date)

            # Validate and save the updated data
            serializer = VideoChatRoomUpdateInvitationSerializer(instance=room, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        
class JoinVideoChatRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        invitation_uuid = request.data.get('invitation_uuid', '')

        # Check if the invitation_uuid is valid
        try:
            room = VideoChatRooms.objects.get(invitation_uuid=invitation_uuid)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"invalid_invitation": "Invalid invitation UUID."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the invitation has not expired
        if room.invitation_exp and room.invitation_exp < timezone.now():
            return Response(
                {"error": {"invitation_expired": "Invitation has expired."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the user is already a member of the room
        if VideoChatRooms_Members.objects.filter(room=room, member=request.user).exists():
            return Response(
                {"error": {"already_member": "You are already a member of this room."}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Add the user to the room
        room_member_data = {
            'room': room.id,
            'member': request.user.id,
            'is_host': False,
        }
        room_member_serializer = VideoChatRoomsMembersSerializer(data=room_member_data)
        if room_member_serializer.is_valid():
            room_member_serializer.save()

            # Retrieve member details
            return Response({
                "success": "You have successfully joined the room.",
                "room": room.id,
                "member": request.user.id,
                "room_name": room.room_name,
            }, status=status.HTTP_200_OK)
        else:
            return Response(room_member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
