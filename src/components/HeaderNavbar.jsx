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
    <div className="flex justify-center w-full  mt-3 mr-30">
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
                ${isActive ? "bg-green-400/40 text-blue-100" : "text-white hover:bg-white/20 hover:text-blue-200"}
              `}
            >
              <span className="relative group flex items-center">
                <Icon size={18} />
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs
                    bg-black/80 text-white px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100
                    transition pointer-events-none z-20"
                >
                  {item.label}
                </span>
              </span>
            </span>
          );
        })}
      </nav>
    </div>
  );
};

export default HeaderNavbar;
