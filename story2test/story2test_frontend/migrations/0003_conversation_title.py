# Generated by Django 5.1.2 on 2024-11-14 00:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('story2test_frontend', '0002_conversation_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='title',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
