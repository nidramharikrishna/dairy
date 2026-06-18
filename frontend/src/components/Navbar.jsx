import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-sky font-semibold"
      : "text-softText hover:text-sky transition";

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
        <Link to="/" className="text-2xl font-bold text-darkText">
          🥛 Dairy
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
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>

              <NavLink to="/products" className={linkClass}>
                Products
              </NavLink>
            </>
          )}

          {user && !isAdmin && (
            <>
              <NavLink to="/cart" className={linkClass}>
                Cart
              </NavLink>

              <NavLink to="/orders" className={linkClass}>
                Orders
              </NavLink>

              <NavLink to="/wishlist" className={linkClass}>
                Wishlist
              </NavLink>

              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin Panel
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-sky text-white px-4 py-2 rounded-xl hover:shadow-md transition"
              >
                Register
              </NavLink>
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