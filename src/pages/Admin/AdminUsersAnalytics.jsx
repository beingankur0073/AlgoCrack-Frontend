import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { UserDetailsModal } from "../../components/AdminUserPage/UserDetailsModal.jsx";

const AnimatedNumber = ({ value }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5 });
    return controls.stop;
  }, [value]);

  return <motion.span>{rounded}</motion.span>;
};





const AdminUsersAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
   const [selectedUser, setSelectedUser] = useState(null); // for view 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statRes] = await Promise.all([
          axios.get("/admin/users"),
          axios.get("/stats"),
        ]);
        setUsers(userRes.data.data);
        setStats(statRes.data.data);
      } catch (error) {
        toast.error("Failed to fetch user analytics");
      }
    };
    fetchData();
  }, []);


    const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (!stats) {
    return (
      <div className="h-40 flex justify-center items-center text-gray-400">
        Loading users analytics...
      </div>
    );
  }

  const signupsData = stats.usersJoinedOverTime.map((item) => ({
    date: item._id,
    users: item.count,
  }));

  return (
    <motion.div
      className="relative z-10 p-8 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
         User Analytics
      </motion.h1>

      {/* Total Users Card */}
      <motion.div
  className="bg-gray-900/60 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-700 mb-6 w-48"
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  <h2 className="font-semibold text-gray-300 text-sm mb-1">Total Users</h2>
  <p className="text-2xl text-cyan-400 font-bold">
    <AnimatedNumber value={stats.totalUsers} />
  </p>
</motion.div>


      {/* Chart Card */}
      <motion.div
        className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-700 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-semibold text-gray-300 mb-4">
          User Signups Over Time
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={signupsData} key={stats.totalUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="users"
                fill="url(#colorUsers)"
                name="New Users"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}       // Enable animation
                animationBegin={0}             // Start immediately
                animationDuration={1500}       // Duration in milliseconds
              />
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

 
     <>
      {/* Users List */}
      <motion.div
        className="bg-gray-900/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-700 max-h-[500px] overflow-y-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-cyan-300">
          All Users ({users.length})
        </h2>
        <ul className="space-y-3">
          {users.map((u, i) => (
            <motion.li
              key={u._id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-800/40 hover:bg-gray-700/40 transition-colors border border-gray-700 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              {/* Click on avatar/name opens details modal */}
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => setSelectedUser(u)}
              >
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-10 h-10 rounded-full border border-gray-600"
                />
                <div>
                  <p className="text-sm font-semibold">
                    {u.fullName}{" "}
                    <span className="text-gray-400">({u.username})</span>
                  </p>
                  <p className="text-xs text-gray-400">Role: {u.role}</p>
                  <p className="text-xs text-gray-500">
                    Created:{" "}
                    <AnimatedNumber
                      value={new Date(u.createdAt).getFullYear()}
                    />{" "}
                    -{" "}
                    <AnimatedNumber
                      value={new Date(u.createdAt).getMonth() + 1}
                    />{" "}
                    -{" "}
                    <AnimatedNumber
                      value={new Date(u.createdAt).getDate()}
                    />
                  </p>
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent modal opening
                  handleDeleteUser(u._id);
                }}
                className="text-red-400 hover:text-red-500 text-sm"
              >
                🗑
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* User details modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>



    </motion.div>
  );
};

export default AdminUsersAnalytics;
