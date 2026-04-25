/**
 * WelcomeGreeting Component
 * 
 * A friendly animated greeting character that appears after side selection.
 * Features traditional Indian bride/groom characters that wave and welcome guests.
 * 
 * Animation Sequence (3 seconds):
 * - 0.0-0.5s: Character fades in with scale and bounce
 * - 0.5-2.3s: Character waves, speech bubble appears, confetti bursts
 * - 2.3-3.0s: Character and effects fade out
 * - 3.0s: Calls onComplete() to advance to next step (Royal Seal Gate)
 * 
 * Visual Effects:
 * - Confetti burst (20 particles)
 * - Floating hearts (8 radiating)
 * - Sparkle particles (12 ambient)
 * - Gold shimmer overlay
 * - Expanding glow ring
 * - Flower petals (bride only)
 * 
 * Responsive:
 * - Desktop: 208×288px character
 * - Mobile: 160×224px character
 * - All effects scale proportionally
 * 
 * @param side - "groom" | "bride" - Determines which character to show
 * @param onComplete - Callback fired when animation completes (after 3s)
 */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { WeddingSide } from "@/context/ThemeContext";

interface WelcomeGreetingProps {
  side: WeddingSide;
  onComplete: () => void;
  /**
   * overlayMode: renders as a fixed transparent overlay on top of the main site
   * instead of a full-screen blocking view. The animation auto-dismisses and
   * onComplete is still called when done.
   */
  overlayMode?: boolean;
}

