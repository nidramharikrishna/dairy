import { Link } from "react-router-dom";

function Home() {
  const categories = [
    { name: "Milk", slug: "milk", icon: "🥛" },
    { name: "Curd", slug: "curd", icon: "🍶" },
    { name: "Paneer", slug: "paneer", icon: "🧀" },
    { name: "Ghee", slug: "ghee", icon: "🧈" },
    { name: "Butter", slug: "butter", icon: "🧈" },
    { name: "Cheese", slug: "cheese", icon: "🧀" },
  ];

  return (
    <div className="bg-cream min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-sky font-semibold mb-3">Fresh Dairy Products</p>

          <h1 className="text-4xl md:text-5xl font-bold text-darkText leading-tight mb-5">
            Pure, fresh and healthy dairy delivered to your door
          </h1>

          <p className="text-softText text-lg mb-8">
            Shop milk, curd, paneer, ghee, butter, cheese and yogurt with a
            clean and simple dairy shopping experience.
          </p>

          <Link
            to="/products"
            className="bg-sky text-white px-6 py-3 rounded-xl hover:shadow-md transition inline-block"
          >
            Shop Now
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="text-8xl mb-5">🥛</div>
          <h2 className="text-2xl font-bold">Farm Fresh Dairy</h2>
          <p className="text-softText mt-2">Milk-white freshness every day</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/category/${cat.slug}`}
              className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-md hover:scale-105 transition"
            >
              <div className="text-5xl mb-3">{cat.icon}</div>
              <p className="font-semibold">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;