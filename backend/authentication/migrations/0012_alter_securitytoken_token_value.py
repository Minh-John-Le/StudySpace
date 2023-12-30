# Generated by Django 4.2.5 on 2023-12-30 06:05

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_userprofile_email_verified_securitytoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='securitytoken',
            name='token_value',
            field=models.UUIDField(default=uuid.uuid4, unique=True),
        ),
    ]
