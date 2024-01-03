from django.contrib import admin
from .models import VideoChatRooms, VideoChatRooms_Members

# Register your models here.
# admin.site.register(VideoChatRooms)
# admin.site.register(VideoChatRooms_Members)

@admin.register(VideoChatRooms)
class VideoChatRoomsAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )

@admin.register(VideoChatRooms_Members)
class VideoChatRooms_MembersAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )