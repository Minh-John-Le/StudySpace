from django.contrib import admin
from .models import VideoChatRooms, VideoChatRooms_Members

# Register your models here.
admin.site.register(VideoChatRooms)
admin.site.register(VideoChatRooms_Members)