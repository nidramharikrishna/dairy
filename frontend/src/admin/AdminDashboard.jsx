import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const res = await API.get("admin/stats/");
      setStats(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load admin statistics");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="p-10">
        <div className="bg-red-50 text-red-600 p-5 rounded-2xl">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-10 text-center text-softText">
        Loading dashboard statistics...
      </div>
    );
  }

  const cards = [
  { title: "Total Revenue", value: `₹${stats.total_revenue}`, icon: "💰" },
  { title: "Total Orders", value: stats.total_orders, icon: "📦" },
  { title: "Products", value: stats.total_products, icon: "🥛" },
  { title: "Categories", value: stats.total_categories, icon: "🗂️" },
  { title: "Customers", value: stats.total_users, icon: "👥" },
  { title: "Delivered Orders", value: stats.delivered_orders, icon: "✅" },
  {
    title: "Top Product",
    value: stats.top_products?.[0]?.product_name_snapshot || "No sales",
    icon: "⭐",
  },
];
  
  return (
    <div className="p-6 bg-cream min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Dashboard Statistics</h1>
        <p className="text-softText mt-2">
          Live statistics from orders, products, categories and customers.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-3">{card.icon}</div>
            <p className="text-softText">{card.title}</p>
            <h2 className="text-2xl font-bold mt-1">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-2xl font-bold mb-4">Low Stock Alerts</h2>

        {stats.low_stock && stats.low_stock.length > 0 ? (
          <div className="space-y-3">
            {stats.low_stock.map((item) => (
              <div
                key={item.id}
                className="flex justify-between bg-red-50 text-red-600 p-3 rounded-xl"
              >
                <span>{item.name}</span>
                <span>{item.stock_quantity} left</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-softText">No low stock products.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-5">Orders by Status</h2>

          {stats.orders_by_status && stats.orders_by_status.length > 0 ? (
            <div className="space-y-3">
              {stats.orders_by_status.map((item) => (
                <div
                  key={item.status}
                  className="flex justify-between bg-cream p-3 rounded-xl"
                >
                  <span>{item.status}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-softText">No order status data.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-5">Best Selling Products</h2>

          {stats.top_products && stats.top_products.length > 0 ? (
            <div className="space-y-3">
              {stats.top_products.map((item) => (
                <div
                  key={item.product_name_snapshot}
                  className="flex justify-between bg-cream p-3 rounded-xl"
                >
                  <span>{item.product_name_snapshot}</span>
                  <span className="font-bold">{item.total_quantity} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-softText">No product sales yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;