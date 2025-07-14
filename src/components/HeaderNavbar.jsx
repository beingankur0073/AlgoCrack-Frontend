
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  UserCircle,
  BarChart2,
  ShieldCheck
} from "lucide-react";
const navItems = [
    { label: "Home", path: "/" },
    { label: "Learn", path: "/learn" },
    { label: "Profile", path: "/profile" },
    { label: "Leaderboard", path: "/leaderboard" },
     { label: "Admin", path: "/admin-login" },
  ];

const HeaderNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    
       <div className="flex justify-center w-full mr-35 mt-3">
  <nav className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 flex flex-wrap justify-center items-center gap-4 shadow-lg transition-all max-w-fit mx-auto">
    {navItems.map((item) => {
      const Icon =
        item.label === "Home"
          ? Home
          : item.label === "Learn"
          ? BookOpen
          : item.label === "Profile"
          ? UserCircle
          : item.label === "Leaderboard"
          ? BarChart2
          : ShieldCheck;

      const isActive = location.pathname === item.path;

      return (
        <span
          key={item.label}
          onClick={() => navigate(item.path)}
          className={`flex items-center gap-2 cursor-pointer text-sm sm:text-base font-medium px-3 py-1.5 rounded-full transition-all
            ${isActive ? "bg-blue-600/40 text-blue-100" : "text-white hover:bg-white/20 hover:text-blue-200"}
          `}
        >
          <Icon size={18} />
          <span className="hidden sm:inline">{item.label}</span>
        </span>
      );
    })}
  </nav>
</div>

  )
}

export default HeaderNavbar