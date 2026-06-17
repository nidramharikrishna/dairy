from io import BytesIO
from reportlab.pdfgen import canvas

from django.http import FileResponse
from django.contrib.auth.models import User
from django.db import transaction
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import CartItem
from products.models import Product, Category


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by("-created_at")
        return Order.objects.filter(user=self.request.user).order_by("-created_at")

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        delivery_address = request.data.get("delivery_address")

        if not delivery_address:
            return Response({"error": "Delivery address is required"}, status=400)

        cart_items = CartItem.objects.filter(user=request.user)

        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        total = 0

        for item in cart_items:
            if item.quantity > item.product.stock_quantity:
                return Response(
                    {"error": f"Not enough stock for {item.product.name}"},
                    status=400,
                )

            total += item.product.price * item.quantity

        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            delivery_address=delivery_address,
            payment_method="COD",
        )

        for item in cart_items:
            product = item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name_snapshot=product.name,
                unit_snapshot=product.unit,
                quantity=item.quantity,
                price_at_purchase=product.price,
            )

            product.stock_quantity -= item.quantity
            product.save()

        cart_items.delete()

        return Response(
            self.get_serializer(order).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        order = self.get_object()
        new_status = request.data.get("status")

        allowed_status = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]

        if new_status not in allowed_status:
            return Response({"error": "Invalid status"}, status=400)

        order.status = new_status
        order.save()

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["get"], url_path="invoice")
    def invoice(self, request, pk=None):
        order = self.get_object()

        if order.user != request.user and not request.user.is_staff:
            return Response({"error": "Not allowed"}, status=403)

        buffer = BytesIO()
        p = canvas.Canvas(buffer)

        p.setFont("Helvetica-Bold", 18)
        p.drawString(210, 800, "Dairy Invoice")

        p.setFont("Helvetica", 12)
        p.drawString(50, 760, f"Order ID: #{order.id}")
        p.drawString(50, 740, f"Customer: {order.user.username}")
        p.drawString(50, 720, f"Status: {order.status}")
        p.drawString(50, 700, f"Payment: {order.payment_method}")
        p.drawString(50, 680, f"Address: {order.delivery_address}")

        y = 640

        p.setFont("Helvetica-Bold", 12)
        p.drawString(50, y, "Product")
        p.drawString(280, y, "Qty")
        p.drawString(350, y, "Price")
        p.drawString(450, y, "Subtotal")

        y -= 25
        p.setFont("Helvetica", 12)

        for item in order.items.all():
            subtotal = item.quantity * item.price_at_purchase

            p.drawString(50, y, item.product_name_snapshot[:28])
            p.drawString(280, y, str(item.quantity))
            p.drawString(350, y, f"Rs.{item.price_at_purchase}")
            p.drawString(450, y, f"Rs.{subtotal}")

            y -= 25

        p.setFont("Helvetica-Bold", 14)
        p.drawString(350, y - 20, f"Total: Rs.{order.total_amount}")

        p.showPage()
        p.save()

        buffer.seek(0)

        return FileResponse(
            buffer,
            as_attachment=True,
            filename=f"invoice_order_{order.id}.pdf",
        )


class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"error": "Admin only"}, status=403)

        from django.utils import timezone
        from django.contrib.auth.models import User
        from products.models import Product, Category

        today = timezone.now().date()

        all_orders = Order.objects.all()
        active_orders = Order.objects.exclude(status="Cancelled")

        today_orders_qs = active_orders.filter(
            created_at__year=today.year,
            created_at__month=today.month,
            created_at__day=today.day,
            )

        total_revenue = active_orders.aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        today_revenue = today_orders_qs.aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        total_orders = all_orders.count()
        today_orders = today_orders_qs.count()
        pending_orders = Order.objects.filter(status="Pending").count()
        delivered_orders = Order.objects.filter(status="Delivered").count()

        total_products = Product.objects.count()
        total_categories = Category.objects.count()
        total_users = User.objects.filter(is_staff=False).count()

        orders_by_status = (
            Order.objects.values("status")
            .annotate(count=Count("id"))
            .order_by("status")
        )

        top_products = (
            OrderItem.objects.values("product_name_snapshot")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("-total_quantity")[:5]
        )

        low_stock = Product.objects.filter(stock_quantity__lte=5).values(
            "id", "name", "stock_quantity"
        )

        return Response({
            "total_revenue": float(total_revenue),
            "today_revenue": float(today_revenue),
            "total_orders": total_orders,
            "today_orders": today_orders,
            "pending_orders": pending_orders,
            "delivered_orders": delivered_orders,
            "total_products": total_products,
            "total_categories": total_categories,
            "total_users": total_users,
            "orders_by_status": list(orders_by_status),
            "top_products": list(top_products),
            "low_stock": list(low_stock),
        })