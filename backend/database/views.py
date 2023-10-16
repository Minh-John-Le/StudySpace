from django.db.models import Q
from django.core.paginator import Paginator
from django.db.models import Count
from django.db import models, transaction
from django.forms import ValidationError
from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Rooms, Followers, Rooms_Members, Messages
from authentication.models import UserProfile
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models.functions import Lower
from .serializers import RoomMetaContentSerializer, RoomCardSerializer, FollowStatusSerializer, \
    FollowerSerializer, FollowingSerializer, SingleRoomSerializer, RoomsMembersSerializer, \
    RoomMessageSerializer, AllMembersInRoomSerializer, TopMemberSerializer, MemberRecentMessageSerializer, \
    AllRoomHotTopicSerializer
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User

from rest_framework import serializers


# Create your views here.
# ======================= REST API for RoomCard Display ===================================
class RoomCardAPI(APIView):
    def get(self, request):
        page_number = request.query_params.get('page', '1')
        topic = request.query_params.get('topic')

        if topic:
            rooms = Rooms.objects.filter(topic__icontains=topic)
        else:
            rooms = Rooms.objects.all()

        # Annotate the queryset with the total_member count
        rooms = rooms.annotate(total_member=Count('rooms_members'))

        # Sort the queryset by 'total_member' in descending order
        rooms = rooms.order_by('-total_member')

        # Set the number of items per page (e.g., 10)
        per_page = 5
        paginator = Paginator(rooms, per_page)

        # Get the maximum page number
        max_page = paginator.num_pages

        # Process page
        if page_number == "last":
            page_number = max_page
        elif page_number == "first" or not page_number.isdigit():
            page_number = 1
        else:
            page_number = int(page_number)

        try:
            page = paginator.page(min(page_number, max_page))
        except:
            return Response([], status=status.HTTP_404_NOT_FOUND)

        # Create an empty list to store serialized room data with members
        result = []

        for room in page:
            members = Rooms_Members.objects.filter(
                room=room.id).order_by("-created_at")[:7]

            # Serialize the followers' data
            members_serializer = AllMembersInRoomSerializer(members, many=True)

            # Serialize the room data
            room_serializer = RoomCardSerializer(room)

            # Append the serialized room data with members to the result list
            result.append({
                "room_data": room_serializer.data,
                "members": members_serializer.data,
            })

        # Include the max page number in the response
        response_data = {
            "result": result,
            "max_page": max_page,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class ProfileRoomCardAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        page_number = request.query_params.get('page', '1')
        topic = request.query_params.get('topic')

        user = get_object_or_404(User, id=user_id)

        if topic:
            # Filter rooms by topic and where the user is a member
            rooms = Rooms.objects.filter(
                Q(topic__icontains=topic) &
                Q(rooms_members__member=user)
            )
        else:
            # Get rooms where the user is a member
            rooms = Rooms.objects.filter(rooms_members__member=user)

        # Annotate the queryset with the total_member count
        rooms = rooms.annotate(total_member=Count('rooms_members'))

        # Sort the queryset by 'total_member' in descending order
        rooms = rooms.order_by('-total_member')

        # Set the number of items per page (e.g., 10)
        per_page = 2
        paginator = Paginator(rooms, per_page)

        # Get the maximum page number
        max_page = paginator.num_pages

        # Process page
        if page_number == "last":
            page_number = max_page
        elif page_number == "first" or not page_number.isdigit():
            page_number = 1
        else:
            page_number = int(page_number)

        try:
            page = paginator.page(min(page_number, max_page))
        except:
            return Response([], status=status.HTTP_404_NOT_FOUND)

        result = []

        for room in page:
            members = Rooms_Members.objects.filter(
                room=room.id).order_by("-created_at")[:7]

            # Serialize the followers' data
            members_serializer = AllMembersInRoomSerializer(members, many=True)

            # Serialize the room data
            room_serializer = RoomCardSerializer(room)

            # Append the serialized room data with members to the result list
            result.append({
                "room_data": room_serializer.data,
                "members": members_serializer.data,
            })

        # Include the max page number in the response
        response_data = {
            "result": result,
            "max_page": max_page,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class RoomManagerAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            item = Rooms.objects.get(id=room_id)
        except Rooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room Content not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        serialized_item = RoomMetaContentSerializer(item)
        return Response(serialized_item.data, status=status.HTTP_200_OK)

    def patch(self, request, room_id):
        try:
            # Retrieve the room
            room_profile = Rooms.objects.get(id=room_id)
        except Rooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room Content not found."}},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            # Check if the authenticated user is the host of the room
            if request.user != room_profile.host:
                raise PermissionDenied(
                    "You do not have permission to edit this room.")

            data = request.data  # Assuming the request data is in JSON format

            # Validate and update fields
            if 'room_name' in data:
                room_profile.room_name = data['room_name']

            if 'description' in data:
                room_profile.description = data['description']

            if 'topic' in data:
                room_profile.topic = data['topic']

            # Validate the serializer
            print(room_profile)
            serializer = SingleRoomSerializer(
                room_profile, data=data, partial=True)

            print(serializer.is_valid())
            if not serializer.is_valid():
                raise serializers.ValidationError(serializer.errors)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        except serializers.ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({'error': {"Permission_Denied":str(e)}}, status=status.HTTP_403_FORBIDDEN)
        except Rooms.DoesNotExist:
            return Response(
                {"error": {"room_does_not_exist": "Room Content not found."}},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, room_id):
        try:
            room_profile = Rooms.objects.get(id=room_id)
        except Rooms.DoesNotExist:
            return Response(
                {"error": "Room not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if the authenticated user is the host of the room
        if request.user != room_profile.host:
            raise PermissionDenied(
                "You do not have permission to delete this room.")

        room_profile.delete()

        # Return a 204 No Content response to indicate successful deletion
        return Response(status=status.HTTP_204_NO_CONTENT)


class AllRoomHotTopicAPI(APIView):
    def get(self, request):
        # Query the database to get the top 10 hottest topics
        top_topics = Rooms.objects.values('topic').annotate(
            topic_count=Count('topic')
        ).order_by('-topic_count')[:10]

        serializer = AllRoomHotTopicSerializer(top_topics, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
# ======================= REST API for Room Creation/Update/Creation===================================


class NewRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            with transaction.atomic():
                topic = request.data.get('topic', '')
                room_name = request.data.get('room_name', '')
                description = request.data.get('description', '')

                existing_data = {
                    'topic': topic,
                    'description': description,
                    'room_name': room_name,
                }

                # Append additional data
                additional_data = {
                    "host": request.user.id
                }

                # Combine existing data and additional data
                updated_data = {**existing_data, **additional_data}
                serialized_item = SingleRoomSerializer(data=updated_data)

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
                room_member_serializer = RoomsMembersSerializer(
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


# ======================= REST API for Single Member In Single Room ===================================


class SingleMemberInRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        member_id = request.user.id

        is_host = False
        is_member = False

        rooms_members = Rooms_Members.objects.filter(
            room=room_id, member=member_id).first()
        print(rooms_members)

        if rooms_members:
            is_host = rooms_members.is_host
            is_member = True

        return Response({
            "is_host": is_host,
            "is_member": is_member
        }, status=status.HTTP_200_OK)

    def post(self, request, room_id):
        is_host = request.data.get('is_host', False)
        member_id = request.user.id

        # Check if the room-member pair already exists
        if Rooms_Members.objects.filter(room=room_id, member=member_id).exists():
            return Response({"detail": "This room-member pair already exists."}, status=status.HTTP_400_BAD_REQUEST)

        # If it doesn't exist, add the pair
        data = {
            'is_host': is_host,
            'room': room_id,
            'member': member_id,
        }

        serialized_item = RoomsMembersSerializer(data=data)
        serialized_item.is_valid(raise_exception=True)
        serialized_item.save()
        return Response(serialized_item.data, status=status.HTTP_200_OK)

    def delete(self, request, room_id):
        member_id = request.user.id

        # Check if the room-member pair exists
        try:
            rooms_member = Rooms_Members.objects.get(
                room=room_id, member=member_id)
        except Rooms_Members.DoesNotExist:
            return Response({"detail": "This room-member pair does not exist."}, status=status.HTTP_400_BAD_REQUEST)

        rooms_member.delete()

        return Response({"detail": "Data has been successfully deleted."}, status=status.HTTP_204_NO_CONTENT)

# ======================= REST API for All Member In Single Room ===================================


class AllMembersInRoomAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        # Get the user's followers based on the 'id' parameter
        members = Rooms_Members.objects.filter(
            room=room_id).order_by("created_at")

        # Serialize the followers' data
        serializer = AllMembersInRoomSerializer(members, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


# ======================= REST API for Followers/ Following ===================================


class FollowStatusAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        # Check if the pair (request.user, id) exists in Followers
        try:
            follower = Followers.objects.get(user=id, follower_id=request.user)
            followStatus = True
        except Followers.DoesNotExist:
            followStatus = False

        return Response({'followStatus': followStatus}, status=status.HTTP_200_OK)

    def post(self, request, id):
        # Check if the pair (request.user, id) exists in Followers
        try:
            follower = Followers.objects.get(user=id, follower=request.user)
            return Response({'message': 'Pair already exists'}, status=status.HTTP_400_BAD_REQUEST)
        except Followers.DoesNotExist:
            # If the pair doesn't exist, create a new Followers object
            # Use request.user.id as the follower's ID
            data = {'user': id, 'follower': request.user.id}
            serialized_item = FollowStatusSerializer(data=data)
            if serialized_item.is_valid():
                serialized_item.save()
                return Response({'message': 'Follow status updated successfully'}, status=status.HTTP_200_OK)
            return Response(serialized_item.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        # Check if the pair (request.user, id) exists in Followers
        try:
            follower = Followers.objects.get(
                user=id, follower_id=request.user.id)
            follower.delete()  # Delete the existing entry
            return Response({'message': 'Pair deleted successfully'}, status=status.HTTP_200_OK)
        except Followers.DoesNotExist:
            return Response({'message': 'Pair does not exist'}, status=status.HTTP_404_NOT_FOUND)


class FollowerAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        # Get the user's followers based on the 'id' parameter
        user_followers = Followers.objects.filter(user_id=id)

        # Serialize the followers' data
        serializer = FollowerSerializer(user_followers, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FollowingAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        # Get the user's followers based on the 'id' parameter
        user_followers = Followers.objects.filter(follower_id=id)

        # Serialize the followers' data
        serializer = FollowingSerializer(user_followers, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TopMembersAPI(APIView):
    def get(self, request):
        # Query for the top 10 people with the most followers
        top_members = UserProfile.objects.annotate(follower_count=Count(
            'user__following')).order_by('-follower_count')[:10]

        # Serialize the top members using the TopMemberSerializer
        serializer = TopMemberSerializer(top_members, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
# ======================= REST API for Message In Room================================================


class RoomMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        messages = Messages.objects.filter(
            room=room_id).order_by('-created_at')[:100]

        serializer = RoomMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, room_id):
        writer = request.user  # Assuming the user is authenticated

        content = request.data.get('content', '').strip()

        # Validate the content
        if not content:
            raise ValidationError("Message content is required")

        # Create a new message
        message = Messages.objects.create(
            writer=writer,
            room_id=room_id,
            content=content
        )

        serializer = RoomMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MemberRecentMessageAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        messages = Messages.objects.filter(
            writer=user_id).order_by('-created_at')[:10]

        serializer = MemberRecentMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
