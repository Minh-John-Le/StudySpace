# Generated by Django 4.2.5 on 2023-10-15 18:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0007_remove_userprofile_profile_image_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='avatar_name',
            field=models.CharField(max_length=32),
        ),
    ]