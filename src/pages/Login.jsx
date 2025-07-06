import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api"; // your axios instance
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import backImg from "../assets/back.jpg";

const Login = () => {
  const [username, setUsername] = useState(""); // changed from email to username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/users/login", { username, password });

    
      console.log("Login response:", res.data);

      const { user, token } = res.data.data;
      login(user, token); 
       toast.success(`Welcome back, ${user.username}!`);
      navigate("/"); 
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center 
     text-white px-4 overflow-hidden"
       style={{
              backgroundImage: `url(${backImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-0" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 shadow-lg z-30">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
