import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useRef, useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog.jsx";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const dropdownRef = useRef(null);

  const avatarUrl = auth?.user?.avatar || "https://i.pravatar.cc/40?img=3";

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    logout();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await fetch("/users/delete", { method: "DELETE" });
      toast.success("Account deleted successfully!");
      logout();
      navigate("/register");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handleChangePassword = () => {
    setShowChangePasswordDialog(true);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Learn", path: "/learn" },
    { label: "Profile", path: "/profile" },
    { label: "Leaderboard", path: "/leaderboard" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-tr from-black via-stone-950 to-green-900 py-5 px-4 shadow-md mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="sm:text-4xl leading-[1.3] bg-gradient-to-tl from-slate-500 via-green-700 to-white bg-clip-text text-transparent cursor-pointer"
          onClick={() => navigate("/")}
        >
          AlgoCrack
        </h1>

        <nav className="flex items-center gap-6 mr-25">
          {navItems.map((item) => (
            <span
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer text-sm sm:text-base font-medium transition hover:text-blue-400 ${
                location.pathname === item.path ? "text-blue-400" : "text-white"
              }`}
            >
              {item.label}
            </span>
          ))}
        </nav>

        <div className="relative" ref={dropdownRef}>
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="  bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500    absolute right-0 mt-2 w-48  border border-gray-700 rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  navigate("/profile");
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-white"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  handleChangePassword();
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-white"
              >
                Change Password
              </button>
              <button
                onClick={() => {
                  handleDeleteAccount();
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-red-400"
              >
                Delete Account
              </button>
              <hr className="border-gray-700" />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-sm text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showChangePasswordDialog && (
        <ChangePasswordDialog setShowChangePasswordDialog={setShowChangePasswordDialog}/>
      )}



    </header>
  );
};

export default Header;
