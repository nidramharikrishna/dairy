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
      alert("Failed to add product to cart");
    }
  };

  const addToWishlist = async () => {
    if (!isAuthenticated) {
      alert("Please login to add wishlist");
      return;
    }

    try {
      await API.post("wishlist/", {
        product: product.id,
      });
      alert("Added to wishlist");
    } catch (error) {
      alert("Failed to add wishlist");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md hover:scale-105 transition duration-200">
      <Link to={`/products/${product.id}`}>
        <div className="h-44 bg-milk rounded-xl flex items-center justify-center overflow-hidden mb-4">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">🥛</span>
          )}
        </div>

        <h3 className="text-lg font-bold text-darkText">{product.name}</h3>
        <p className="text-softText text-sm">{product.unit}</p>
        <p className="text-yellow-500 text-sm">
          ⭐ {product.average_rating || 0}
        </p>
        <p className="text-sky font-bold mt-2">₹{product.price}</p>
      </Link>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={addToCart}
          className="bg-sky text-white py-2 rounded-xl"
        >
          Cart
        </button>

        <button onClick={addToWishlist} className="bg-butter py-2 rounded-xl">
          🤍
        </button>
      </div>
    </div>
  );
}

export default ProductCard;