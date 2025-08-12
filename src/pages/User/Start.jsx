
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div className="start-page min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900 via-green-800 to-black text-white">
      {/* Logo / Header */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-4"
      >
        AlgoCrack 🚀
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg text-center max-w-xl"
      >
        Master algorithms & crack coding interviews — with fun challenges, realtime leaderboards, and analytics!
      </motion.p>

      {/* Cool animated image */}
      <motion.img
        src="/algo-illustration.svg"
        alt="Algo Diagram"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 80 }}
        className="w-72 my-6"
      />

      {/* Join Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/auth")}
        className="px-8 py-3 mt-6 rounded-lg bg-pink-500 hover:bg-pink-600 text-lg font-semibold shadow-lg"
      >
        Join Now
      </motion.button>
    </div>
  );
};

export default StartPage;
