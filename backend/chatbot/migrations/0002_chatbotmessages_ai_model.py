# Generated by Django 4.2.5 on 2023-12-08 13:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatbotmessages',
            name='ai_model',
            field=models.CharField(default='llama', max_length=256),
        ),
    ]