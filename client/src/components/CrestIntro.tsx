import { useState } from "react";
import { motion } from "framer-motion";
import KHCrest from "./KHCrest";

interface CrestIntroProps {
  onFinish: () => void;
}

const CORNER_ROTATIONS = ["", "rotate-90", "-rotate-90", "rotate-180"];
const CORNER_POSITIONS = ["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"];

export default function CrestIntro({ onFinish }: CrestIntroProps) {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(() => onFinish(), 550);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{
        background: "linear-gradient(160deg, #0D0C09 0%, #171410 35%, #1E1B13 65%, #130E08 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
      onClick={handleTap}
    >
      {/* Deep layered glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 50%, rgba(185,151,91,0.17) 0%, rgba(140,100,40,0.08) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 36% 36% at 50% 50%, rgba(255,222,130,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Pulsing outer ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 310, height: 310, borderColor: "rgba(185,151,91,0.09)" }}
        animate={{ scale: [1, 1.11, 1], opacity: [0.5, 0.12, 0.5] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Pulsing inner ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{ width: 236, height: 236, borderColor: "rgba(185,151,91,0.17)" }}
        animate={{ scale: [1, 1.07, 1], opacity: [0.7, 0.18, 0.7] }}
        transition={{ duration: 4.2, delay: 0.55, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Crest */}
      <motion.div
        initial={{ scale: 0.72, opacity: 0 }}
        animate={{ scale: tapped ? 1.12 : 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <KHCrest size={155} />
      </motion.div>

      {/* Names — staggered word reveal */}
      <motion.div
        className="mt-8 flex flex-col items-center gap-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.18, delayChildren: 0.8 } },
        }}
      >
        {["Himasree", "&", "Kaustav"].map((word, i) => (
          <motion.span
            key={i}
            className={`font-serif tracking-[0.38em] uppercase ${
              word === "&" ? "text-sm" : "text-xl sm:text-2xl font-semibold"
            }`}
            style={{
              color: word === "&" ? "rgba(212,175,106,0.65)" : "#E8C97A",
              textShadow: word === "&" ? "none" : "0 0 28px rgba(212,175,106,0.45)",
            }}
            variants={{
              hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Est. line */}
      <motion.div
        className="mt-4 flex items-center gap-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="w-8 h-px" style={{ background: "rgba(212,175,106,0.35)" }} />
        <p
          className="text-[10px] tracking-[0.48em] uppercase font-medium"
          style={{ color: "rgba(212,175,106,0.70)" }}
        >
          Siliguri
        </p>
        <div className="w-8 h-px" style={{ background: "rgba(212,175,106,0.35)" }} />
      </motion.div>

      {/* Tap to enter hint */}
      <motion.div
        className="absolute bottom-14 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: tapped ? 0 : 1 }}
        transition={{ delay: tapped ? 0 : 1.8, duration: 0.7 }}
      >
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: "#C4A057" }}
            />
          ))}
        </motion.div>
        <p
          className="text-[9px] tracking-[0.42em] uppercase"
          style={{ color: "rgba(196,160,87,0.55)" }}
        >
          Tap to enter
        </p>
      </motion.div>

      {/* Corner bracket ornaments */}
      {CORNER_POSITIONS.map((pos, i) => (
        <div key={i} className={`absolute ${pos} ${CORNER_ROTATIONS[i]} opacity-[0.14]`}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M2 2 L14 2 M2 2 L2 14"
              stroke="#C4A057"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M5 5 L11 5 M5 5 L5 11"
              stroke="#C4A057"
              strokeWidth="0.75"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </div>
      ))}
    </motion.div>
  );
}
