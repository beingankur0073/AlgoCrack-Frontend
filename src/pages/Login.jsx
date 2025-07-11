import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import backImg from "../assets/back.jpg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the schema for form validation
const loginSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters")
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/users/login", {
        username: data.username,
        password: data.password
      });
      
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/30 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">
          Sign In
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${
                errors.username ? "border-red-400" : "border-white/20"
              } placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md`}
              placeholder="Your username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${
                errors.password ? "border-red-400" : "border-white/20"
              } placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md`}
              placeholder="Your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600/80 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;