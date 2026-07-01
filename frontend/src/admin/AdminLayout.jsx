import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { logout, user } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-sky text-white px-4 py-3 rounded-xl block font-semibold"
      : "text-softText hover:bg-cream px-4 py-3 rounded-xl block transition";

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-white shadow-sm p-6 hidden md:flex flex-col">
        <div className="mb-10">
          <img
            src="/logo.png"
            alt="Taaza Dairy"
            className="h-16 w-auto"
          />
          <p className="text-softText text-sm mt-1">Management Panel</p>
        </div>

        <nav className="space-y-3 flex-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>

        <button
          onClick={logout}
          className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">Admin Panel</h2>
            <p className="text-softText text-sm">
              Logged in as {user?.username}
            </p>
          </div>

          <button
            onClick={logout}
            className="md:hidden bg-red-50 text-red-600 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="bg-white border-t px-6 py-4 text-center text-softText text-sm">
          © 2026 Dairy Admin Panel. For management use only.
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;