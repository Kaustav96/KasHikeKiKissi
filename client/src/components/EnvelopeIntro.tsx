import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface EnvelopeIntroProps {
  onFinish: () => void;
}

export default function EnvelopeIntro({ onFinish }: EnvelopeIntroProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onFinish();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F6F2EA] to-[#EDE5D8]">
      {/* Ambient floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#d4c5a3]"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      <div className="relative">
        {/* Envelope Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{
            scale: isOpening ? 0.95 : 1,
            opacity: isOpening ? 0 : 1,
            y: 0
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          className="relative w-[340px] sm:w-[380px] h-[220px] sm:h-[240px] cursor-pointer"
          onClick={handleOpen}
          whileHover={{ scale: isOpening ? 0.95 : 1.02 }}
          whileTap={{ scale: isOpening ? 0.95 : 0.98 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-4 bg-gradient-radial from-[#d4c5a3]/20 to-transparent rounded-full blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Envelope body */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#EDE5D8] to-[#e3d7c0] rounded-lg shadow-2xl border border-[#d4c5a3]"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
            animate={{
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative corner flourishes */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`absolute w-10 h-10 ${
                  i === 0
                    ? "top-2 left-2"
                    : i === 1
                    ? "top-2 right-2"
                    : i === 2
                    ? "bottom-2 left-2"
                    : "bottom-2 right-2"
                }`}
                style={{
                  borderTop: i < 2 ? "1.5px solid rgba(185,151,91,0.4)" : "none",
                  borderBottom: i >= 2 ? "1.5px solid rgba(185,151,91,0.4)" : "none",
                  borderLeft: i % 2 === 0 ? "1.5px solid rgba(185,151,91,0.4)" : "none",
                  borderRight: i % 2 === 1 ? "1.5px solid rgba(185,151,91,0.4)" : "none",
                }}
              />
            ))}
          </motion.div>

          {/* Envelope flap with opening animation */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[110px] sm:h-[120px] origin-top"
            style={{
              background: "linear-gradient(180deg, #e3d7c0 0%, #d4c5a3 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 65%)",
              transformStyle: "preserve-3d",
              transformOrigin: "top center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            animate={{
              rotateX: isOpening ? -180 : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              rotateX: isOpening ? -180 : -15,
            }}
          />

          {/* Wax seal and instruction text container */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            animate={{
              scale: isOpening ? 0.8 : 1,
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Wax seal */}
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white font-serif text-xl shadow-xl mb-4"
              style={{
                boxShadow: "0 8px 25px rgba(139,31,31,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
              }}
              animate={{
                boxShadow: [
                  "0 8px 25px rgba(139,31,31,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
                  "0 8px 30px rgba(139,31,31,0.6), inset 0 2px 4px rgba(255,255,255,0.3)",
                  "0 8px 25px rgba(139,31,31,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <span className="font-bold tracking-wider">HK</span>
            </motion.div>

            {/* Instruction text below seal */}
            <AnimatePresence>
              {!isOpening && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <motion.p
                    className="text-[11px] sm:text-xs tracking-[0.15em] uppercase font-medium"
                    style={{
                      color: "#7a6a4a",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)"
                    }}
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Tap to Open Invitation
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Names at the bottom - outside envelope */}
        <motion.div
          className="absolute -bottom-24 sm:-bottom-20 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isOpening ? 0 : 1,
            y: 0
          }}
          transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* "from" label with decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <motion.div
              className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#B9975B]/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            />
            <motion.p
              className="text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light"
              style={{ color: "#9a8a6a" }}
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              from
            </motion.p>
            <motion.div
              className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#B9975B]/40"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            />
          </div>

          {/* Names with elegant styling */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <motion.span
              className="font-serif text-xl sm:text-2xl tracking-[0.15em] uppercase font-bold"
              style={{
                color: "#4a3a2a",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                color: "#B9975B",
                textShadow: "0 2px 8px rgba(185,151,91,0.3)"
              }}
            >
              Himasree
            </motion.span>
            <motion.span
              className="font-serif text-lg sm:text-xl italic font-light"
              style={{ color: "#7a6a4a" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.9, duration: 0.4 }}
            >
              &
            </motion.span>
            <motion.span
              className="font-serif text-xl sm:text-2xl tracking-[0.15em] uppercase font-bold"
              style={{
                color: "#4a3a2a",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                color: "#B9975B",
                textShadow: "0 2px 8px rgba(185,151,91,0.3)"
              }}
            >
              Kaustav
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
