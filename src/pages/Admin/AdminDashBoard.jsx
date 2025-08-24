import { useNavigate } from "react-router-dom";
import { Users, BarChart4, BookOpen } from "lucide-react"; // Added BookOpen icon
import AdminDashboardCard from "../../components/AdminDashboardPage/AdminDashboardCard.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto pt-2">
      <h1 className="text-4xl font-bold text-emerald-400 mb-20 text-center">
        Admin Dashboard
      </h1>
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
     
    

        <AdminDashboardCard
        onClick={() => navigate("/admin/users-analytics")}
        Icon={Users}
        iconColor="text-cyan-400"
        hoverBg="hover:bg-emerald-900/90"
        title="Users Analytics"
        titleColor="text-cyan-300"
        description="See statistics and advanced insights on user growth, demographics, and engagement."
      />

        

        <AdminDashboardCard
        onClick={() => navigate("/admin/problems-analytics")}
        Icon={BarChart4}
        iconColor="text-amber-400"
        hoverBg="hover:bg-orange-900/90"
        title="Problems Analytics"
        titleColor="text-amber-300"
        description="Analyze problem usage, difficulty trends, language choices, and more."
      />

        <AdminDashboardCard
        onClick={() => navigate("/admin/learn-analytics")}
        Icon={BookOpen}
        iconColor="text-purple-400"
        hoverBg="hover:bg-purple-900/80"
        title="Learn Analytics"
        titleColor="text-purple-300"
        description="Track learning progress, module completions, and engagement with study materials."
      />

        {/* Learn Analytics */}
       
      </div>
    </div>
  );
};

export default AdminDashboard;
