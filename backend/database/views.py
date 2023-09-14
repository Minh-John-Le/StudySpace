from django.core.paginator import Paginator
from django.db.models import Count
from django.db import models
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Rooms
from .serializers import RoomsSerializer, RoomCardSerializer


# Create your views here.
# ======================= REST API for RoomCard ===================================

# ------------ All Rooms------------------
class RoomCardAPI(APIView):
    def get(self, request):
        page_number = request.query_params.get('page', 1)
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

        try:
            page = paginator.page(
                min(page_number, paginator.num_pages))
        except:
            return Response([], status=status.HTTP_404_NOT_FOUND)

        serialized_item = RoomCardSerializer(page, many=True)

        return Response(serialized_item.data, status=status.HTTP_200_OK)

    def post(self, request):
        serialized_item = RoomCardSerializer(data=request.data)
        serialized_item.is_valid(raise_exception=True)
        serialized_item.save()
        return Response(serialized_item.data, status=status.HTTP_200_OK)
