import { useEffect, useState } from "react";
import API from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    unit: "",
    stock_quantity: "",
    image_url: "",
    is_active: true,
  });

  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const catRes = await API.get("categories/");
      const prodRes = await API.get("products/");
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.log("Failed to fetch admin products", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    try {
      await API.post("categories/", {
        name: categoryName.trim(),
      });

      setCategoryName("");
      fetchData();
    } catch (error) {
      alert(JSON.stringify(error.response?.data || "Failed to create category"));
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await API.delete(`categories/${id}/`);
      fetchData();
    } catch (error) {
      alert("Cannot delete category with products.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setForm({
      category: "",
      name: "",
      description: "",
      price: "",
      unit: "",
      stock_quantity: "",
      image_url: "",
      is_active: true,
    });

    setEditingId(null);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const payload = {
      category: Number(form.category),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      unit: form.unit.trim(),
      stock_quantity: Number(form.stock_quantity),
      image_url: form.image_url.trim(),
      is_active: Boolean(form.is_active),
    };

    try {
      if (editingId) {
        await API.patch(`products/${editingId}/`, payload);
      } else {
        await API.post("products/", payload);
      }

      resetForm();
      fetchData();
      alert(editingId ? "Product updated" : "Product created");
    } catch (error) {
      console.log("Product save error:", error.response?.data || error);
      alert(JSON.stringify(error.response?.data || "Failed to save product"));
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      category: product.category || "",
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      unit: product.unit || "",
      stock_quantity: product.stock_quantity || "",
      image_url: product.image_url || "",
      is_active: product.is_active,
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`products/${id}/`);
      fetchData();
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-8">Manage Products</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <form
              onSubmit={createCategory}
              className="bg-white p-6 rounded-2xl shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4">Add Category</h2>

              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="w-full border rounded-xl px-4 py-3 mb-4 outline-none"
              />

              <button className="bg-sky text-white px-5 py-3 rounded-xl">
                Add Category
              </button>
            </form>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Categories</h2>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex justify-between bg-cream p-3 rounded-xl"
                  >
                    <span>{cat.name}</span>

                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {categories.length === 0 && (
                  <p className="text-softText">No categories yet.</p>
                )}
              </div>
            </div>
          </div>

          <form
            onSubmit={saveProduct}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border rounded-xl px-4 py-3 outline-none"
                required
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="border rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                step="0.01"
                min="0"
                className="border rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="Unit e.g. 500ml"
                className="border rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                placeholder="Stock"
                type="number"
                min="0"
                className="border rounded-xl px-4 py-3 outline-none"
                required
              />

              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="Image URL"
                className="border rounded-xl px-4 py-3 outline-none"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="md:col-span-2 border rounded-xl px-4 py-3 outline-none"
              />
            </div>

            {form.image_url && (
              <div className="mt-5">
                <p className="text-softText mb-2">Image Preview</p>
                <img
                  src={form.image_url}
                  alt="Preview"
                  className="w-40 h-32 object-cover rounded-xl border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button className="bg-sky text-white px-6 py-3 rounded-xl">
                {editingId ? "Update Product" : "Create Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-butter px-6 py-3 rounded-xl"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
          <h2 className="text-2xl font-bold mb-5">Product List</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-3">Image</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Active</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl"
                        />
                      ) : (
                        <span className="text-softText">No image</span>
                      )}
                    </td>

                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.category_name}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.stock_quantity}</td>
                    <td className="p-3">{product.is_active ? "Yes" : "No"}</td>

                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => editProduct(product)}
                        className="text-sky"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-softText">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;