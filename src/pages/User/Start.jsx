import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import backImg from "../../assets/back.jpg";
import CircularCarousel from "../../components/Start/CircularCarousel.jsx";

const logoVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

const StartPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white relative px-6"
      style={{
        backgroundImage: `url(${backImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black/40 z-0" />

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT: Logo + Tagline */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-start space-y-6"
        >
          {/* ✅ Gradient Animated Logo */}
          <motion.h1
            className="relative text-6xl md:text-7xl font-extrabold leading-[1.2] 
                       bg-gradient-to-tl from-slate-500 via-green-700 to-white 
                       bg-clip-text text-transparent cursor-pointer z-10"
            onClick={() => navigate("/")}
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            AlgoCrack 
          </motion.h1>

          <p className="text-lg md:text-xl max-w-md text-gray-200">
            Master algorithms & crack coding interviews — with fun challenges,
            realtime leaderboards, and analytics!
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-lg font-semibold shadow-lg"
          >
            Join Now
          </motion.button>
        </motion.div>

        {/* RIGHT: Circular Carousel */}
        <CircularCarousel />
      </div>
    </div>
  );
};

export default StartPage;
