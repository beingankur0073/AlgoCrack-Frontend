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
  const [showMobileNav, setShowMobileNav] = useState(false);

  const dropdownRef = useRef(null);
  const avatarUrl = auth?.user?.avatar || "https://i.pravatar.cc/40?img=3";

  const logoVariants = {
    initial: {
      backgroundImage: "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
      opacity: 0.9,
    },
    animate: {
      backgroundImage: [
        "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
        "linear-gradient(to top left, #030712, #f43f5e, #ffffff)",
        "linear-gradient(to top left, #64748b, #15803d, #ffffff)",
      ],
      opacity: [1, 0.9, 1],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    dispatch(logoutAction());
    navigate("/");
  };

  const handleApplyAdmin = () => {
    toast.success("Admin application submitted! (Demo)");
    setShowDropdown(false);
  };

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
      <header className="sticky top-0 z-30 bg-gradient-to-tr from-black via-stone-950 to-green-900 py-4 px-4 shadow-md mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* 🍔 BURGER (MOBILE ONLY) */}
          <button
            onClick={() => setShowMobileNav(true)}
            className="md:hidden text-white"
          >
            <FiMenu size={26} />
          </button>

          {/* LOGO */}
          <div className="relative flex items-center justify-center mx-auto md:mx-0">
            <motion.div
              animate={{
                opacity: [1, 0.7, 1],
                filter: ["blur(40px)", "blur(60px)", "blur(40px)"],
                background: [
                  "radial-gradient(circle, #64748b 0%, #15803d 45%, #fff 60%)",
                  "radial-gradient(circle, #030712 0%, #f43f5e 45%, #fff 60%)",
                  "radial-gradient(circle, #64748b 0%, #15803d 45%, #fff 60%)",
                ],
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute w-[140px] h-[70px] blur-3xl pointer-events-none"
            />

            <motion.h1
              className="relative text-3xl sm:text-4xl bg-gradient-to-tl from-slate-500 via-green-700 to-white bg-clip-text text-transparent cursor-pointer z-10"
              onClick={() => navigate("/")}
              variants={logoVariants}
              initial="initial"
              animate="animate"
            >
              AlgoCrack
            </motion.h1>
          </div>

          {/* NAVBAR (DESKTOP ONLY) */}
          <div className="hidden md:block">
            <HeaderNavbar />
          </div>

          {/* PROFILE MENU */}
          <div className="relative ml-3" ref={dropdownRef}>
            <div
              className="relative group w-10 h-10 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full rounded-full border-2 border-blue-400 object-cover group-hover:opacity-50 transition"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-[10px] font-bold text-white bg-black/60 px-1 py-0.5 rounded">
                  Menu
                </span>
              </div>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-tr from-neutral-950 via-gray-950 to-rose-500 border border-gray-700 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-800"
                >
                  Profile
                </button>
                <button
                  onClick={handleApplyAdmin}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-800 text-yellow-400"
                >
                  Apply Admin
                </button>
                <button
                  onClick={() => setShowChangePasswordDialog(true)}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-800"
                >
                  Change Password
                </button>
                <hr className="border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-800 text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 📱 MOBILE NAV DRAWER */}
      <AnimatePresence>
        {showMobileNav && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowMobileNav(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-black via-zinc-900 to-green-900 z-50 p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Menu</span>
                <FiX size={22} onClick={() => setShowMobileNav(false)} />
              </div>

              <nav className="flex flex-col gap-4">
                <button onClick={() => navigate("/problems")}>Problems</button>
                <button onClick={() => navigate("/learn")}>MCQs</button>
                <button onClick={() => navigate("/leaderboard")}>Leaderboard</button>
                <button onClick={() => navigate("/profile")}>Profile</button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showChangePasswordDialog && (
        <ChangePasswordDialog setShowChangePasswordDialog={setShowChangePasswordDialog} />
      )}
    </>
  );
};

export default Header;
