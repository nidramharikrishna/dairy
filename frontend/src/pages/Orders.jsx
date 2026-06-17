import { useEffect, useState } from "react";
import API from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/");
      setOrders(res.data);
    } catch (error) {
      console.log("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const res = await API.get(`orders/${orderId}/invoice/`, {
        responseType: "blob",
      });

      const fileURL = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = fileURL;
      link.setAttribute("download", `invoice_order_${orderId}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      alert("Invoice download failed");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-softText">Loading orders...</div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-7xl mb-4">📦</div>
            <h2 className="text-2xl font-bold">No orders yet</h2>
            <p className="text-softText mt-2">
              Your placed orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Order #{order.id}</h2>
                    <p className="text-softText text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sky">₹{order.total_amount}</p>
                    <p className="bg-butter px-3 py-1 rounded-full text-sm mt-1">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-softText"
                    >
                      <span>
                        {item.product_name_snapshot} × {item.quantity}
                      </span>
                      <span>₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-softText mt-4">
                  Address: {order.delivery_address}
                </p>

                <button
                  onClick={() => downloadInvoice(order.id)}
                  className="inline-block mt-4 bg-sky text-white px-4 py-2 rounded-xl hover:shadow-md transition"
                >
                  Download Invoice
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;