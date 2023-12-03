from django.db import models
from django.contrib.auth.models import User
import json


class ChatBotMessages(models.Model):
    writer = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "ChatBotMessages"

    def __str__(self):
        return f"Question #{self.id} by {self.writer}"

    def serialize_code(self):
        return json.dumps({"message": self.message, "response": self.response})

    def deserialize_code(self, serialized_data):
        data = json.loads(serialized_data)
        self.message = data.get("message", "")
        self.response = data.get("response", "")
