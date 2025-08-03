import React from "react";
import { useNavigate } from "react-router-dom";
import backImg from "../assets/back.jpg";
import { Users, BarChart4 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
 
     
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto pt-16">
        <h1 className="text-4xl font-bold text-emerald-400 mb-10 text-center">Admin Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {/* Users Analytics */}
          <div
            onClick={() => navigate("/admin/users-analytics")}
            className="group cursor-pointer bg-gray-900/90 hover:bg-emerald-900/80 border border-gray-700 rounded-lg p-8 flex-1 text-center shadow-xl transition-all duration-200"
          >
            <Users size={40} className="mx-auto mb-4 text-cyan-400 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">Users Analytics</h2>
            <p className="text-gray-300 text-sm">See statistics and advanced insights on user growth, demographics, and engagement.</p>
          </div>
          {/* Problems Analytics */}
          <div
            onClick={() => navigate("/admin/problems-analytics")}
            className="group cursor-pointer bg-gray-900/90 hover:bg-orange-900/90 border border-gray-700 rounded-lg p-8 flex-1 text-center shadow-xl transition-all duration-200"
          >
            <BarChart4 size={40} className="mx-auto mb-4 text-amber-400 group-hover:scale-110 transition" />
            <h2 className="text-2xl font-semibold text-amber-300 mb-2">Problems Analytics</h2>
            <p className="text-gray-300 text-sm">Analyze problem usage, difficulty trends, language choices, and more.</p>
          </div>
        </div>
      </div>
  
  );
};

export default AdminDashboard;
