import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import KHCrest from "./KHCrest";
import { useMusic } from "@/context/MusicContext";

type AnimPhase = "idle" | "cracking" | "opening" | "fadeout" | "complete";

interface WaxSealIntroProps {
  onSealOpen: () => void;
}

function DustParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "radial-gradient(circle, rgba(185,151,91,0.6) 0%, transparent 70%)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function WaxSealIntro({ onSealOpen }: WaxSealIntroProps) {
  const [phase, setPhase] = useState<AnimPhase>("idle");
  const { fadeIn } = useMusic();

  const handleSealClick = useCallback(() => {
    if (phase !== "idle") return;

    setPhase("cracking");

    try {
      const ctx = new AudioContext();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.3;
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch {}

    setTimeout(() => setPhase("opening"), 400);
    setTimeout(() => {
      setPhase("fadeout");
      fadeIn();
    }, 1200);
    setTimeout(() => {
      setPhase("complete");
      onSealOpen();
    }, 2200);
  }, [phase, onSealOpen, fadeIn]);

  if (phase === "complete") return null;

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: "radial-gradient(ellipse at center, #2E2A27 0%, #1a1714 50%, #0d0b09 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <DustParticles />

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[420px] sm:w-[400px] sm:h-[500px]"
            style={{
              background: "linear-gradient(145deg, #F8F1E7 0%, #EFE6D8 50%, #D8C3A5 100%)",
              borderRadius: "8px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            animate={phase === "fadeout" ? { opacity: 0, scale: 0.9 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div
              className="absolute inset-0 rounded-lg opacity-30"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(185,151,91,0.1) 8px, rgba(185,151,91,0.1) 9px)",
              }}
            />
            <div
              className="absolute top-4 left-4 right-4 bottom-4 rounded border opacity-40"
              style={{ borderColor: "#B9975B" }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {phase === "idle" && (
                <motion.div
                  className="cursor-pointer relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSealClick}
                  data-testid="wax-seal-button"
                >
                  <div
                    className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #C4463A 0%, #8B0000 40%, #5C0A1D 100%)",
                      boxShadow: "0 8px 30px rgba(139,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.3)",
                    }}
                  >
                    <KHCrest size={100} />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, transparent 30%, rgba(240,214,138,0.15) 50%, transparent 70%)",
                      }}
                      animate={{
                        backgroundPosition: ["200% 200%", "-200% -200%"],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <p className="text-center mt-4 text-sm tracking-[0.2em] uppercase" style={{ color: "#B9975B" }}>
                    Tap to Open
                  </p>
                </motion.div>
              )}

              {phase === "cracking" && (
                <motion.div
                  className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] rounded-full flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #C4463A 0%, #8B0000 40%, #5C0A1D 100%)",
                    boxShadow: "0 8px 30px rgba(139,0,0,0.5)",
                  }}
                  animate={{ scale: [1, 1.08, 1.02] }}
                  transition={{ duration: 0.4 }}
                >
                  <KHCrest size={100} />
                </motion.div>
              )}

              {(phase === "opening" || phase === "fadeout") && (
                <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px]">
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      clipPath: "inset(0 50% 0 0)",
                      background: "radial-gradient(circle at 35% 35%, #C4463A 0%, #8B0000 40%, #5C0A1D 100%)",
                    }}
                    animate={{ x: -40, rotate: -15, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{
                      clipPath: "inset(0 0 0 50%)",
                      background: "radial-gradient(circle at 35% 35%, #C4463A 0%, #8B0000 40%, #5C0A1D 100%)",
                    }}
                    animate={{ x: 40, rotate: 15, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <KHCrest size={140} />
                  </motion.div>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#B9975B" }}>
                You are cordially invited
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
