# Generated by Django 4.2.5 on 2023-10-30 03:42

import authentication.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_alter_userprofile_avatar_name_alter_userprofile_bio_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='avatar_name',
            field=models.CharField(max_length=20, validators=[authentication.models.validate_non_empty]),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='bio',
            field=models.CharField(default='', max_length=250),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='display_name',
            field=models.CharField(max_length=20, validators=[authentication.models.validate_non_empty]),
        ),
    ]
