# story2test_frontend/serializers.py

from rest_framework import serializers
from .models import UserStory

class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = ['id', 'user_type', 'action', 'goal', 'created_at']
