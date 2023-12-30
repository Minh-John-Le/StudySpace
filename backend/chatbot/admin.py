from django.contrib import admin
from .models import ChatBotMessages

# Register your models here.
# admin.site.register(ChatBotMessages)
@admin.register(ChatBotMessages)
class ChatBotMessagesAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )