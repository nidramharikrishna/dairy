import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedUser = await login(form.username, form.password);

      if (loggedUser?.is_staff) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm"
      >
        <h2 className="text-3xl font-bold mb-2 text-darkText">Login</h2>
        <p className="text-softText mb-6">Welcome back to Dairy</p>

        {error && (
          <p className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">
            {error}
          </p>
        )}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 mb-4 outline-none focus:border-sky"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 mb-4 outline-none focus:border-sky"
          required
        />

        <button className="w-full bg-sky text-white py-3 rounded-xl hover:shadow-md transition">
          Login
        </button>

        <p className="text-center mt-5 text-softText">
          New user?{" "}
          <Link to="/register" className="text-sky font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;