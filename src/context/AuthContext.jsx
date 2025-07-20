import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const userRaw = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!userRaw || !accessToken || !refreshToken || userRaw === "undefined") {
        return null;
      }

      const user = JSON.parse(userRaw);
      return { user, accessToken, refreshToken };
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  });

  const updateUser = (userData) => {
    setAuth((prev) => ({
      ...prev,
      user: { ...prev?.user, ...userData },
    }));
    localStorage.setItem("user", JSON.stringify({ ...auth.user, ...userData }));
  };

  const login = (user, accessToken, refreshToken) => {
    // Clear previous session
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Set new session
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuth({ user, accessToken, refreshToken });
  };

  const register = async (formData) => {
    try {
      const res = await axios.post("/user/register", formData);
      const { user, accessToken, refreshToken } = res.data.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setAuth({ user, accessToken, refreshToken });

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Registration failed. Try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
