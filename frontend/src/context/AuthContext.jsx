import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await API.get("auth/me/");
      setUser(res.data);
      return res.data;
    } catch (error) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await API.post("auth/login/", {
      username,
      password,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const loggedUser = await fetchUser();
    return loggedUser;
  };

  const register = async (username, email, password) => {
    await API.post("auth/register/", {
      username,
      email,
      password,
    });
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);

    window.location.href = "/login";
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.is_staff === true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}