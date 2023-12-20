from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class VideoChatRooms(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    room_name = models.CharField(max_length=32)
    invitation_uuid = models.CharField(max_length=36, unique=True)
    invitation_exp = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "VideoChatRooms"

    def __str__(self):
        return self.room_name
    

class VideoChatRooms_Members(models.Model):
    room = models.ForeignKey(VideoChatRooms, on_delete=models.CASCADE)
    member = models.ForeignKey(User, on_delete=models.CASCADE)
    is_host = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        unique_together = ('room', 'member')
        verbose_name_plural = "VideoChatRooms_Users"

    def __str__(self):
        return str(self.member) + " in Room " + str(self.room.id)