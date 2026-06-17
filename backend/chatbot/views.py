from datetime import datetime
from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Budget, ChatLog
from orders.models import Order


class BudgetView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = datetime.today()

        budget = Budget.objects.filter(
            user=request.user,
            month=today.month,
            year=today.year
        ).first()

        if not budget:
            return Response({
                "monthly_budget": 0,
                "spent": 0,
                "remaining": 0,
            })

        spent = Order.objects.filter(
            user=request.user,
            created_at__month=today.month,
            created_at__year=today.year
        ).exclude(status="Cancelled")

        total_spent = sum(order.total_amount for order in spent)
        remaining = budget.monthly_budget - total_spent

        return Response({
            "monthly_budget": budget.monthly_budget,
            "spent": total_spent,
            "remaining": remaining,
        })

    def post(self, request):
        today = datetime.today()
        amount = request.data.get("monthly_budget")

        if not amount:
            return Response({"error": "monthly_budget is required"}, status=400)

        budget, created = Budget.objects.update_or_create(
            user=request.user,
            month=today.month,
            year=today.year,
            defaults={"monthly_budget": amount}
        )

        return Response({
            "message": "Budget saved successfully",
            "monthly_budget": budget.monthly_budget,
        })


class ChatbotMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message", "")
        today = datetime.today()

        budget = Budget.objects.filter(
            user=request.user,
            month=today.month,
            year=today.year
        ).first()

        if not budget:
            response = "Please set your monthly dairy budget first. Example: ₹3000 for this month."
        else:
            orders = Order.objects.filter(
                user=request.user,
                created_at__month=today.month,
                created_at__year=today.year
            ).exclude(status="Cancelled")

            spent = sum(order.total_amount for order in orders)
            remaining = budget.monthly_budget - spent

            if remaining <= 0:
                response = "You have already crossed your dairy budget. Try buying only essential items like milk or curd."
            elif remaining < Decimal("500"):
                response = f"You have only ₹{remaining} left. Choose small packs like 500ml milk, curd, or butter."
            else:
                response = f"You have ₹{remaining} remaining. You can buy milk, paneer, curd, or ghee within this budget."

        ChatLog.objects.create(
            user=request.user,
            message=message,
            response=response
        )

        return Response({"response": response})