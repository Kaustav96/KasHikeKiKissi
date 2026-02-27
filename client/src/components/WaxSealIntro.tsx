import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KHCrest from "./KHCrest";
import { useMusic } from "@/context/MusicContext";

type AnimPhase = "idle" | "fadeout" | "complete";

interface WaxSealIntroProps {
  onSealOpen: () => void;
}

export default function WaxSealIntro({ onSealOpen }: WaxSealIntroProps) {
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const { fadeIn } = useMusic();

  const handleSealClick = useCallback(() => {
    if (phase !== "idle") return;

    // Start music on user click (iOS Safari requirement)
    fadeIn();

    setPhase("fadeout");

    setTimeout(() => {
      setPhase("complete");
      onSealOpen();
    }, 800);
  }, [phase, onSealOpen, fadeIn]);

  if (phase === "complete") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          background: "radial-gradient(ellipse at center, #0a0604 0%, #1a0f0a 50%, #2c1810 100%)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <motion.div
          className="cursor-pointer relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSealClick}
          data-testid="wax-seal-button"
        >
          <div
            className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] rounded-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FFD700 0%, #D4AF37 30%, #B8860B 70%, #8B6914 100%)",
              boxShadow: "0 15px 60px rgba(212,175,55,0.6), 0 0 50px rgba(212,175,55,0.4), inset 0 4px 10px rgba(255,235,150,0.5), inset 0 -6px 15px rgba(0,0,0,0.8)",
            }}
          >
            <KHCrest size={110} />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, transparent 30%, rgba(255,235,150,0.6) 50%, transparent 70%)",
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <motion.p
            className="text-center mt-6 text-sm tracking-[0.25em] uppercase font-serif"
            style={{ color: "#D4AF37" }}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Click to Enter
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
