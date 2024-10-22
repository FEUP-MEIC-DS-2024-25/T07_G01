from django.db import models

# Create your models here.

class UserStory(models.Model):
    user_type = models.CharField(max_length=100)
    action = models.CharField(max_length=200)
    goal = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_type} - {self.action}"
