from django.db import models
from database.models import Rooms
from django.contrib.auth.models import User


# Create your models here.
class Messages(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Rooms, on_delete=models.CASCADE)
    content = models.TextField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Messages"

    def __str__(self):
        return "Message " + str(self.id) + " by " + str(self.writer)
