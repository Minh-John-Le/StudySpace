from django.contrib import admin
from .models import Messages

# Register your models here.
# admin.site.register(Messages)
@admin.register(Messages)
class MessagesAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', )

