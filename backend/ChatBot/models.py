from django.db import models
from django.contrib.auth.models import User


class ChatBotMessages(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "ChatBotMessages"

    def __str__(self):
        return "Question #" + str(self.id) + " by " + str(self.writer)
