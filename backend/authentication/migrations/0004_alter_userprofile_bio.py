# Generated by Django 4.2.5 on 2023-10-09 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_userprofile_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='bio',
            field=models.TextField(default='', null=True),
        ),
    ]