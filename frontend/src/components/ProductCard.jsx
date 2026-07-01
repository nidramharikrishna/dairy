import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth();

  if (!product || !product.id) {
    return null;
  }

  const addToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add products to cart");
      return;
    }

    try {
      await API.post("cart/", {
        product: product.id,
        quantity: 1,
      });

      alert("Product added to cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add product to cart");
    }
  };

  const addToWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to add products to wishlist");
      return;
    }

    try {
      await API.post("wishlist/", {
        product: product.id,
      });

      alert("Added to wishlist");
    } catch (error) {
      console.log(error);
      alert("Failed to add wishlist");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image_url || product.image ? (
            <img
              src={product.image_url || product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-6xl">
              🥛
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-darkText">
            {product.name}
          </h3>

          <p className="text-softText text-sm mt-1">
            {product.unit}
          </p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-yellow-500 font-medium">
              ⭐ {product.average_rating || 0}
            </span>

            <span className="text-sky font-bold text-lg">
              ₹{product.price}
            </span>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-2 gap-2 p-4 pt-0">
        <button
          onClick={addToCart}
          className="bg-sky text-white py-2 rounded-xl hover:opacity-90"
        >
          Add Cart
        </button>

        <button
          onClick={addToWishlist}
          className="bg-butter py-2 rounded-xl hover:opacity-90"
        >
          🤍 Wishlist
        </button>
      </div>
    </div>
  );
}

export default ProductCard;