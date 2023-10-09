from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=16)
    profile_image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.display_name
    
