import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface RoyalSealGateProps {
  onOpen: () => void;
  currentSide: "bride" | "groom";
  onSelectSide: (side: "bride" | "groom") => void;
  onBackToSelection: () => void;
}

export default function RoyalSealGate({ onOpen, currentSide, onSelectSide, onBackToSelection }: RoyalSealGateProps) {
  const [sealBroken, setSealBroken] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const otherSide = currentSide === "groom" ? "bride" : "groom";

  // Close menu when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isMenuOpen]);

  const handleSealClick = () => {
    setSealBroken(true);
    // Trigger parent onOpen after envelope animation completes
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Top Half - Envelope Flap */}
      <motion.div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "50%",
          background: "linear-gradient(180deg, #14233C 0%, #0F1B2E 100%)",
        }}
        animate={sealBroken ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0 }}
      >
        {/* Embossed texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3Ccircle cx='80' cy='20' r='1.5'/%3E%3Ccircle cx='20' cy='80' r='1.5'/%3E%3Ccircle cx='80' cy='80' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "100px",
          }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(212,175,55,0.12), transparent 70%)",
          }}
        />

        {/* Decorative border at bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
            boxShadow: "0 2px 15px rgba(212,175,55,0.4)",
          }}
        />
      </motion.div>

      {/* Bottom Half - Envelope Base */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "50%",
          background: "linear-gradient(0deg, #0C1626 0%, #0F1B2E 100%)",
        }}
        animate={sealBroken ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* Embossed texture */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3Ccircle cx='80' cy='20' r='1.5'/%3E%3Ccircle cx='20' cy='80' r='1.5'/%3E%3Ccircle cx='80' cy='80' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "100px",
          }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.12), transparent 70%)",
          }}
        />

        {/* Decorative border at top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: "linear-gradient(90deg, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
            boxShadow: "0 -2px 15px rgba(212,175,55,0.4)",
          }}
        />
      </motion.div>

      {/* Royal Wax Seal - Centered with Text Below */}
      <AnimatePresence>
        {!sealBroken && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Seal Container - pointer events enabled */}
            <motion.div
              className="relative cursor-pointer pointer-events-auto flex flex-col items-center"
              onClick={handleSealClick}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [1, 1.03, 1],
              }}
              exit={{ scale: 0.5, rotate: -15 }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                exit: { duration: 0.5 }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow behind seal */}
              <div
                className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.4), transparent 70%)",
                  transform: "scale(1.5)",
                  top: "-25%",
                }}
              />

              {/* Main Seal */}
              <div
                className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #E6BE00, #C6A75E 40%, #9E7C1B 100%)",
                  boxShadow: `
                    inset -3px -3px 8px rgba(0,0,0,0.3),
                    inset 3px 3px 8px rgba(255,255,255,0.2),
                    0 8px 32px rgba(0,0,0,0.5),
                    0 0 60px rgba(212,175,55,0.4)
                  `,
                }}
              >
                {/* Inner ring */}
                <div
                  className="absolute inset-3 rounded-full border-2 opacity-30"
                  style={{ borderColor: "rgba(255,255,255,0.5)" }}
                />

                {/* Monogram HK */}
                <div className="relative flex items-center justify-center">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    className="sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px]"
                  >
                    {/* H */}
                    <path
                      d="M20 20 L20 60 M20 40 L32 40 M32 20 L32 60"
                      stroke="rgba(15,27,46,0.9)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* K */}
                    <path
                      d="M48 20 L48 60 M48 40 L62 20 M48 40 L62 60"
                      stroke="rgba(15,27,46,0.9)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Decorative circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="rgba(15,27,46,0.3)"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>

                {/* Emboss highlights */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15), transparent 50%)",
                  }}
                />
              </div>

              {/* Seal crack animation */}
              {sealBroken && (
                <motion.div
                  className="absolute inset-0 top-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    <path
                      d="M100 50 L105 100 L95 150"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M70 80 L100 100 L130 85"
                      stroke="rgba(0,0,0,0.6)"
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Instruction Text - Below Seal (only when seal not broken) */}
              {!sealBroken && (
                <motion.div
                  className="mt-6 sm:mt-8 text-center pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p
                    className="font-serif text-xs sm:text-sm tracking-[0.3em] uppercase"
                    style={{
                      color: "#D4AF37",
                      textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                    }}
                  >
                    Tap the Royal Seal
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-Left Side Selector (same style as ViewingSideOverlay) */}
      <div
        ref={menuRef}
        className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[60] touch-manipulation"
      >
        <motion.div
          className="flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg border transition-all duration-300"
          style={{
            background: "rgba(26,58,46,0.85)",
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
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex flex-col gap-1 px-3 py-2.5 sm:px-4 sm:py-3 w-full text-left"
          >
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase" style={{ color: "rgba(212,175,55,0.7)" }}>
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
                  transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.25s ease",
                  flexShrink: 0,
                }}
              >
                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          {/* Expandable options */}
          {isMenuOpen && (
            <div
              className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 border-t space-y-1.5 sm:space-y-2"
              style={{ borderColor: "rgba(212,175,55,0.3)" }}
            >
              <button
                onClick={() => { onSelectSide(otherSide); setIsMenuOpen(false); }}
                className="w-full text-left text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all active:opacity-70"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  color: "#F5D77A",
                }}
              >
                Switch to {otherSide === "groom" ? "Groom" : "Bride"} Side
              </button>
              <button
                onClick={() => { setIsMenuOpen(false); onBackToSelection(); }}
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

