import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import toast from "react-hot-toast";
import backImg from "../../assets/back.jpg";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AdminUsersAnalytics = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

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

  if (!stats) {
    return (
      <div className="h-40 flex justify-center items-center text-gray-400">
        Loading users analytics...
      </div>
    );
  }

  // Prepare signups data
  const signupsData = stats.usersJoinedOverTime.map(item => ({
    date: item._id,
    users: item.count
  }));

  return (
    <div className="relative min-h-screen" style={{
      backgroundImage: `url(${backImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/60 z-0" />
      <div className="relative z-10 p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-cyan-300">User Analytics</h1>

        <div className="bg-gray-900/90 p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold text-gray-300 mb-2">Total Users</h2>
          <p className="text-2xl text-cyan-400 font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gray-900/90 p-4 rounded-lg shadow mb-6">
          <h2 className="font-semibold text-gray-300 mb-2">User Signups Over Time</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip contentStyle={{ backgroundColor: "#333", borderColor: "#555" }} />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/90 p-3 rounded-lg shadow-md max-h-[500px] overflow-y-auto text-sm">
          <h2 className="text-lg font-semibold mb-2 text-cyan-300">All Users ({users.length})</h2>
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id} className="flex flex-col gap-1 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-2">
                  <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full border" />
                  <div>
                    <p className="text-sm font-semibold">{u.fullName} <span className="text-gray-400">({u.username})</span></p>
                    <p className="text-xs text-gray-400">Role: {u.role}</p>
                    <p className="text-xs text-gray-400">Created: {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default AdminUsersAnalytics;
