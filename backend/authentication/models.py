from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models

def validate_non_empty(value):
    if not value:
        raise ValidationError("This field cannot be empty.")

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=20, validators=[validate_non_empty])
    avatar_name = models.CharField(max_length=20, validators=[validate_non_empty])
    bio = models.CharField(default="", max_length=250)

    def __str__(self):
        return self.display_name
