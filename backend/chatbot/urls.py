from django.urls import path
from .views import BudgetView, ChatbotMessageView

urlpatterns = [
    path("budget/", BudgetView.as_view()),
    path("message/", ChatbotMessageView.as_view()),
]