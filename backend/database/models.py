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
        return "Room: " + str(self.id) + " Host: "  + str(self.host.username)

    
class Users_Rooms(models.Model):
    host_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host_rooms')
    member_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='member_rooms')
    is_host = models.BooleanField(default=False)

    class Meta:
        unique_together = ('host_id', 'member_id')
        verbose_name_plural = "Users_Rooms"

