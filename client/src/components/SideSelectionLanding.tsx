import { motion } from "framer-motion";
import KHCrest from "./KHCrest";

function FloralDivider() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-px h-8"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(244,213,141,0.60))" }}
      />
      <svg width="26" height="44" viewBox="0 0 26 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 22 C13 22 9 16 13 10 C17 16 13 22 13 22Z" fill="#F4D58D" opacity="0.85" />
        <path d="M13 22 C13 22 19 19 22 22 C19 25 13 22 13 22Z" fill="#F4D58D" opacity="0.70" />
        <path d="M13 22 C13 22 17 28 13 34 C9 28 13 22 13 22Z" fill="#F4D58D" opacity="0.85" />
        <path d="M13 22 C13 22 7 25 4 22 C7 19 13 22 13 22Z" fill="#F4D58D" opacity="0.70" />
        <circle cx="13" cy="22" r="2.8" fill="#F4D58D" opacity="0.95" />
        <circle cx="13" cy="7" r="1.2" fill="#F4D58D" opacity="0.50" />
        <circle cx="13" cy="37" r="1.2" fill="#F4D58D" opacity="0.50" />
      </svg>
      <div
        className="w-px h-8"
        style={{ background: "linear-gradient(to top, transparent, rgba(244,213,141,0.60))" }}
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
        background: "linear-gradient(135deg, #4A3C38 0%, #5D4B45 25%, #6B5549 50%, #5D4B45 75%, #4A3C38 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65 }}
    >
      {/* Animated gradient overlay - wedding theme */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(45deg, rgba(139,0,0,0.15) 0%, rgba(176,132,72,0.15) 25%, rgba(198,167,94,0.15) 50%, rgba(176,132,72,0.15) 75%, rgba(139,0,0,0.15) 100%)",
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
      {/* Royal Wedding Art Background */}

      {/* Luxury Wedding Mandala - top right with hearts & crowns */}
      <motion.div
        className="hidden md:block absolute -top-32 -right-32 w-[500px] h-[500px] pointer-events-none opacity-[0.25]"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          {/* Outer ornate rings */}
          <circle cx="250" cy="250" r="200" fill="none" stroke="#F4D58D" strokeWidth="2" opacity="0.5" />
          <circle cx="250" cy="250" r="170" fill="none" stroke="#8B0000" strokeWidth="2.5" opacity="0.6" />
          <circle cx="250" cy="250" r="140" fill="none" stroke="#F4D58D" strokeWidth="1.5" opacity="0.4" />

          {/* 12 Hearts radiating outward - romantic */}
          {[...Array(12)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 30} 250 250)`}>
              <path d="M250 60 C245 55 238 55 235 60 C232 65 232 70 235 75 L250 95 L265 75 C268 70 268 65 265 60 C262 55 255 55 250 60 Z"
                    fill="#8B0000" opacity="0.6" />
              <path d="M250 80 L250 170" stroke="#F4D58D" strokeWidth="1.5" opacity="0.5" />
              <circle cx="250" cy="100" r="5" fill="#F4D58D" opacity="0.8" />
              {/* Lotus petals */}
              <path d="M245 130 Q250 120 255 130 Q250 140 245 130 Z" fill="#C6A75E" opacity="0.6" />
            </g>
          ))}

          {/* Central crown - royal */}
          <g transform="translate(250, 250)">
            <path d="M-15 -5 L-10 -20 L-5 -5 L0 -25 L5 -5 L10 -20 L15 -5 L15 5 L-15 5 Z" fill="#F4D58D" opacity="0.7" />
            <circle cx="-10" cy="-18" r="2.5" fill="#8B0000" opacity="0.8" />
            <circle cx="0" cy="-23" r="3" fill="#8B0000" opacity="0.8" />
            <circle cx="10" cy="-18" r="2.5" fill="#8B0000" opacity="0.8" />
          </g>
        </svg>
      </motion.div>

      {/* Interlocking Wedding Rings & Peacock Mandala - bottom left */}
      <motion.div
        className="hidden md:block absolute -bottom-40 -left-40 w-[550px] h-[550px] pointer-events-none opacity-[0.22]"
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ rotate: -360, scale: 1 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
          {/* Ornate outer circles */}
          <circle cx="250" cy="250" r="220" fill="none" stroke="#F4D58D" strokeWidth="2.5" opacity="0.6" />
          <circle cx="250" cy="250" r="190" fill="none" stroke="#8B0000" strokeWidth="2" opacity="0.5" />

          {/* Interlocking wedding rings */}
          <circle cx="230" cy="250" r="60" fill="none" stroke="#F4D58D" strokeWidth="8" opacity="0.7" />
          <circle cx="270" cy="250" r="60" fill="none" stroke="#8B0000" strokeWidth="8" opacity="0.7" />
          <circle cx="230" cy="250" r="55" fill="none" stroke="#C6A75E" strokeWidth="2" opacity="0.5" />
          <circle cx="270" cy="250" r="55" fill="none" stroke="#C6A75E" strokeWidth="2" opacity="0.5" />

          {/* 16 Peacock feather motifs - luxury Indian wedding */}
          {[...Array(16)].map((_, i) => (
            <g key={i} transform={`rotate(${i * 22.5} 250 250)`}>
              <path d="M250 30 L250 90" stroke="#F4D58D" strokeWidth="2" opacity="0.6" />
              {/* Peacock eye */}
              <ellipse cx="250" cy="55" rx="12" ry="18" fill="#8B0000" opacity="0.4" />
              <ellipse cx="250" cy="55" rx="8" ry="12" fill="#F4D58D" opacity="0.5" />
              <circle cx="250" cy="55" r="4" fill="#C6A75E" opacity="0.8" />
              {/* Feather barbs */}
              <path d="M245 50 Q240 45 238 48 M255 50 Q260 45 262 48" stroke="#F4D58D" strokeWidth="1" opacity="0.5" />
              <circle cx="250" cy="70" r="3" fill="#8B0000" opacity="0.7" />
            </g>
          ))}

          {/* Decorative ring pattern */}
          <path d="M250 250 m-80,0 a80,80 0 1,0 160,0 a80,80 0 1,0 -160,0"
                fill="none" stroke="#F4D58D" strokeWidth="1.5" opacity="0.4" strokeDasharray="8,4" />
        </svg>
      </motion.div>

      {/* Elegant flowing ribbons - wedding banners */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
        <svg className="w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 200 Q200 100 500 300 T1100 400" fill="none" stroke="#F4D58D" strokeWidth="4" opacity="0.8" />
          <path d="M-100 350 Q300 250 700 350 T1300 450" fill="none" stroke="#8B0000" strokeWidth="3" opacity="0.7" />
          <path d="M-50 500 Q400 350 800 500 T1400 600" fill="none" stroke="#C6A75E" strokeWidth="3.5" opacity="0.75" />
          <path d="M-100 50 Q250 -50 600 100 T1200 150" fill="none" stroke="#F4D58D" strokeWidth="2.5" opacity="0.6" />

          {/* Add small hearts along the ribbons */}
          <path d="M200 100 C198 97 195 97 193 100 C191 103 191 106 193 109 L200 118 L207 109 C209 106 209 103 207 100 C205 97 202 97 200 100 Z"
                fill="#8B0000" opacity="0.5" />
          <path d="M500 300 C498 297 495 297 493 300 C491 303 491 306 493 309 L500 318 L507 309 C509 306 509 303 507 300 C505 297 502 297 500 300 Z"
                fill="#8B0000" opacity="0.5" />
        </svg>
      </div>

      {/* Top-left: Rose bouquet & jewelry flourish */}
      <div className="hidden lg:block absolute top-12 left-12 w-48 h-48 pointer-events-none opacity-[0.20]">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Elegant curved stem */}
          <path d="M10 10 Q40 10 60 30 T90 80 Q90 120 60 140 T10 150" fill="none" stroke="#F4D58D" strokeWidth="2.5" />
          <path d="M20 20 Q45 20 60 35 T80 70 Q80 100 60 115 T20 130" fill="none" stroke="#8B0000" strokeWidth="2" />

          {/* Roses */}
          <g transform="translate(15, 15)">
            <circle cx="0" cy="0" r="10" fill="#8B0000" opacity="0.6" />
            <circle cx="0" cy="0" r="6" fill="#F4D58D" opacity="0.5" />
            <circle cx="0" cy="0" r="3" fill="#C6A75E" opacity="0.8" />
          </g>
          <g transform="translate(65, 65)">
            <circle cx="0" cy="0" r="12" fill="#8B0000" opacity="0.5" />
            <circle cx="0" cy="0" r="8" fill="#F4D58D" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C6A75E" opacity="0.7" />
          </g>
          <g transform="translate(30, 90)">
            <circle cx="0" cy="0" r="8" fill="#8B0000" opacity="0.6" />
            <circle cx="0" cy="0" r="5" fill="#F4D58D" opacity="0.5" />
          </g>

          {/* Jewelry chain of diamonds */}
          {[...Array(8)].map((_, i) => (
            <g key={i} transform={`translate(${20 + i * 15}, ${20 + i * 15})`}>
              <path d="M0 -4 L3 0 L0 4 L-3 0 Z" fill="#F4D58D" opacity="0.7" />
              <circle cx="0" cy="0" r="1.5" fill="#C6A75E" opacity="0.9" />
            </g>
          ))}
        </svg>
      </div>

      <div className="hidden lg:block absolute bottom-12 right-12 w-48 h-48 pointer-events-none opacity-[0.20]" style={{ transform: "rotate(180deg)" }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Elegant curved stem */}
          <path d="M10 10 Q40 10 60 30 T90 80 Q90 120 60 140 T10 150" fill="none" stroke="#F4D58D" strokeWidth="2.5" />
          <path d="M20 20 Q45 20 60 35 T80 70 Q80 100 60 115 T20 130" fill="none" stroke="#8B0000" strokeWidth="2" />

          {/* Roses */}
          <g transform="translate(15, 15)">
            <circle cx="0" cy="0" r="10" fill="#8B0000" opacity="0.6" />
            <circle cx="0" cy="0" r="6" fill="#F4D58D" opacity="0.5" />
            <circle cx="0" cy="0" r="3" fill="#C6A75E" opacity="0.8" />
          </g>
          <g transform="translate(65, 65)">
            <circle cx="0" cy="0" r="12" fill="#8B0000" opacity="0.5" />
            <circle cx="0" cy="0" r="8" fill="#F4D58D" opacity="0.6" />
            <circle cx="0" cy="0" r="4" fill="#C6A75E" opacity="0.7" />
          </g>
          <g transform="translate(30, 90)">
            <circle cx="0" cy="0" r="8" fill="#8B0000" opacity="0.6" />
            <circle cx="0" cy="0" r="5" fill="#F4D58D" opacity="0.5" />
          </g>

          {/* Jewelry chain of diamonds */}
          {[...Array(8)].map((_, i) => (
            <g key={i} transform={`translate(${20 + i * 15}, ${20 + i * 15})`}>
              <path d="M0 -4 L3 0 L0 4 L-3 0 Z" fill="#F4D58D" opacity="0.7" />
              <circle cx="0" cy="0" r="1.5" fill="#C6A75E" opacity="0.9" />
            </g>
          ))}
        </svg>
      </div>

      {/* Left: Lotus & Ornate Frame */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 pointer-events-none opacity-[0.15]">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Ornate frame */}
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="#F4D58D" strokeWidth="2.5" rx="5" />
          <rect x="15" y="15" width="70" height="70" fill="none" stroke="#8B0000" strokeWidth="1.5" rx="3" />

          {/* Lotus flower - sacred wedding symbol */}
          <g transform="translate(50, 50)">
            {[...Array(8)].map((_, i) => (
              <ellipse key={i} cx="0" cy="-15" rx="6" ry="18" fill="#F4D58D" opacity="0.6"
                       transform={`rotate(${i * 45})`} />
            ))}
            <circle cx="0" cy="0" r="8" fill="#8B0000" opacity="0.7" />
            <circle cx="0" cy="0" r="4" fill="#C6A75E" opacity="0.9" />
          </g>

          {/* Corner decorations */}
          <circle cx="10" cy="10" r="3" fill="#F4D58D" opacity="0.8" />
          <circle cx="90" cy="10" r="3" fill="#F4D58D" opacity="0.8" />
          <circle cx="10" cy="90" r="3" fill="#F4D58D" opacity="0.8" />
          <circle cx="90" cy="90" r="3" fill="#F4D58D" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 pointer-events-none opacity-[0.15]">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Wedding bells */}
          <g transform="translate(35, 40)">
            <path d="M0 -15 Q-8 -10 -10 0 Q-10 8 -5 12 L5 12 Q10 8 10 0 Q8 -10 0 -15 Z"
                  fill="#F4D58D" opacity="0.6" stroke="#8B0000" strokeWidth="1.5" />
            <circle cx="0" cy="14" r="2.5" fill="#8B0000" opacity="0.8" />
            <path d="M-3 -15 L3 -15" stroke="#C6A75E" strokeWidth="1.5" />
          </g>
          <g transform="translate(65, 40)">
            <path d="M0 -15 Q-8 -10 -10 0 Q-10 8 -5 12 L5 12 Q10 8 10 0 Q8 -10 0 -15 Z"
                  fill="#F4D58D" opacity="0.6" stroke="#8B0000" strokeWidth="1.5" />
            <circle cx="0" cy="14" r="2.5" fill="#8B0000" opacity="0.8" />
            <path d="M-3 -15 L3 -15" stroke="#C6A75E" strokeWidth="1.5" />
          </g>

          {/* Ribbon connecting bells */}
          <path d="M35 25 Q50 20 65 25" fill="none" stroke="#8B0000" strokeWidth="2" opacity="0.6" />

          {/* Decorative heart above */}
          <path d="M50 10 C48 7 45 7 43 10 C41 13 41 16 43 19 L50 28 L57 19 C59 16 59 13 57 10 C55 7 52 7 50 10 Z"
                fill="#8B0000" opacity="0.5" />
        </svg>
      </div>

      {/* Scattered Luxury Diamonds & Gems */}
      <div className="absolute top-[15%] right-[15%] w-20 h-20 pointer-events-none opacity-[0.18]">
        <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 5 L50 25 L70 30 L50 40 L45 60 L40 40 L20 35 L30 25 Z" fill="#F4D58D" opacity="0.7" />
          <path d="M40 10 L48 25 L63 28 L48 35 L45 48 L40 35 L25 30 L32 25 Z" fill="#C6A75E" opacity="0.8" />
          <circle cx="40" cy="30" r="3" fill="#8B0000" opacity="0.6" />
        </svg>
      </div>

      <div className="absolute bottom-[20%] left-[18%] w-16 h-16 pointer-events-none opacity-[0.16]">
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5 L38 20 L53 23 L38 30 L35 45 L30 30 L15 25 L23 20 Z" fill="#F4D58D" opacity="0.7" />
          <path d="M30 8 L36 20 L48 22 L36 27 L34 38 L30 27 L18 23 L24 20 Z" fill="#C6A75E" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute top-[40%] left-[8%] w-14 h-14 pointer-events-none opacity-[0.14]">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 2 L30 15 L43 18 L30 23 L28 36 L25 23 L12 19 L18 15 Z" fill="#F4D58D" opacity="0.7" />
        </svg>
      </div>

      <div className="absolute top-[35%] right-[10%] w-12 h-12 pointer-events-none opacity-[0.12]">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 5 L30 18 L42 20 L30 25 L28 38 L25 25 L13 21 L18 18 Z" fill="#8B0000" opacity="0.6" />
        </svg>
      </div>

      {/* Elegant Royal Crowns scattered */}
      <div className="absolute bottom-[45%] right-[20%] w-16 h-16 pointer-events-none opacity-[0.12]">
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 35 L15 15 L20 35 L30 10 L40 35 L45 15 L50 35 L50 45 L10 45 Z" fill="#F4D58D" opacity="0.6" />
          <circle cx="15" cy="15" r="2" fill="#8B0000" opacity="0.8" />
          <circle cx="30" cy="10" r="2.5" fill="#8B0000" opacity="0.8" />
          <circle cx="45" cy="15" r="2" fill="#8B0000" opacity="0.8" />
        </svg>
      </div>

      <div className="absolute top-[60%] left-[30%] w-14 h-14 pointer-events-none opacity-[0.11]">
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 30 L12 12 L16 30 L25 8 L34 30 L38 12 L42 30 L42 38 L8 38 Z" fill="#F4D58D" opacity="0.5" />
          <circle cx="25" cy="8" r="2" fill="#C6A75E" opacity="0.7" />
        </svg>
      </div>

      {/* Royal damask with wedding motifs overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F4D58D'%3E%3Cpath d='M60 10 Q70 30 60 50 Q50 30 60 10 M60 70 Q70 90 60 110 Q50 90 60 70 M10 60 Q30 70 50 60 Q30 50 10 60 M70 60 Q90 70 110 60 Q90 50 70 60' opacity='0.6'/%3E%3Ccircle cx='60' cy='60' r='8' opacity='0.8'/%3E%3Cpath d='M60 35 C58 32 55 32 53 35 C51 38 51 41 53 44 L60 53 L67 44 C69 41 69 38 67 35 C65 32 62 32 60 35 Z' opacity='0.5' fill='%238B0000'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "120px",
        }}
      />

      {/* Warm vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(20,10,5,0.40) 100%)",
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
          <p className="text-[10px] tracking-[0.48em] uppercase mb-4 font-medium" style={{ color: "#D4AF6A" }}>
            Welcome to the celebration of
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: "#FFF8E7" }}>
            Himasree <span style={{ color: "#F4D58D" }}>&amp;</span> Kaustav
          </h1>

          {/* Ornamental rule */}
          <div className="flex items-center justify-center gap-4 my-5">
            <div className="h-px w-14 sm:w-20 flex-shrink-0" style={{ background: "linear-gradient(to right, transparent, #F4D58D)" }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1C7 1 9.5 5.5 13 7C9.5 8.5 7 13 7 13C7 13 4.5 8.5 1 7C4.5 5.5 7 1 7 1Z" fill="#F4D58D" opacity="0.85" />
            </svg>
            <div className="h-px w-14 sm:w-20 flex-shrink-0" style={{ background: "linear-gradient(to left, transparent, #F4D58D)" }} />
          </div>

          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "#E8D4B8" }}>
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
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #F4D58D, transparent)" }} />
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
          style={{ color: "#D4AF6A", opacity: 0.75 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          You can switch sides anytime from the menu
        </motion.p>
      </div>

      {/* Corner bracket ornaments */}
      {["top-8 left-8", "top-8 right-8 rotate-90", "bottom-8 left-8 -rotate-90", "bottom-8 right-8 rotate-180"].map((cls, i) => (
        <div key={i} className={`absolute ${cls} opacity-[0.35]`}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M2 2 L14 2 M2 2 L2 14" stroke="#F4D58D" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 5 L11 5 M5 5 L5 11" stroke="#F4D58D" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      ))}
    </motion.div>
  );
}