export default function WelcomeGreeting({ side, onComplete, overlayMode = false }: WelcomeGreetingProps) {
  const [animationPhase, setAnimationPhase] = useState<"enter" | "wave" | "exit">("enter");

  const isGroom = side === "groom";
  const greetingText = isGroom
    ? `Welcome to the Groom's Side`
    : `Welcome to the Bride's Side`;
  const primaryColor = isGroom ? "#F5D77A" : "#D4AF37";
  const bgGradient = isGroom
    ? "linear-gradient(180deg, #0F1B2E 0%, #14233C 60%, #0C1626 100%)"
    : "linear-gradient(180deg, #9F2A3B 0%, #8B1E2D 60%, #5E141F 100%)";

  // Overlay mode: snappy — 1.2s total visible, ~1.5s before onComplete
  const timings = overlayMode
    ? { wave: 200, exit: 1000, complete: 1500 }
    : { wave: 500, exit: 2300, complete: 3000 };

  useEffect(() => {
    const waveTimer = setTimeout(() => setAnimationPhase("wave"), timings.wave);
    const exitTimer = setTimeout(() => setAnimationPhase("exit"), timings.exit);
    const completeTimer = setTimeout(() => onComplete(), timings.complete);
    return () => {
      clearTimeout(waveTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── OVERLAY MODE: centred card floating above the main site ──────────────
  if (overlayMode) {
    return (
      <AnimatePresence>
        {animationPhase !== "exit" && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none px-4"
            style={{ background: "rgba(11,31,58,0.55)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              {/* Character */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                {isGroom
                  ? <GroomCharacter animationPhase={animationPhase} />
                  : <BrideCharacter animationPhase={animationPhase} />}
              </motion.div>

              {/* Speech bubble */}
              <AnimatePresence>
                {animationPhase === "wave" && (
                  <motion.div
                    className="mt-5 px-6 py-4 rounded-2xl shadow-2xl relative max-w-[260px] sm:max-w-xs text-center"
                    style={{
                      background: "rgba(255,255,255,0.97)",
                      border: `2px solid ${primaryColor}`,
                      boxShadow: `0 10px 40px rgba(0,0,0,0.35), 0 0 24px ${primaryColor}50`,
                    }}
                    initial={{ opacity: 0, scale: 0.6, y: 14 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -8 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  >
                    {/* Tail */}
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rotate-45"
                      style={{
                        background: "rgba(255,255,255,0.97)",
                        border: `2px solid ${primaryColor}`,
                        borderRight: "none",
                        borderBottom: "none",
                      }}
                    />
                    <p className="font-serif text-base sm:text-lg font-semibold relative z-10"
                      style={{ color: isGroom ? "#14233C" : "#8B1E2D" }}>
                      👋 {greetingText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confetti burst */}
              <AnimatePresence>
                {animationPhase === "wave" && (
                  <div className="absolute inset-0 pointer-events-none overflow-visible">
                    {[...Array(16)].map((_, i) => {
                      const colors = [primaryColor, "#D4AF37", "#C6A75E", "#F5D77A"];
                      const angle = (i * 22.5 * Math.PI) / 180;
                      const dist = 120 + Math.random() * 80;
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-3 rounded-sm"
                          style={{ background: colors[i % colors.length], left: "50%", top: "40%" }}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                          animate={{
                            opacity: [0, 1, 0.8, 0],
                            scale: [0, 1, 0.8, 0],
                            x: Math.cos(angle) * dist,
                            y: Math.sin(angle) * dist - 40,
                            rotate: Math.random() * 540 - 270,
                          }}
                          transition={{ duration: 1.4, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
                        />
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── LEGACY FULLSCREEN MODE (unchanged) ──────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: bgGradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: animationPhase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated gold shimmer overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, transparent 0%, rgba(212,175,55,0.15) 25%, transparent 50%, rgba(212,175,55,0.15) 75%, transparent 100%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Decorative background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sparkle particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: primaryColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 0.5,
              repeat: Infinity,
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Confetti burst when wave starts */}
        <AnimatePresence>
          {animationPhase === "wave" && (
            <>
              {[...Array(20)].map((_, i) => {
                const colors = [primaryColor, "#D4AF37", "#C6A75E", "#F5D77A"];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const angle = (i * 18 * Math.PI) / 180;
                const distance = 150 + Math.random() * 100;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance - 50;
                
                return (
                  <motion.div
                    key={`confetti-${i}`}
                    className="absolute w-2 h-3 rounded-sm"
                    style={{
                      background: randomColor,
                      left: "50%",
                      top: "40%",
                    }}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0.8, 0],
                      scale: [0, 1, 1, 0.5],
                      x: endX,
                      y: endY,
                      rotate: Math.random() * 720 - 360,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.8,
                      delay: i * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Main character container */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{
          scale: animationPhase === "exit" ? 0.9 : 1,
          y: animationPhase === "exit" ? -30 : [0, -8, 0],
          opacity: animationPhase === "exit" ? 0 : 1,
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          y: animationPhase !== "exit" ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : { duration: 0.6 }
        }}
      >
        {/* Floating hearts around character */}
        <AnimatePresence>
          {animationPhase === "wave" && (
            <>
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const radius = 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0.5],
                      x: [0, x],
                      y: [0, y],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        d="M10 18 L4 12 C1 9 1 5 4 2 C7 -1 11 1 10 5 C9 1 13 -1 16 2 C19 5 19 9 16 12 Z"
                        fill={primaryColor}
                        opacity="0.7"
                      />
                    </svg>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Character illustration */}
        <motion.div className="relative">
          {isGroom ? <GroomCharacter animationPhase={animationPhase} /> : <BrideCharacter animationPhase={animationPhase} />}
        </motion.div>

        {/* Greeting text bubble */}
        <AnimatePresence>
          {animationPhase === "wave" && (
            <motion.div
              className="mt-6 sm:mt-8 px-6 py-4 rounded-2xl shadow-2xl relative max-w-[280px] sm:max-w-xs"
              style={{
                background: "rgba(255, 255, 255, 0.95)",
                border: `2px solid ${primaryColor}`,
                boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 20px ${primaryColor}40`,
              }}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { type: "spring", stiffness: 200, damping: 15 }
              }}
            >
              {/* Speech bubble tail */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45"
                style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  border: `2px solid ${primaryColor}`,
                  borderRight: "none",
                  borderBottom: "none",
                }}
              />
              
              <p
                className="font-serif text-lg sm:text-xl font-medium text-center relative z-10"
                style={{ color: isGroom ? "#14233C" : "#8B1E2D" }}
              >
                {greetingText}
              </p>

              {/* Sparkles around text */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: primaryColor,
                    top: `${20 + i * 20}%`,
                    left: i % 2 === 0 ? "8%" : "92%",
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Groom Character Component
function GroomCharacter({ animationPhase }: { animationPhase: "enter" | "wave" | "exit" }) {
  const primaryColor = "#F5D77A";
  
  return (
    <svg
      width="200"
      height="280"
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-56 sm:w-48 sm:h-64 md:w-52 md:h-72"
    >
      {/* Groom's Body - Traditional Sherwani */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Sherwani body - Deep teal with gold accents */}
        <path
          d="M100 110 L70 130 L70 220 L80 230 L120 230 L130 220 L130 130 Z"
          fill="#14233C"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        
        {/* Gold embroidery on sherwani */}
        <path d="M100 130 L100 210" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
        <circle cx="100" cy="140" r="3" fill="#D4AF37" opacity="0.8" />
        <circle cx="100" cy="160" r="3" fill="#D4AF37" opacity="0.8" />
        <circle cx="100" cy="180" r="3" fill="#D4AF37" opacity="0.8" />
        <circle cx="100" cy="200" r="3" fill="#D4AF37" opacity="0.8" />

        {/* Sherwani collar */}
        <path
          d="M85 110 Q90 105 100 105 Q110 105 115 110"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
        />
      </motion.g>

      {/* Groom's Head */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Face */}
        <circle cx="100" cy="75" r="25" fill="#FDBF85" />
        
        {/* Eyes */}
        <circle cx="92" cy="72" r="2.5" fill="#2E2A27" />
        <circle cx="108" cy="72" r="2.5" fill="#2E2A27" />
        
        {/* Smile */}
        <path
          d="M90 82 Q100 88 110 82"
          fill="none"
          stroke="#2E2A27"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Traditional turban/safa */}
        <ellipse cx="100" cy="52" rx="30" ry="18" fill="#8B0000" />
        <ellipse cx="100" cy="52" rx="28" ry="16" fill="#A1122F" opacity="0.8" />
        
        {/* Turban ornament */}
        <circle cx="100" cy="48" r="6" fill="#D4AF37" />
        <circle cx="100" cy="48" r="4" fill="#F5D77A" />
      </motion.g>

      {/* Right Arm (Waving) */}
      <motion.g
        animate={
          animationPhase === "wave"
            ? {
                rotate: [0, -25, -15, -25, -15, 0],
              }
            : { rotate: 0 }
        }
        transition={{
          duration: 1.2,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeInOut",
        }}
        style={{ originX: "65px", originY: "130px" }}
      >
        {/* Arm */}
        <path d="M65 130 L45 100" stroke="#FDBF85" strokeWidth="10" strokeLinecap="round" />
        
        {/* Hand waving */}
        <motion.g
          animate={
            animationPhase === "wave"
              ? { rotate: [0, 15, -15, 15, -15, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 1.2,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: "easeInOut",
          }}
          style={{ originX: "45px", originY: "100px" }}
        >
          <ellipse cx="45" cy="100" rx="8" ry="10" fill="#FDBF85" />
          {/* Fingers */}
          <path d="M45 92 L45 84" stroke="#FDBF85" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M40 92 L38 85" stroke="#FDBF85" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 92 L52 85" stroke="#FDBF85" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
        
        {/* Sherwani sleeve */}
        <path d="M65 130 L45 100" stroke="#14233C" strokeWidth="12" opacity="0.9" />
      </motion.g>

      {/* Left Arm */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <path d="M135 130 L155 160" stroke="#14233C" strokeWidth="12" />
        <path d="M135 130 L155 160" stroke="#FDBF85" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="155" cy="165" rx="8" ry="10" fill="#FDBF85" />
      </motion.g>

      {/* Decorative shine effect */}
      <motion.circle
        cx="100"
        cy="140"
        r="60"
        fill="none"
        stroke={primaryColor}
        strokeWidth="2"
        opacity="0"
        animate={{
          opacity: [0, 0.3, 0],
          scale: [0.8, 1.3, 1.5],
        }}
        transition={{
          duration: 2,
          ease: "easeOut",
        }}
      />
    </svg>
  );
}

// Bride Character Component - Elegant Bengali Bride
function BrideCharacter({ animationPhase }: { animationPhase: "enter" | "wave" | "exit" }) {
  return (
    <svg
      width="200"
      height="280"
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-56 sm:w-48 sm:h-64 md:w-52 md:h-72"
    >
      {/* Bride's Body - Elegant Lehenga with flowing silhouette */}
      <motion.g
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Lehenga - Graceful A-line silhouette */}
        {/* Outer layer - Rich crimson with gold border */}
        <motion.path
          d="M100 130 L55 235 C55 238 57 240 60 240 L140 240 C143 240 145 238 145 235 L100 130 Z"
          fill="url(#lehenga-gradient)"
          stroke="#D4AF37"
          strokeWidth="2.5"
          animate={{
            d: [
              "M100 130 L55 235 C55 238 57 240 60 240 L140 240 C143 240 145 238 145 235 L100 130 Z",
              "M100 130 L53 235 C53 238 55 240 58 240 L142 240 C145 240 147 238 147 235 L100 130 Z",
              "M100 130 L55 235 C55 238 57 240 60 240 L140 240 C143 240 145 238 145 235 L100 130 Z",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Inner layer with lighter shade */}
        <path
          d="M100 130 L68 225 L132 225 L100 130 Z"
          fill="#A1122F"
          opacity="0.6"
        />

        {/* Decorative pleats effect */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M100 140 L${70 + i * 15} 230`}
            stroke="#D4AF37"
            strokeWidth="0.8"
            opacity="0.3"
          />
        ))}

        {/* Intricate gold embroidery pattern */}
        <g opacity="0.8">
          {/* Central mandala */}
          <circle cx="100" cy="170" r="8" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="100" cy="170" r="5" fill="#C6A75E" opacity="0.6" />
          
          {/* Side patterns */}
          <circle cx="80" cy="190" r="5" fill="#D4AF37" opacity="0.7" />
          <circle cx="120" cy="190" r="5" fill="#D4AF37" opacity="0.7" />
          <circle cx="85" cy="210" r="4" fill="#C6A75E" opacity="0.6" />
          <circle cx="115" cy="210" r="4" fill="#C6A75E" opacity="0.6" />
          
          {/* Decorative border at hem */}
          <path d="M65 225 L135 225" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
          <path d="M70 228 L130 228" stroke="#C6A75E" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Elegant Choli (blouse) */}
        <path
          d="M100 105 L72 118 L72 138 L100 133 L128 138 L128 118 Z"
          fill="#8B0000"
          stroke="#D4AF37"
          strokeWidth="1.8"
        />
        
        {/* Choli embroidery */}
        <circle cx="100" cy="120" r="3" fill="#D4AF37" opacity="0.9" />
        <path d="M90 115 L90 130" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
        <path d="M110 115 L110 130" stroke="#D4AF37" strokeWidth="0.8" opacity="0.5" />
        
        {/* Flowing Dupatta (graceful drape) */}
        <motion.g
          animate={{
            opacity: [0.85, 0.95, 0.85],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Main dupatta flow */}
          <motion.path
            d="M78 112 Q55 125 50 150 Q48 175 52 200 L58 210"
            fill="none"
            stroke="#C6A75E"
            strokeWidth="12"
            opacity="0.7"
            animate={{
              d: [
                "M78 112 Q55 125 50 150 Q48 175 52 200 L58 210",
                "M78 112 Q53 127 48 152 Q46 177 50 202 L56 212",
                "M78 112 Q55 125 50 150 Q48 175 52 200 L58 210",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Dupatta border accent */}
          <motion.path
            d="M78 112 Q55 125 50 150 Q48 175 52 200"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            opacity="0.8"
            animate={{
              d: [
                "M78 112 Q55 125 50 150 Q48 175 52 200",
                "M78 112 Q53 127 48 152 Q46 177 50 202",
                "M78 112 Q55 125 50 150 Q48 175 52 200",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Gold embroidery on dupatta */}
          <circle cx="55" cy="135" r="2.5" fill="#D4AF37" opacity="0.8" />
          <circle cx="52" cy="160" r="2" fill="#D4AF37" opacity="0.7" />
          <circle cx="54" cy="185" r="2" fill="#C6A75E" opacity="0.7" />
        </motion.g>
      </motion.g>

      {/* Bride's Head with jewelry */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hair - elegant bun style */}
        <ellipse cx="100" cy="58" rx="32" ry="20" fill="#2E2A27" />
        <circle cx="100" cy="54" r="12" fill="#2E2A27" />
        
        {/* Face with soft glow */}
        <circle cx="100" cy="78" r="24" fill="#FDBF85" />
        <circle cx="100" cy="78" r="24" fill="url(#face-glow)" opacity="0.2" />
        
        {/* Eyes with lashes */}
        <ellipse cx="92" cy="74" rx="2.5" ry="3" fill="#2E2A27" />
        <ellipse cx="108" cy="74" rx="2.5" ry="3" fill="#2E2A27" />
        {/* Eyelashes */}
        <path d="M89 72 L87 70" stroke="#2E2A27" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M95 72 L97 70" stroke="#2E2A27" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M105 72 L103 70" stroke="#2E2A27" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M111 72 L113 70" stroke="#2E2A27" strokeWidth="0.8" strokeLinecap="round" />
        
        {/* Eyebrows */}
        <path d="M88 68 Q92 66 96 67" stroke="#2E2A27" strokeWidth="1" strokeLinecap="round" />
        <path d="M104 67 Q108 66 112 68" stroke="#2E2A27" strokeWidth="1" strokeLinecap="round" />
        
        {/* Nose - delicate */}
        <path d="M100 78 Q102 82 100 83" stroke="#2E2A27" strokeWidth="0.6" opacity="0.3" />
        
        {/* Smile - warm and welcoming */}
        <path
          d="M90 85 Q100 91 110 85"
          fill="none"
          stroke="#2E2A27"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Blush */}
        <ellipse cx="86" cy="80" rx="4" ry="2.5" fill="#E8A4A4" opacity="0.4" />
        <ellipse cx="114" cy="80" rx="4" ry="2.5" fill="#E8A4A4" opacity="0.4" />

        {/* Bindi - prominent and beautiful */}
        <circle cx="100" cy="66" r="2.5" fill="#8B0000" />
        <circle cx="100" cy="66" r="1.5" fill="#A1122F" />

        {/* Maang Tikka (forehead jewelry) - elaborate */}
        <motion.g
          animate={{
            y: animationPhase === "wave" ? [0, -1, 0, -1, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <circle cx="100" cy="52" r="6" fill="#D4AF37" />
          <circle cx="100" cy="52" r="4" fill="#F5D77A" />
          <path d="M100 52 L100 65" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="100" cy="65" r="3.5" fill="#C6A75E" />
          <circle cx="100" cy="65" r="2" fill="#D4AF37" />
        </motion.g>

        {/* Earrings - chandelier style */}
        <motion.g
          animate={{
            rotate: animationPhase === "wave" ? [0, 3, -3, 3, 0] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          <circle cx="73" cy="84" r="4.5" fill="#D4AF37" />
          <ellipse cx="73" cy="90" rx="3" ry="5" fill="#C6A75E" />
          <circle cx="127" cy="84" r="4.5" fill="#D4AF37" />
          <ellipse cx="127" cy="90" rx="3" ry="5" fill="#C6A75E" />
        </motion.g>
        
        {/* Necklace - traditional with pendant */}
        <ellipse cx="100" cy="98" rx="22" ry="9" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        <ellipse cx="100" cy="98" rx="20" ry="7" fill="none" stroke="#F5D77A" strokeWidth="1" />
        <motion.circle 
          cx="100" 
          cy="104" 
          r="5" 
          fill="#C6A75E"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        <circle cx="100" cy="104" r="3" fill="#D4AF37" />

        {/* Nose ring */}
        <circle cx="106" cy="82" r="1.5" fill="none" stroke="#D4AF37" strokeWidth="1" />
      </motion.g>

      {/* Right Arm (Waving) - More elegant motion */}
      <motion.g
        animate={
          animationPhase === "wave"
            ? {
                rotate: [0, 25, 12, 25, 12, 0],
              }
            : { rotate: 0 }
        }
        transition={{
          duration: 1.4,
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
          ease: "easeInOut",
        }}
        style={{ originX: "128px", originY: "118px" }}
      >
        {/* Choli sleeve */}
        <path d="M128 118 L158 90" stroke="#8B0000" strokeWidth="12" opacity="0.95" strokeLinecap="round" />
        <path d="M128 118 L158 90" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
        
        {/* Arm */}
        <path d="M128 118 L158 90" stroke="#FDBF85" strokeWidth="10" strokeLinecap="round" />
        
        {/* Hand waving - graceful */}
        <motion.g
          animate={
            animationPhase === "wave"
              ? { rotate: [0, -25, 20, -25, 20, 0] }
              : { rotate: 0 }
          }
          transition={{
            duration: 1.4,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            ease: "easeInOut",
          }}
          style={{ originX: "158px", originY: "90px" }}
        >
          <ellipse cx="158" cy="90" rx="9" ry="11" fill="#FDBF85" />
          {/* Fingers - delicate */}
          <path d="M158 81 L158 72" stroke="#FDBF85" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M153 82 L150 74" stroke="#FDBF85" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M163 82 L166 74" stroke="#FDBF85" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M148 85 L145 78" stroke="#FDBF85" strokeWidth="2.4" strokeLinecap="round" />
          
          {/* Mehndi on hand */}
          <circle cx="158" cy="88" r="1.5" fill="#8B4513" opacity="0.5" />
          <path d="M156 85 Q158 87 160 85" stroke="#8B4513" strokeWidth="0.5" opacity="0.5" />
        </motion.g>

        {/* Elaborate Bangles - multiple colors */}
        <motion.g
          animate={{
            y: animationPhase === "wave" ? [0, -2, 0, -2, 0] : 0,
          }}
          transition={{
            duration: 1.4,
            times: [0, 0.25, 0.5, 0.75, 1],
          }}
        >
          <circle cx="150" cy="98" r="2.5" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
          <circle cx="150" cy="103" r="2.5" fill="none" stroke="#8B0000" strokeWidth="2.5" />
          <circle cx="150" cy="108" r="2.5" fill="none" stroke="#C6A75E" strokeWidth="2.5" />
          <circle cx="150" cy="113" r="2.5" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        </motion.g>
      </motion.g>

      {/* Left Arm - Graceful resting pose */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <path d="M72 118 L42 170" stroke="#8B0000" strokeWidth="12" strokeLinecap="round" />
        <path d="M72 118 L42 170" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6" />
        <path d="M72 118 L42 170" stroke="#FDBF85" strokeWidth="10" strokeLinecap="round" />
        <ellipse cx="40" cy="175" rx="9" ry="11" fill="#FDBF85" />
        
        {/* Mehndi design on left hand */}
        <circle cx="40" cy="173" r="1.5" fill="#8B4513" opacity="0.5" />
        <path d="M38 170 Q40 172 42 170" stroke="#8B4513" strokeWidth="0.5" opacity="0.5" />
        
        {/* Bangles on left arm */}
        <circle cx="48" cy="155" r="2.5" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
        <circle cx="48" cy="160" r="2.5" fill="none" stroke="#8B0000" strokeWidth="2.5" />
        <circle cx="48" cy="165" r="2.5" fill="none" stroke="#C6A75E" strokeWidth="2.5" />
      </motion.g>

      {/* Radiant glow effect */}
      <motion.circle
        cx="100"
        cy="150"
        r="80"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2"
        opacity="0"
        animate={{
          opacity: [0, 0.35, 0],
          scale: [0.85, 1.4, 1.6],
        }}
        transition={{
          duration: 2.2,
          ease: "easeOut",
        }}
      />

      {/* Floating rose petals */}
      {[...Array(8)].map((_, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -30 - i * 8, -60 - i * 12],
            x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 3), (i % 2 === 0 ? 1 : -1) * (15 + i * 4)],
            rotate: [0, i * 90, i * 180],
          }}
          transition={{
            duration: 2.8,
            delay: 0.6 + i * 0.15,
            ease: "easeOut",
          }}
        >
          <ellipse
            cx={90 + i * 3}
            cy={60 + i * 20}
            rx="4"
            ry="6"
            fill="#E8A4A4"
            opacity="0.8"
          />
        </motion.g>
      ))}

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="lehenga-gradient" x1="100" y1="130" x2="100" y2="240">
          <stop offset="0%" stopColor="#A1122F" />
          <stop offset="50%" stopColor="#8B0000" />
          <stop offset="100%" stopColor="#7A0F1C" />
        </linearGradient>
        <radialGradient id="face-glow">
          <stop offset="0%" stopColor="#FFE5CC" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
    </svg>
  );
}





