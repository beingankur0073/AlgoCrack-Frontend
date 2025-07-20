import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import backImg from "../assets/back.jpg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { loginSchema, signUpSchema } from "../utils/inputValidation.js";




const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm({ resolver: zodResolver(loginSchema) });

  // Sign up form
  const {
    register: signUpRegister,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
    setValue,
    trigger,
    
  } = useForm({ resolver: zodResolver(signUpSchema) });

  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("avatar", file);
      trigger("avatar");
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // LOGIN
  const onLogin = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/users/login", {
        username: data.username,
        password: data.password
      });
      console.log("Login response:", res.data); 
      const { user, accessToken,refreshToken } = res.data.data;
      login(user, accessToken, refreshToken);
      toast.success(`Welcome back, ${user.username}!`);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // SIGN UP
  const onSignUp = async (data) => {
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
      setApiError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
        

        {mode === "login" ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">
              Sign In
            </h2>
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 text-white">
              <div>
                <label htmlFor="username" className="block mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...loginRegister("username")}
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${
                    loginErrors.username ? "border-red-400" : "border-white/20"
                  } placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md`}
                  placeholder="Your username"
                />
                {loginErrors.username && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginErrors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...loginRegister("password")}
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white border ${
                    loginErrors.password ? "border-red-400" : "border-white/20"
                  } placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md`}
                  placeholder="Your password"
                />
                {loginErrors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600/80 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
            <p className="text-sm text-center mt-6 text-gray-300">
              Don't have an account?{" "}
              <button className="text-blue-400 hover:underline" onClick={() => setMode("signup")}>
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">
              Create Account
            </h2>

            <div className="flex justify-center mb-6">
              <div
                className="w-24 h-24 rounded-full border-2 border-blue-500 cursor-pointer overflow-hidden"
                onClick={() => document.getElementById("avatarInput")?.click()}
                title="Click to upload avatar"
              >
                <img
                  src={avatarPreview || "https://i.pravatar.cc/100?img=68"}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {signUpErrors.avatar && (
              <p className="text-red-400 text-sm text-center -mt-4 mb-4">
                {signUpErrors.avatar.message}
              </p>
            )}

            <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4" encType="multipart/form-data">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...signUpRegister("fullName")}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
                />
                {signUpErrors.fullName && (
                  <p className="text-red-400 text-sm mt-1">
                    {signUpErrors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  {...signUpRegister("username")}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
                />
                {signUpErrors.username && (
                  <p className="text-red-400 text-sm mt-1">
                    {signUpErrors.username.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  {...signUpRegister("email")}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
                />
                {signUpErrors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {signUpErrors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...signUpRegister("password")}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/20 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-md"
                />
                {signUpErrors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {signUpErrors.password.message}
                  </p>
                )}
              </div>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              {apiError && (
                <p className="text-red-400 text-sm text-center">
                  {apiError}
                </p>
              )}
              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600/80 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </form>
            <p className="text-sm text-center mt-6 text-gray-300">
              Already have an account?{" "}
              <button className="text-blue-400 hover:underline" onClick={() => setMode("login")}>
                Log in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
