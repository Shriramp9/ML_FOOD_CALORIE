import { motion } from "motion/react";
import { Link } from "react-router";
import { Camera, Utensils } from "lucide-react";

export function Onboarding() {
  const floatingEmojis = ["🍎", "🍕", "🥗", "🍔", "🥑", "🍇", "🥦", "🍌"];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Floating food emoji particles */}
      {floatingEmojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-20"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-[375px] w-full">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00E5A0] to-[#7C3AED] p-1">
              <div className="w-full h-full rounded-full bg-[#0A0A0F] flex items-center justify-center">
                <div className="relative">
                  <Camera className="w-10 h-10 text-[#00E5A0]" />
                  <Utensils className="w-6 h-6 text-[#7C3AED] absolute -bottom-1 -right-1" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* App name and tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl mb-3"
          style={{ fontWeight: 700 }}
        >
          CalorieLens
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#8B8B9E] mb-12 text-lg"
        >
          Eat Smart. See Clear.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4"
        >
          <Link to="/signup">
            <button className="w-full h-[52px] rounded-[50px] bg-gradient-to-r from-[#00E5A0] to-[#7C3AED] text-white transition-transform active:scale-95"
              style={{ fontWeight: 500 }}>
              Get Started
            </button>
          </Link>
          <Link to="/login">
            <button className="w-full h-[52px] rounded-[50px] border border-white/20 text-white transition-transform active:scale-95"
              style={{ fontWeight: 500 }}>
              I have an account
            </button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#8B8B9E] text-sm mt-12"
        >
          Powered by YOLOv8 AI
        </motion.p>
      </div>
    </div>
  );
}
