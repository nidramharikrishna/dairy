import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`products/${id}/`);
      setProduct(res.data);
    } catch (error) {
      console.log("Failed to fetch product");
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      alert("Please login to add products to cart");
      return;
    }

    try {
      await API.post("cart/", {
        product: product.id,
        quantity,
      });

      alert("Product added to cart");
    } catch (error) {
      alert("Failed to add product");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center text-softText">Loading...</div>;
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="h-96 bg-milk rounded-2xl flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">🥛</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <p className="text-sky font-semibold mb-2">
            {product.category_name}
          </p>

          <h1 className="text-4xl font-bold text-darkText mb-4">
            {product.name}
          </h1>

          <p className="text-softText mb-5">{product.description}</p>

          <p className="text-3xl font-bold text-sky mb-2">₹{product.price}</p>

          <p className="text-softText mb-2">Unit: {product.unit}</p>

          <p
            className={
              product.stock_quantity > 0
                ? "text-mint font-semibold mb-6"
                : "text-red-500 font-semibold mb-6"
            }
          >
            {product.stock_quantity > 0
              ? `In Stock: ${product.stock_quantity}`
              : "Out of Stock"}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              className="w-10 h-10 bg-milk rounded-xl"
            >
              -
            </button>

            <span className="text-xl font-bold">{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-milk rounded-xl"
            >
              +
            </button>
          </div>

          <button
            disabled={product.stock_quantity <= 0}
            onClick={addToCart}
            className="w-full bg-sky text-white py-3 rounded-xl hover:shadow-md transition disabled:bg-gray-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;