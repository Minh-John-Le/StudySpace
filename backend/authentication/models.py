from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
import uuid

def validate_non_empty(value):
    if not value:
        raise ValidationError("This field cannot be empty.")

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=20, validators=[validate_non_empty])
    avatar_name = models.CharField(max_length=20, validators=[validate_non_empty])
    bio = models.CharField(default="", max_length=250)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name

class SecurityToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token_type = models.CharField(max_length=20)
    token_value = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    expire_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def __str__(self):
        return str(self.token_type) + " token of " + str(self.user)
