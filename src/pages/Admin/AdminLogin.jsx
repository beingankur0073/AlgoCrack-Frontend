import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/api";
import toast from "react-hot-toast";
import backImg from "../../assets/back.jpg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/admin/login", { email, password });

      console.log("Admin login response:", res.data);

      toast.success("Admin logged in successfully!");
      // Optionally store admin token if needed
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error?.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center px-4 overflow-hidden text-white relative"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-white drop-shadow">Admin Login</h2>
<form onSubmit={handleAdminLogin} className="space-y-5">
  <div>
    <label htmlFor="email" className="block mb-1 text-sm font-medium text-emerald-100">
      Email
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-emerald-300/20 placeholder-emerald-100/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>

  <div>
    <label htmlFor="password" className="block mb-1 text-sm font-medium text-emerald-100">
      Password
    </label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-emerald-300/20 placeholder-emerald-100/70 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
    />
  </div>

  {/* Button Changes: 
      - Removed 'w-full'
      - Added 'w-40' (fixed width) or use 'w-1/2' (50% width)
      - Added 'mx-auto block' to center it
  */}
  <button
    type="submit"
    disabled={loading}
    className="text-sm w-20 mx-auto block bg-gradient-to-r from-emerald-400 via-yellow-500 to-emerald-400 hover:brightness-110 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all"
  >
    {loading ? "Logging.." : "Login"}
  </button>
</form>

      </div>
    </div>
  );
};

export default AdminLogin;
