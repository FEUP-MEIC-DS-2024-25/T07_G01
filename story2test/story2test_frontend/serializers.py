# story2test_frontend/serializers.py

from rest_framework import serializers
from .models import UserStory, Conversation, Message

class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = ['id', 'user_type', 'action', 'goal', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'is_user', 'text', 'timestamp']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)  # Nest messages within each conversation

    class Meta:
        model = Conversation
        fields = ['id', 'created_at', 'messages']