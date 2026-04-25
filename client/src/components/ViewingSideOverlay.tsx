import { useWeddingTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ViewingSideOverlayProps {
  onBackToSelection: () => void;
  onSideChange: (side: "groom" | "bride") => void;
}

export default function ViewingSideOverlay({ onBackToSelection, onSideChange }: ViewingSideOverlayProps) {
  const { side } = useWeddingTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const otherSide = side === "groom" ? "bride" : "groom";
  const sideLabel = side === "groom" ? "Groom" : "Bride";
  const otherLabel = otherSide === "groom" ? "Groom" : "Bride";

  // Close when clicking/tapping outside
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 left-4 sm:bottom-6 sm:left-5 z-[60] touch-manipulation"
      data-testid="viewing-side-overlay"
    >
      {/* Main toggle pill */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-left"
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #162840 100%)",
          border: "1.5px solid #C6A75E",
          boxShadow: "0 4px 20px rgba(11,31,58,0.5), 0 0 12px rgba(198,167,94,0.15)",
          minWidth: "160px",
        }}
        whileHover={{ scale: 1.03, boxShadow: "0 6px 24px rgba(11,31,58,0.6), 0 0 18px rgba(198,167,94,0.25)" }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Dot indicator */}
        <motion.div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: side === "groom" ? "#C6A75E" : "#C04060",
            boxShadow: `0 0 8px ${side === "groom" ? "rgba(198,167,94,0.8)" : "rgba(192,64,96,0.8)"}`,
          }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div className="flex-1">
          <p className="text-[9px] tracking-wider uppercase" style={{ color: "rgba(198,167,94,0.6)" }}>
            Viewing
          </p>
          <p className="text-sm font-bold" style={{ color: "#C6A75E" }}>
            {sideLabel} Side
          </p>
        </div>
        <motion.svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ color: "#C6A75E", flexShrink: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.button>

      {/* Dropdown options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full mb-2 left-0 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0B1F3A 0%, #162840 100%)",
              border: "1.5px solid rgba(198,167,94,0.4)",
              boxShadow: "0 8px 32px rgba(11,31,58,0.6), 0 0 20px rgba(198,167,94,0.1)",
              minWidth: "200px",
            }}
          >
            {/* Shimmer top line */}
            <div className="h-[1px]" style={{ background: "linear-gradient(90deg, transparent, #C6A75E, transparent)" }} />

            <div className="p-3 space-y-2">
              <button
                onClick={() => { onSideChange(otherSide); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(198,167,94,0.12)",
                  color: "#C6A75E",
                  border: "1px solid rgba(198,167,94,0.2)",
                }}
                data-testid={`switch-to-${otherSide}`}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                  background: otherSide === "groom" ? "#C6A75E" : "#C04060",
                }} />
                Switch to {otherLabel} Side
              </button>
              <button
                onClick={() => { setIsOpen(false); onBackToSelection(); }}
                className="w-full px-3 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: "transparent",
                  color: "rgba(198,167,94,0.6)",
                  border: "1px solid rgba(198,167,94,0.2)",
                }}
                data-testid="back-to-selection"
              >
                ← Back to Selection
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
