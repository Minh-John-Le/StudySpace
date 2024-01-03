from django.contrib import admin
from .models import Rooms, Rooms_Members, Followers
# Register your models here.

# admin.site.register(Rooms)
# admin.site.register(Rooms_Members)
# admin.site.register(Followers)
@admin.register(Rooms)
class RoomsAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )

@admin.register(Rooms_Members)
class Rooms_MembersAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )

@admin.register(Followers)
class FollowersAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )
