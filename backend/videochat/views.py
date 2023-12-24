from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from agora_token_builder import RtcTokenBuilder
import time

import environ
import uuid
from django.utils import timezone
from django.db import models, transaction
from .models import VideoChatRooms, VideoChatRooms_Members
from .serializers import VideoChatRoomMetaContentSerializer, SingleVideoChatRoomSerializer, \
    VideoChatRoomsMembersSerializer, VideoChatRoomUpdateInvitationSerializer, RoomMemberResponseSerializer \
    
from authentication.models import UserProfile


env = environ.Env()
environ.Env.read_env()

# Create your views here.
#====================================================================================
#--------------------------------- Get Room Meta Data -------------------------------
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
    
    def delete(self, request, room_id):
        try:
            # Attempt to get the room with the specified ID and check if the user is the host
            room = VideoChatRooms.objects.get(id=room_id, host=request.user)
        except VideoChatRooms.DoesNotExist:
            # If the room does not exist, return a 404 response
            return Response(
                {"error": {"room_does_not_exist": "Room not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        
        room.delete()

        return Response({"message": "Room deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request, room_id):
        try:
            # Retrieve the room
            room = VideoChatRooms.objects.get(id=room_id, host=request.user)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Check if the authenticated user is the host of the room
            if request.user != room.host:
                raise PermissionDenied("You do not have permission to edit this room.")

            data = request.data  # Assuming the request data is in JSON format

            # Validate and update fields
            if 'room_name' in data:
                room.room_name = data['room_name']

            # You can add similar checks for other fields like description, topic, etc.

            # Validate the serializer
            serializer = SingleVideoChatRoomSerializer(
                room, data=data, partial=True)

            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        except serializers.ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({'error': {"Permission_Denied": str(e)}}, status=status.HTTP_403_FORBIDDEN)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            error_message = str(e)
            return Response({'error': {error_message}}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VideoChatRoomListAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Get all rooms that the user is a member of, ordered by join date (created_at)
            rooms = VideoChatRooms_Members.objects.filter(member=user).order_by('-created_at').values_list('room', flat=True)
            room_objects = VideoChatRooms.objects.filter(id__in=rooms)
        except VideoChatRooms.DoesNotExist:
            return Response(
                {"error": {"rooms_not_found": "No rooms found for the user."}},
                status=status.HTTP_404_NOT_FOUND
            )

        # Serialize the list of rooms
        serializer = VideoChatRoomMetaContentSerializer(room_objects, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

#----------------- Create new room --------------------------------------------
class NewVideoChatRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            with transaction.atomic():
                room_name = request.data.get('room_name', '')

                existing_data = {
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
            member_details = RoomMemberResponseSerializer({
                "success": "You have successfully joined the room.",
                "room": room.id,
                "id": room.id,
                "member": request.user.id,
                "room_name": room.room_name,
                "host": room.host.id,
                "host_display_name": room.host.userprofile.display_name,
                "host_avatar_name": room.host.userprofile.avatar_name,
                "created_at": room.created_at,
            }).data

            return Response(member_details, status=status.HTTP_200_OK)
        else:
            return Response(room_member_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAgoraTokenAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        # Check if the user is a member of the specified room
        try:
            room_member = VideoChatRooms_Members.objects.get(room__id=room_id, member=request.user)
        except VideoChatRooms_Members.DoesNotExist:
            return Response(
                {"error": {"invalid_membership": "User is not a member of the specified room."}},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Retrieve UserProfile associated with the user
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response(
                {"error": {"profile_not_found": "User profile not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        

        # Replace with your actual Agora App ID and App Certificate
        appId = env('AGORA_APP_ID')
        appCertificate = env("AGORA_APP_CERTIFICATE")

        # Set the channel name to the room_id
        channelName = str("room_")+str(room_id)

        # Set the user role to PUBLISHER
        role = 2

        expirationTimeInSeconds = 3600 * 24 
        currentTimeStamp = int(time.time())
        privilegeExpiredTs = currentTimeStamp + expirationTimeInSeconds
        uid = str(request.user.id)


        # Build the Agora token
        token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs)


        # Return the token in the response
        # Return the token and display_name in the response
        return Response({
            "token": token,
            "uid": uid,
            "channel_name": channelName,
            "display_name": user_profile.display_name,
        }, status=status.HTTP_200_OK)