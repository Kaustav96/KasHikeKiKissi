import { motion } from "framer-motion";
import KHCrest from "./KHCrest";

function FloralDivider() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-px h-8"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(176,132,72,0.45))" }}
      />
      <svg width="26" height="44" viewBox="0 0 26 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 22 C13 22 9 16 13 10 C17 16 13 22 13 22Z" fill="#B08448" opacity="0.75" />
        <path d="M13 22 C13 22 19 19 22 22 C19 25 13 22 13 22Z" fill="#B08448" opacity="0.6" />
        <path d="M13 22 C13 22 17 28 13 34 C9 28 13 22 13 22Z" fill="#B08448" opacity="0.75" />
        <path d="M13 22 C13 22 7 25 4 22 C7 19 13 22 13 22Z" fill="#B08448" opacity="0.6" />
        <circle cx="13" cy="22" r="2.8" fill="#B08448" opacity="0.95" />
        <circle cx="13" cy="7" r="1.2" fill="#B08448" opacity="0.4" />
        <circle cx="13" cy="37" r="1.2" fill="#B08448" opacity="0.4" />
      </svg>
      <div
        className="w-px h-8"
        style={{ background: "linear-gradient(to top, transparent, rgba(176,132,72,0.45))" }}
      />
    </div>
  );
}

interface SideSelectionLandingProps {
  onSelectSide: (side: "groom" | "bride") => void;
}

export default function SideSelectionLanding({ onSelectSide }: SideSelectionLandingProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #F5EDE0 0%, #EDE3CF 40%, #E6D8BE 70%, #DDD0AA 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
    >
      {/* Warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(160,120,60,0.10) 100%)",
        }}
      />

      {/* Subtle circle pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B08448' fill-opacity='1'%3E%3Cpath d='M30 0C13.4 0 0 13.4 0 30s13.4 30 30 30 30-13.4 30-30S46.6 0 30 0zm0 54C16.7 54 6 43.3 6 30S16.7 6 30 6s24 10.7 24 24-10.7 24-24 24z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto text-center w-full">
        {/* Crest */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <KHCrest size={78} />
        </motion.div>

        {/* Headline */}
        <motion.div
          className="mb-12"
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-[10px] tracking-[0.48em] uppercase mb-4 font-medium" style={{ color: "#8A7050" }}>
            Welcome to the celebration of
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: "#1A1714" }}>
            Himasree <span style={{ color: "#B08448" }}>&amp;</span> Kaustav
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-14 sm:w-20 flex-shrink-0" style={{ background: "linear-gradient(to right, transparent, #B08448)" }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1C7 1 9.5 5.5 13 7C9.5 8.5 7 13 7 13C7 13 4.5 8.5 1 7C4.5 5.5 7 1 7 1Z" fill="#B08448" opacity="0.85" />
            </svg>
            <div className="h-px w-14 sm:w-20 flex-shrink-0" style={{ background: "linear-gradient(to left, transparent, #B08448)" }} />
          </div>

          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#6B5A3E" }}>
            Choose your side to step into the celebration
          </p>
        </motion.div>

        {/* ── Box Buttons ── */}
        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-0"
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Bride Button */}
          <motion.button
            onClick={() => setTimeout(() => onSelectSide("bride"), 220)}
            className="group relative w-full sm:w-[260px] py-6 sm:py-7 rounded-xl overflow-hidden focus:outline-none"
            style={{
              background: "linear-gradient(135deg, #A8173A 0%, #7A0020 60%, #510013 100%)",
              border: "2px solid rgba(198,167,94,0.35)",
              boxShadow: "0 6px 28px rgba(120,0,24,0.28), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: "0 14px 44px rgba(120,0,24,0.45), 0 0 0 2px rgba(198,167,94,0.42), inset 0 1px 0 rgba(255,255,255,0.18)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Inner border inset */}
            <div
              className="absolute inset-[6px] rounded-lg border pointer-events-none"
              style={{ borderColor: "rgba(198,167,94,0.18)" }}
            />
            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)" }}
              />
            </div>
            <div className="relative flex flex-col items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                Bride's Side
              </span>
              <div className="h-px w-10 my-0.5" style={{ background: "rgba(198,167,94,0.55)" }} />
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>
                Himasree's Family &amp; Friends
              </span>
            </div>
          </motion.button>

          {/* Floral divider — horizontal on mobile, vertical on desktop */}
          <div className="hidden sm:flex items-center justify-center px-4">
            <FloralDivider />
          </div>
          <div className="sm:hidden flex items-center justify-center py-1">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #B08448, transparent)" }} />
          </div>

          {/* Groom Button */}
          <motion.button
            onClick={() => setTimeout(() => onSelectSide("groom"), 220)}
            className="group relative w-full sm:w-[260px] py-6 sm:py-7 rounded-xl overflow-hidden focus:outline-none"
            style={{
              background: "linear-gradient(135deg, #2E2820 0%, #1C1710 60%, #110D08 100%)",
              border: "2px solid rgba(176,132,72,0.40)",
              boxShadow: "0 6px 28px rgba(16,12,6,0.38), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
            whileHover={{
              scale: 1.03,
              y: -2,
              boxShadow: "0 14px 44px rgba(176,132,72,0.32), 0 0 0 2px rgba(176,132,72,0.48), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Inner border inset */}
            <div
              className="absolute inset-[6px] rounded-lg border pointer-events-none"
              style={{ borderColor: "rgba(176,132,72,0.18)" }}
            />
            {/* Shimmer on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
              />
            </div>
            <div className="relative flex flex-col items-center gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wide" style={{ color: "#D4AF6A" }}>
                Groom's Side
              </span>
              <div className="h-px w-10 my-0.5" style={{ background: "rgba(176,132,72,0.55)" }} />
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(212,175,106,0.65)" }}>
                Kaustav's Family &amp; Friends
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Hint */}
        <motion.p
          className="mt-10 text-[10px] italic tracking-wide"
          style={{ color: "#8A7050", opacity: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          You can switch sides anytime from the menu
        </motion.p>
      </div>

      {/* Corner bracket ornaments */}
      {["top-8 left-8", "top-8 right-8 rotate-90", "bottom-8 left-8 -rotate-90", "bottom-8 right-8 rotate-180"].map((cls, i) => (
        <div key={i} className={`absolute ${cls} opacity-[0.18]`}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M2 2 L14 2 M2 2 L2 14" stroke="#B08448" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 5 L11 5 M5 5 L5 11" stroke="#B08448" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      ))}
    </motion.div>
  );
}