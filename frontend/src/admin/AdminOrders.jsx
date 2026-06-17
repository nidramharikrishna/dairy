import { useEffect, useState } from "react";
import API from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data);
    } catch (error) {
      console.log("Failed to fetch orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`orders/${id}/status/`, { status });
      fetchOrders();
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>

        <div className="space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{order.id}</h2>
                  <p className="text-softText">Customer: {order.username}</p>
                  <p className="text-softText text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sky font-bold text-xl">₹{order.total_amount}</p>

                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="mt-2 border rounded-xl px-3 py-2 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-cream rounded-xl p-4 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product_name_snapshot} × {item.quantity}
                    </span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              <p className="text-softText mt-4">
                Address: {order.delivery_address}
              </p>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold">No orders found</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;