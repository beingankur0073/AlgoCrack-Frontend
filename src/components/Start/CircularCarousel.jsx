import { motion } from "framer-motion";
import {
  Code,
  Trophy,
  BarChart2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
const badgeClass =
  "ml-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-black text-xs font-bold rounded-full px-3 py-0.5 shadow-md";

const FEATURES = [
  {
    icon: <Code size={40} className="text-pink-400" />,
    title: "DSA Problems",
    desc: "Solve curated coding challenges. Learn by doing.",
    badge: "🔥 Trending",
  },
  {
    icon: <BookOpen size={40} className="text-blue-400" />,
    title: "CS MCQs",
    desc: "Crack OS, DBMS, OOPs, and more. Practice fundamentals.",
    badge: "New",
  },
  {
    icon: <BarChart2 size={40} className="text-green-400" />,
    title: "Analytics",
    desc: "Track strengths. Improve every week.",
    badge: "",
  },
  {
    icon: <Trophy size={40} className="text-yellow-400" />,
    title: "Leaderboards",
    desc: "Compete in real-time. Climb to the top.",
    badge: "",
  },
];
const CircularCarousel = () => {
    const [index, setIndex] = useState(0);
    
     
      useEffect(() => {
        const timer = setInterval(() => {
          setIndex((prev) => (prev + 1) % FEATURES.length);
        }, 3000);
        return () => clearInterval(timer);
      }, []);
  return (
     <div className="relative flex items-center justify-center w-full h-[400px]">
          {FEATURES.map((feature, i) => {
            const angle = (i - index) * (360 / FEATURES.length); // evenly spread around a circle
            const radius = 150;

            const x = radius * Math.cos((angle * Math.PI) / 180);
            const y = radius * Math.sin((angle * Math.PI) / 180);

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0 }}
                animate={{
                  x,
                  y,
                  opacity: i === index ? 1 : 0.6,
                  scale: i === index ? 1.2 : 0.9,
                }}
                transition={{ duration: 0.8 }}
                className="absolute flex flex-col items-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-green-900 rounded-xl shadow-lg p-5 w-52 text-center"
              >
                {feature.icon}
                <div className="flex items-center mt-2">
                  <h3 className="text-lg font-bold text-pink-200">
                    {feature.title}
                  </h3>
                  {feature.badge && (
                    <span className={badgeClass}>
                      {feature.badge === "New" && (
                        <Sparkles
                          size={13}
                          className="inline mb-1 mr-1"
                        />
                      )}
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mt-1">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

  )
}

export default CircularCarousel