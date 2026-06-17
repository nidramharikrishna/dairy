import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const res = await API.get("cart/");
    setItems(res.data);
  };

  const fetchProfile = async () => {
    const res = await API.get("profile/");
    if (res.data.address) {
      setDeliveryAddress(res.data.address);
    }
  };

  const loadData = async () => {
    try {
      await fetchCart();
      await fetchProfile();
    } catch (error) {
      console.log("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + Number(item.subtotal);
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!deliveryAddress.trim()) {
      alert("Delivery address is required");
      return;
    }

    try {
      await API.post("orders/", {
        delivery_address: deliveryAddress,
      });

      alert("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to place order");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-softText">Loading checkout...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen p-10 text-center">
        <div className="bg-white rounded-2xl p-10 max-w-xl mx-auto shadow-sm">
          <div className="text-7xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold">Cart is empty</h2>

          <Link
            to="/products"
            className="inline-block mt-6 bg-sky text-white px-6 py-3 rounded-xl"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={placeOrder}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter complete delivery address"
              className="w-full border rounded-xl px-4 py-3 h-40 outline-none focus:border-sky"
              required
            />

            <p className="text-softText text-sm mt-2">
              This address is loaded from your profile. You can edit it for this
              order.
            </p>

            <button className="mt-5 bg-sky text-white px-6 py-3 rounded-xl hover:shadow-md transition">
              Place Order - COD
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <p className="text-softText text-sm mt-3">
              Payment method: Cash on Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;