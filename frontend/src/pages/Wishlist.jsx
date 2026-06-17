import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const [items, setItems] = useState([]);

  const fetchWishlist = async () => {
    const res = await API.get("wishlist/");
    setItems(res.data);
  };

  const removeWishlist = async (id) => {
    await API.delete(`wishlist/${id}/`);
    fetchWishlist();
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
            <div className="text-6xl mb-4">🤍</div>
            <h2 className="text-2xl font-bold">Wishlist is empty</h2>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id}>
                <ProductCard product={item.product_details} />
                <button
                  onClick={() => removeWishlist(item.id)}
                  className="w-full mt-2 bg-red-100 text-red-600 py-2 rounded-xl"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;