import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function CategoryProducts() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategoryProducts = async () => {
    setLoading(true);

    try {
      const categoryRes = await API.get("categories/");
      const matchedCategory = categoryRes.data.find(
        (cat) => cat.name.toLowerCase() === slug.toLowerCase()
      );

      if (!matchedCategory) {
        setCategoryTitle(slug);
        setProducts([]);
        return;
      }

      setCategoryTitle(matchedCategory.name);

      const productRes = await API.get(
        `products/?category=${matchedCategory.id}`
      );

      setProducts(productRes.data);
    } catch (error) {
      console.log("Failed to fetch category products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [slug]);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sky font-semibold mb-2">Category</p>
            <h1 className="text-4xl font-bold text-darkText">
              {categoryTitle || slug} Products
            </h1>
            <p className="text-softText mt-2">
              Fresh {categoryTitle || slug} products available for delivery.
            </p>
          </div>

          <Link
            to="/products"
            className="bg-white px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition"
          >
            View All Products
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-softText">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-6xl mb-4">🥛</div>
            <h2 className="text-2xl font-bold">No products found</h2>
            <p className="text-softText mt-2">
              No products are available in this category.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProducts;