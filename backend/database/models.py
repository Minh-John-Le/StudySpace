from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone  # Import the timezone module


# Create your models here.


class Rooms(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=256, blank=True, default="")
    topic = models.CharField(max_length=20, default="")
    room_name = models.CharField(max_length=32, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Rooms"

    def __str__(self):
        return "Room " + str(self.id) + " by " + str(self.host.username)


class Rooms_Members(models.Model):
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('room', 'member')
        verbose_name_plural = "Rooms_Members"

    def __str__(self):
        return str(self.member) + " in Room " + str(self.room.id)


class Followers(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='following')
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'follower')
        verbose_name_plural = "Followers"

    def __str__(self):
        return str(self.user) + " followed by " + str(self.follower)


class Messages(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    content = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Messages"

    def __str__(self):
        return "Message " + str(self.id) + " by " + str(self.writer)
