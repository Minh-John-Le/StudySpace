from django.core.paginator import Paginator
from django.db.models import Count
from django.db import models, transaction
from django.forms import ValidationError
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Rooms, Followers, Rooms_Members, Messages
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import RoomMetaContentSerializer, RoomCardSerializer, FollowStatusSerializer, \
    FollowerSerializer, FollowingSerializer, SingleRoomSerializer, RoomsMembersSerializer, \
    RoomMessageSerializer


# Create your views here.
# ======================= REST API for RoomCard Display ===================================
class RoomCardAPI(APIView):
    def get(self, request):
        page_number = request.query_params.get('page', '1')
        topic = request.query_params.get('topic')

        if topic:
            items = Rooms.objects.filter(topic__icontains=topic)
        else:
            items = Rooms.objects.all()

        # Annotate the queryset with the total_member count
        items = items.annotate(total_member=Count('rooms_members'))

        # Sort the queryset by 'total_member' in ascending order
        items = items.order_by('-total_member')

        # Set the number of items per page (e.g., 10)
        paginator = Paginator(items, per_page=5)

        # Process page
        if page_number == "last":
            page_number = int(paginator.num_pages)
        elif page_number == "first" or not page_number.isdigit():
            page_number = int(1)
        else:
            page_number = int(page_number)

        try:
            page = paginator.page(min(page_number, paginator.num_pages))
        except:
            return Response([], status=status.HTTP_404_NOT_FOUND)

        serialized_item = RoomCardSerializer(page, many=True)

        return Response(serialized_item.data, status=status.HTTP_200_OK)


class RoomMetaContentAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        try:
            item = Rooms.objects.get(id=room_id)
        except Rooms.DoesNotExist:
            return Response(
                {"error": "Room Content not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serialized_item = RoomMetaContentSerializer(item)
        return Response(serialized_item.data, status=status.HTTP_200_OK)


# ======================= REST API for Room Creation===================================


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
                serialized_item.is_valid(raise_exception=True)
                serialized_item.save()

                # After creating the room, get the room_id
                room_id = serialized_item.instance.id
                print(room_id)

                # Create a new entry in the Rooms_Members table
                room_member_data = {
                    'member': request.user.id,
                    'room': room_id,
                    'is_host': True,
                }
                room_member_serializer = RoomsMembersSerializer(
                    data=room_member_data)
                room_member_serializer.is_valid(raise_exception=True)
                room_member_serializer.save()

                return Response(serialized_item.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
