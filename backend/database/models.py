from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Rooms(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField()
    topic = models.CharField(max_length=32)

    class Meta:
        verbose_name_plural = "Rooms"

    def __str__(self):
        return "Room: " + str(self.id) + " Host: " + str(self.host.username)


class Rooms_Members(models.Model):
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)

    class Meta:
        unique_together = ('room', 'member')
        verbose_name_plural = "Rooms_Members"
