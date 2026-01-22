import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

import ChangePasswordDialog from "./ChangePasswordDialog.jsx";
import HeaderNavbar from "./HeaderNavbar.jsx";
import { logout as logoutAction } from "../redux/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const dropdownRef = useRef(null);
  const avatarUrl = auth?.user?.avatar || "https://i.pravatar.cc/40?img=3";

  /* ================= LOGO ANIMATION ================= */
  const logoVariants = {
    initial: {
      backgroundImage: "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
    },
    animate: {
      backgroundImage: [
        "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
        "linear-gradient(to top left, #030712, #f43f5e, #ffffff)",
        "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
      ],
      transition: { duration: 10, repeat: Infinity },
    },
  };

  /* ================= ACTIONS ================= */
  const handleLogout = () => {
    toast.success("Logged out successfully!");
    dispatch(logoutAction());
    navigate("/");
  };

  const navItems = [
    { label: "Problems", path: "/problems" },
    { label: "MCQs", path: "/learn" },
    { label: "Leaderboard", path: "/leaderboard" },
    { label: "Profile", path: "/profile" },
  ];

  /* ================= OUTSIDE CLICK ================= */
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
    <>
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-tr from-black via-stone-950 to-green-900 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* 🍔 BURGER ICON (MOBILE) */}
          <button
            onClick={() => setShowDrawer(true)}
            className="md:hidden text-white"
          >
            <FiMenu size={26} />
          </button>

          {/* ================= LOGO ================= */}
          <motion.h1
            onClick={() => navigate("/")}
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-tl from-slate-500 via-green-700 to-white bg-clip-text text-transparent cursor-pointer"
          >
            AlgoCrack
          </motion.h1>

          {/* ================= DESKTOP NAV ================= */}
          <div className="hidden md:flex items-center gap-6">
            <HeaderNavbar />
          </div>

          {/* ================= PROFILE MENU ================= */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={avatarUrl}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover cursor-pointer"
            />

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-950 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800"
                >
                  Profile
                </button>
                <button
                  onClick={() => setShowChangePasswordDialog(true)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800"
                >
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 left-0 h-full w-[75%] max-w-xs bg-gradient-to-br from-black via-zinc-900 to-green-900 z-50 p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-white">Menu</span>
                <FiX
                  size={24}
                  className="text-white cursor-pointer"
                  onClick={() => setShowDrawer(false)}
                />
              </div>

              <nav className="flex flex-col gap-5">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.path);
                      setShowDrawer(false);
                    }}
                    className="text-left text-lg text-gray-200 hover:text-green-400 transition"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showChangePasswordDialog && (
        <ChangePasswordDialog
          setShowChangePasswordDialog={setShowChangePasswordDialog}
        />
      )}
    </>
  );
};

export default Header;
