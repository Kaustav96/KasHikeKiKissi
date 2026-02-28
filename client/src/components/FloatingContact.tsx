import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music } from "lucide-react";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";

export default function FloatingContact() {
  const { side } = useWeddingTheme();
  const { isPlaying, togglePlayPause } = useMusic();

  const accentColor = side === "groom" ? "#B9975B" : "#8B0000";
  const bgColor = side === "groom" ? "#EFE6D8" : "#F8F1E7";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" data-testid="floating-contact">
      {/* Music Control */}
      <motion.button
        onClick={togglePlayPause}
        className="p-4 rounded-full shadow-xl border-2 transition-all"
        style={{
          background: bgColor,
          borderColor: accentColor,
          color: accentColor,
        }}
        title={isPlaying ? "Pause music" : "Play music"}
        data-testid="music-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: "linear",
          }}
        >
          <Music size={22} />
        </motion.div>
      </motion.button>
    </div>
  );
}
