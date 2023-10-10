from django.contrib import admin
from .models import Rooms, Rooms_Members, Followers, Messages
# Register your models here.

admin.site.register(Rooms)
admin.site.register(Rooms_Members)
admin.site.register(Followers)
admin.site.register(Messages)

