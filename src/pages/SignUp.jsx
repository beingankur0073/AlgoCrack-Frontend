import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api"; // or just axios if you use default
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("username", formData.username);
    form.append("password", formData.password);
    form.append("avatar", formData.avatar);

    try {
      setLoading(true);
      const res = await axios.post("/auth/register", form);
      const { user, token } = res.data.data;
      login(user, token);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error?.response?.data || error.message);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
          />

          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full text-sm text-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
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
