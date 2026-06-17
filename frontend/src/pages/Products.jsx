import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await API.get("categories/");
      setCategories(res.data);
    } catch (error) {
      console.log("Failed to fetch categories");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (categoryQuery) {
        params.append("category", categoryQuery);
      }

      const url = params.toString()
        ? `products/?${params.toString()}`
        : "products/";

      const res = await API.get(url);
      setProducts(res.data);
    } catch (error) {
      console.log("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (categoryId) => {
    const newParams = {};

    if (searchQuery) {
      newParams.search = searchQuery;
    }

    if (categoryId) {
      newParams.category = categoryId;
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryQuery]);

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-darkText">Dairy Products</h1>
          <p className="text-softText mt-2">
            Browse fresh milk, curd, paneer, ghee, butter and more.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => selectCategory("")}
              className={
                !categoryQuery
                  ? "bg-sky text-white px-5 py-2 rounded-xl shadow-sm"
                  : "bg-white text-darkText px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              }
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={
                  String(categoryQuery) === String(cat.id)
                    ? "bg-sky text-white px-5 py-2 rounded-xl shadow-sm"
                    : "bg-white text-darkText px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition"
                }
              >
                {cat.name}
              </button>
            ))}

            {(searchQuery || categoryQuery) && (
              <button
                onClick={clearFilters}
                className="bg-butter px-5 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                Clear Filters
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="text-softText mt-4">
              Search results for:{" "}
              <span className="font-semibold text-darkText">
                "{searchQuery}"
              </span>
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center text-softText">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-6xl mb-4">🥛</div>
            <h2 className="text-2xl font-bold">No products found</h2>
            <p className="text-softText mt-2">
              Try another search or choose another category.
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

export default Products;