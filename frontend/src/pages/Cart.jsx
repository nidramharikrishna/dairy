import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      setItems(res.data);
    } catch (error) {
      console.log("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      await API.patch(`cart/${id}/`, { quantity });
      fetchCart();
    } catch (error) {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`cart/${id}/`);
      fetchCart();
    } catch (error) {
      alert("Failed to remove item");
    }
  };

  const total = items.reduce((sum, item) => {
    return sum + Number(item.subtotal);
  }, 0);

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return <div className="p-10 text-center text-softText">Loading cart...</div>;
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">My Cart</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-softText mt-2 mb-6">
              Add fresh dairy products to your cart.
            </p>
            <Link
              to="/products"
              className="bg-sky text-white px-6 py-3 rounded-xl"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
                >
                  <div className="w-24 h-24 bg-milk rounded-xl overflow-hidden flex items-center justify-center">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🥛</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.product_name}</h3>
                    <p className="text-softText">₹{item.product_price}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 bg-milk rounded-lg"
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 bg-milk rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sky">₹{item.subtotal}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 text-sm mt-3"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

              <div className="flex justify-between mb-3">
                <span className="text-softText">Subtotal</span>
                <span className="font-bold">₹{total}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-softText">Payment</span>
                <span>COD</span>
              </div>

              <Link
                to="/checkout"
                className="block text-center bg-sky text-white py-3 rounded-xl hover:shadow-md transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;