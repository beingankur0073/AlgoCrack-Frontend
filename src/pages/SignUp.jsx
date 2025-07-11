import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../context/AuthContext";
import backImg from "../assets/back.jpg";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Define the schema for form validation
const signUpSchema = z.object({
  fullName: z.string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  avatar: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, "Max image size is 5MB")
    .refine(
      file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported"
    )
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("avatar", file);
      trigger("avatar");
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError(null);
      
      const form = new FormData();
      form.append("fullName", data.fullName);
      form.append("email", data.email);
      form.append("username", data.username);
      form.append("password", data.password);
      form.append("avatar", data.avatar);

      const res = await axios.post("/users/register", form);
      const user = res.data.data;
      login(user, "");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
      setApiError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white px-4"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-md bg-white/10 border border-white/30 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">
          Create Account
        </h2>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-full border-2 border-blue-500 cursor-pointer overflow-hidden"
            onClick={handleAvatarClick}
            title="Click to upload avatar"
          >
            <img
              src={avatarPreview || "https://i.pravatar.cc/100?img=68"}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {errors.avatar && (
          <p className="text-red-400 text-sm text-center -mt-4 mb-4">
            {errors.avatar.message}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
          {/* Full Name */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName")}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />

          {/* API Error */}
          {apiError && (
            <p className="text-red-400 text-sm text-center">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600/80 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;