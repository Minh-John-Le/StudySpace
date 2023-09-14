from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone  # Import the timezone module


# Create your models here.


class Rooms(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=32)
    topic = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_created=True)

    class Meta:
        verbose_name_plural = "Rooms"

    def __str__(self):
        return "Room " + str(self.id) + " by " + str(self.host.username)


class Rooms_Members(models.Model):
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_created=True)


    class Meta:
        unique_together = ('room', 'member')
        verbose_name_plural = "Rooms_Members"

    def __str__(self):
        return str(self.member) + " in Room " + str(self.room.id)
