// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/api"; // Your Axios instance, MUST have withCredentials: true

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize auth state:
  // We only store the 'user' object in localStorage.
  // The 'isAuthenticated' flag will be derived from whether 'user' data exists.
  // Tokens are managed by the browser via HTTP-only cookies.
  const [auth, setAuth] = useState(() => {
    try {
      const userRaw = localStorage.getItem("user");

      // If no user data or it's 'undefined', assume not authenticated
      if (!userRaw || userRaw === "undefined") {
        return { user: null, isAuthenticated: false };
      }

      const user = JSON.parse(userRaw);
      // Return user data and set isAuthenticated to true if user data is found
      return { user, isAuthenticated: true };
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user"); // Clean corrupt user data
      // No need to remove 'token' from localStorage as we no longer store it
      return { user: null, isAuthenticated: false };
    }
  });

  // Function to update user data in state and localStorage
  const updateUser = (userData) => {
    setAuth((prev) => {
      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Keep localStorage in sync
      return { ...prev, user: updatedUser };
    });
  };

  // Login function: Backend handles cookie setting. Frontend only stores user data.
  const login = (user) => { // 'token' parameter removed
    localStorage.removeItem("user"); // Clear any old user data
    // No need to remove 'token' from localStorage
    setAuth(null); // Clear state before setting new

    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, isAuthenticated: true });
  };

  // Register function: Backend handles cookie setting. Frontend only stores user data.
  const register = async (formData) => {
    try {
      // Axios request will automatically include withCredentials for cookie handling
      const res = await axios.post("/users/register", formData); // Ensure path is '/users/register' not '/user/register' if your routes are /api/v1/users
      const { user } = res.data.data; // Expecting only 'user' data in response, tokens are in cookies

      localStorage.setItem("user", JSON.stringify(user));
      setAuth({ user, isAuthenticated: true });

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

  // Logout function: Clears local state and sends request to backend to clear HTTP-only cookies.
  const logout = async () => {
    try {
      await axios.post("/users/logout"); // Call your backend's logout endpoint
    } catch (error) {
      console.error("Logout failed on server:", error);
      // Even if server logout fails, clear local state for user experience
    } finally {
      localStorage.removeItem("user"); // Clear user data from localStorage
      // No need to remove 'token' from localStorage
      setAuth({ user: null, isAuthenticated: false }); // Reset auth state
    }
  };

  // The useEffect can be useful for initial checks or re-authentication if needed,
  // but for basic HTTP-only cookie flow, the useState initialization is often sufficient.
  // If you later implement a /refresh-token endpoint or /current-user check on app load,
  // you might use useEffect here to call that endpoint to verify session validity.
  useEffect(() => {
    // Example: On component mount, check if user is still authenticated by trying to fetch current user
    const checkAuthStatus = async () => {
      if (auth.isAuthenticated && !auth.user) { // If isAuthenticated is true but user object is missing (e.g., localStorage cleared manually)
        try {
          const res = await axios.get("/users/current-user"); // Call an endpoint that requires authentication
          setAuth({ user: res.data.data, isAuthenticated: true });
          localStorage.setItem("user", JSON.stringify(res.data.data)); // Update localStorage
        } catch (error) {
          console.error("Session validation failed:", error);
          logout(); // Log out if session is invalid
        }
      }
    };
    checkAuthStatus();
  }, [auth.isAuthenticated, auth.user]); // Dependencies for useEffect


  return (
    <AuthContext.Provider value={{ auth, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);