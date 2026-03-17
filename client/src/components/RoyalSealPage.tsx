import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface RoyalSealPageProps {
  onSealClick: () => void;
  onBackToSelection: () => void;
  currentSide: "bride" | "groom";
  onSelectSide: (side: "bride" | "groom") => void;
}

export default function RoyalSealPage({ onSealClick, onBackToSelection, currentSide, onSelectSide }: RoyalSealPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const otherSide = currentSide === "groom" ? "bride" : "groom";

  // Close when clicking outside
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
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0F1B2E 0%, #14233C 60%, #0C1626 100%)",
      }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px",
        }}
      />

      {/* Radial glow behind seal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Royal Seal - Centered */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          onClick={onSealClick}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 80px rgba(255,215,0,1), 0 20px 80px rgba(0,0,0,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 40px rgba(212,175,55,0.6), 0 10px 60px rgba(0,0,0,0.5)",
              "0 0 60px rgba(212,175,55,0.8), 0 15px 70px rgba(0,0,0,0.6)",
              "0 0 40px rgba(212,175,55,0.6), 0 10px 60px rgba(0,0,0,0.5)",
            ],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden cursor-pointer"
          style={{
            border: "6px solid #D4AF37",
            background: "#FFF9E6",
          }}
        >
          <img
            src="/bengali_wedding_couple.png"
            alt="Royal Wedding Seal"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-6xl md:text-7xl font-serif italic" style="color: #7A0F1C; background: linear-gradient(145deg, #FFD700 0%, #E6BE00 40%, #C6A75E 100%);">
                    H & K
                  </div>
                `;
              }
            }}
          />

          {/* Gold ring overlays */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "4px solid rgba(255,215,0,0.5)",
              boxShadow: "inset 0 0 40px rgba(255,215,0,0.3)",
            }}
          />
          <div
            className="absolute inset-4 sm:inset-6 rounded-full pointer-events-none"
            style={{
              border: "2px solid rgba(212,175,55,0.4)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Tap instruction */}
      <motion.div
        className="mt-6 sm:mt-8 md:mt-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <p
          className="text-xs sm:text-sm md:text-base tracking-wide mb-2 px-4"
          style={{ color: "#F5D77A" }}
        >
          Tap the royal seal to open the invitation
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-xl sm:text-2xl"
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Bottom-Left Side Selector (same style as ViewingSideOverlay) */}
      <div
        ref={containerRef}
        className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[60] touch-manipulation"
      >
        <motion.div
          className="flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg border transition-all duration-300"
          style={{
            background: "rgba(15,27,46,0.85)",
            borderColor: "#D4AF37",
            minWidth: "170px",
            pointerEvents: "auto",
            overflow: "hidden",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="flex flex-col gap-1 px-3 py-2.5 sm:px-4 sm:py-3 w-full text-left"
          >
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase" style={{ color: "#F5D77A" }}>
              Viewing As:
            </span>
            <div className="flex items-center justify-between gap-2">
              <span
                className="text-sm sm:text-base font-bold capitalize"
                style={{ color: "#D4AF37" }}
              >
                {currentSide === "groom" ? "Groom" : "Bride"} Side
              </span>
              {/* Chevron indicator */}
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                style={{
                  color: "#D4AF37",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                  flexShrink: 0,
                }}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Expandable options */}
          {isOpen && (
            <div
              className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 border-t space-y-1.5 sm:space-y-2"
              style={{ borderColor: "rgba(212,175,55,0.3)" }}
            >
              <button
                onClick={() => { onSelectSide(otherSide); setIsOpen(false); }}
                className="w-full text-left text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all active:opacity-70"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  color: "#F5D77A",
                }}
              >
                Switch to {otherSide === "groom" ? "Groom" : "Bride"} Side
              </button>
              <button
                onClick={() => { setIsOpen(false); onBackToSelection(); }}
                className="w-full text-[10px] sm:text-xs px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all active:opacity-70"
                style={{
                  background: "transparent",
                  border: `2px solid #D4AF37`,
                  color: "#D4AF37",
                }}
              >
                ← Back to Selection
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
