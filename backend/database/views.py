from django.core.paginator import Paginator
from django.db.models import Count
from django.db import models
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Rooms, Followers
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import RoomsSerializer, RoomCardSerializer, FollowStatusSerializer, \
    FollowerSerializer, FollowingSerializer


# Create your views here.
# ======================= REST API for RoomCard ===================================

# ------------ All Rooms------------------
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

    def post(self, request):
        serialized_item = RoomCardSerializer(data=request.data)
        serialized_item.is_valid(raise_exception=True)
        serialized_item.save()
        return Response(serialized_item.data, status=status.HTTP_200_OK)

    # ======================= REST API for Followers ===================================


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
