from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name_snapshot",
            "unit_snapshot",
            "quantity",
            "price_at_purchase",
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.quantity * obj.price_at_purchase


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "username",
            "total_amount",
            "status",
            "delivery_address",
            "payment_method",
            "items",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "total_amount", "status"]