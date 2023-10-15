from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=32)
    avatar_name = models.CharField(max_length=32)
    bio = models.TextField(default="", null=True, blank=True)

    def __str__(self):
        return self.display_name
