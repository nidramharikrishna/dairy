from django.db import models
from django.contrib.auth.models import User


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budgets")
    monthly_budget = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.PositiveIntegerField()
    year = models.PositiveIntegerField()

    class Meta:
        unique_together = ["user", "month", "year"]

    def __str__(self):
        return f"{self.user.username} - {self.month}/{self.year}"


class ChatLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chat_logs")
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)