import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/api"; // Axios instance that includes baseURL

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {



  const [auth, setAuth] = useState(() => {
  try {
    const userRaw = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userRaw || !token || userRaw === "undefined") return null;

    const user = JSON.parse(userRaw);
    return { user, token };
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    localStorage.removeItem("user"); // clean corrupt data
    localStorage.removeItem("token");
    return null;
  }
});

const updateUser = (userData) => {
    setAuth((prev) => ({ ...prev, user: { ...prev.user, ...userData } }));
  };


  const login = (user, accessToken,refreshToken) => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAuth(null);
    
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setAuth({ user, token });
  };

  const register = async (formData) => {
    try {
      const res = await axios.post("/user/register", formData); // adjust path if needed
      const { token, user } = res.data.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setAuth({ user, token });

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message || "Registration failed. Try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
