import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const normalLink = "text-softText hover:text-sky transition";
  const activeButton = "text-sky font-semibold";

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Taaza Dairy"
            className="h-16 w-auto"
          />
        </Link>

        {!isAdmin && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="flex bg-cream border rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search milk, curd, paneer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
              />

              <button className="bg-sky text-white px-4 text-sm hover:shadow-md transition">
                Search
              </button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap items-center gap-4">
          {!isAdmin && (
            <>
              <button onClick={() => navigate("/")} className={normalLink}>
                Home
              </button>

              <button
                onClick={() => navigate("/products")}
                className={normalLink}
              >
                Products
              </button>
            </>
          )}

          {user && !isAdmin && (
            <>
              <button onClick={() => navigate("/cart")} className={normalLink}>
                Cart
              </button>

              <button onClick={() => navigate("/orders")} className={normalLink}>
                Orders
              </button>

              <button
                onClick={() => navigate("/wishlist")}
                className={normalLink}
              >
                Wishlist
              </button>

              <button onClick={() => navigate("/profile")} className={normalLink}>
                Profile
              </button>
            </>
          )}

          {isAdmin && (
            <button onClick={() => navigate("/admin")} className={activeButton}>
              Admin Panel
            </button>
          )}

          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className={normalLink}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-sky text-white px-4 py-2 rounded-xl hover:shadow-md transition"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-butter px-4 py-2 rounded-xl hover:shadow-md transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;