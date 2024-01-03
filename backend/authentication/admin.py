from django.contrib import admin
from .models import UserProfile, SecurityToken


# Register your models here.

admin.site.register(UserProfile)
admin.site.register(SecurityToken)


