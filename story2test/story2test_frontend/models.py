from django.db import models

class UserStory(models.Model):
    user_type = models.CharField(max_length=100)
    action = models.CharField(max_length=200)
    goal = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_type} - {self.action}"


class Conversation(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        if not self.title:
            self.title = f"Chat {self.id}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    is_user = models.BooleanField()  # True if it's a user message, False if it's a bot response
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)