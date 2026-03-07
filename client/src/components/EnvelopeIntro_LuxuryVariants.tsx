// Royal Luxury Variants for EnvelopeIntro
// Copy the variant you want to use into EnvelopeIntro.tsx

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 1: BAROQUE GOLD OPULENCE
   ───────────────────────────────────────────────────────────────────────────
   Rich gold filigree patterns, ornate borders, luxurious royal atmosphere
   ═══════════════════════════════════════════════════════════════════════════ */

// Background for envelope phase:
background: "linear-gradient(135deg, #1A1410 0%, #2B1D16 50%, #1A1410 100%)"

// Artistic Background Layer:
<div className="absolute inset-0 opacity-30" style={{
  background: `
    radial-gradient(circle at 20% 30%, rgba(212,175,106,0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(185,151,91,0.12) 0%, transparent 40%),
    repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(212,175,106,0.03) 2px, rgba(212,175,106,0.03) 4px)
  `
}} />

// Ornate border pattern SVG:
<svg className="absolute inset-0 pointer-events-none opacity-20">
  <defs>
    <pattern id="baroquePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#D4AF6A" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="#D4AF6A" strokeWidth="0.3" />
      <path d="M 50 20 L 50 30 M 50 70 L 50 80 M 20 50 L 30 50 M 70 50 L 80 50" stroke="#D4AF6A" strokeWidth="0.5" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#baroquePattern)" />
</svg>

// Envelope design with ornate details:
<motion.div className="relative w-[400px] sm:w-[450px] h-[260px] sm:h-[290px]">
  {/* Main envelope body */}
  <motion.div className="absolute inset-0 rounded-2xl" style={{
    background: "linear-gradient(145deg, #D4AF6A 0%, #B8975A 50%, #A68548 100%)",
    boxShadow: "0 30px 80px rgba(212,175,106,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
    border: "2px solid rgba(255,255,255,0.15)"
  }}>
    {/* Embossed pattern overlay */}
    <div className="absolute inset-2 rounded-xl" style={{
      background: `
        radial-gradient(ellipse at top, rgba(0,0,0,0.05) 0%, transparent 50%),
        repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)
      `
    }} />

    {/* Corner filigree ornaments */}
    {[0, 1, 2, 3].map(i => (
      <div key={i} className={`absolute w-16 h-16 ${
        i === 0 ? 'top-4 left-4' : i === 1 ? 'top-4 right-4' : i === 2 ? 'bottom-4 left-4' : 'bottom-4 right-4'
      } ${i > 1 ? 'rotate-180' : ''}`}>
        <svg viewBox="0 0 50 50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1">
          <path d="M10 10 Q 5 5 10 2 T 15 10 M10 10 Q 5 15 2 10 T 10 5" />
          <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.2)" />
        </svg>
      </div>
    ))}
  </motion.div>

  {/* Wax seal with ornate design */}
  <motion.div className="absolute inset-0 flex items-center justify-center">
    <div className="relative">
      <motion.div className="w-28 h-28 rounded-full flex items-center justify-center" style={{
        background: "linear-gradient(145deg, #8B1F1F 0%, #6B1010 100%)",
        boxShadow: "0 10px 40px rgba(139,31,31,0.6), inset 0 2px 6px rgba(255,255,255,0.1)"
      }}>
        <div className="absolute inset-2 rounded-full" style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)"
        }} />
        <KHCrest size={50} />
      </motion.div>
      {/* Ornate seal border */}
      <motion.div className="absolute inset-0 rounded-full border-2" style={{
        borderColor: "rgba(212,175,106,0.3)"
      }} animate={{
        rotate: 360,
        scale: [1, 1.05, 1]
      }} transition={{
        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }} />
    </div>
  </motion.div>

  {/* Names with royal typography */}
  <motion.div className="absolute -bottom-28 left-0 right-0 text-center">
    <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: "rgba(212,175,106,0.6)" }}>from</p>
    <div className="flex items-center justify-center gap-3">
      <span className="font-serif text-2xl tracking-[0.25em] uppercase" style={{ color: "#D4AF6A", textShadow: "0 2px 12px rgba(212,175,106,0.4)" }}>Himasree</span>
      <span className="font-serif text-xl italic" style={{ color: "rgba(212,175,106,0.5)" }}>&</span>
      <span className="font-serif text-2xl tracking-[0.25em] uppercase" style={{ color: "#D4AF6A", textShadow: "0 2px 12px rgba(212,175,106,0.4)" }}>Kaustav</span>
    </div>
  </motion.div>

  <motion.p className="absolute bottom-6 w-full text-center text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
    Tap to reveal
  </motion.p>
</motion.div>

// Floating gold particles:
{[...Array(25)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-1 h-1 rounded-full"
    style={{
      background: "radial-gradient(circle, #D4AF6A 0%, transparent 70%)",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      boxShadow: "0 0 8px rgba(212,175,106,0.6)"
    }}
    animate={{
      y: [0, -30 - Math.random() * 20],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1, 0.3]
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay: i * 0.2,
      ease: "easeOut"
    }}
  />
))}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 2: ROYAL VELVET PURPLE
   ───────────────────────────────────────────────────────────────────────────
   Deep purple velvet texture, gold accents, imperial elegance
   ═══════════════════════════════════════════════════════════════════════════ */

// Background:
background: "linear-gradient(135deg, #1A0F24 0%, #2D1845 35%, #3E2555 70%, #1A0F24 100%)"

// Velvet texture overlay:
<div className="absolute inset-0" style={{
  background: `
    radial-gradient(circle at 30% 40%, rgba(138,43,226,0.12) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(75,0,130,0.08) 0%, transparent 50%),
    repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(138,43,226,0.02) 1px, rgba(138,43,226,0.02) 2px)
  `,
  backdropFilter: "blur(1px)"
}} />

// Damask pattern SVG:
<svg className="absolute inset-0 opacity-15 pointer-events-none">
  <defs>
    <pattern id="damask" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M40 10 Q35 20 40 30 T 40 50 Q 45 40 40 30 T 40 10" fill="none" stroke="#8A2BE2" strokeWidth="0.5" />
      <circle cx="40" cy="40" r="15" fill="none" stroke="#8A2BE2" strokeWidth="0.3" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#damask)" />
</svg>

// Purple velvet envelope:
<motion.div style={{
  background: "linear-gradient(145deg, #6B46C1 0%, #553C9A 50%, #4A2889 100%)",
  boxShadow: "0 25px 70px rgba(107,70,193,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
  border: "1px solid rgba(212,175,106,0.3)"
}}>
  {/* Gold trim details */}
  <div className="absolute inset-x-4 top-4 h-px" style={{ background: "linear-gradient(90deg, transparent, #D4AF6A, transparent)" }} />
  <div className="absolute inset-x-4 bottom-4 h-px" style={{ background: "linear-gradient(90deg, transparent, #D4AF6A, transparent)" }} />

  {/* Imperial crest */}
  <div className="text-center">
    <div className="inline-block px-6 py-2 mb-3" style={{
      background: "rgba(212,175,106,0.1)",
      border: "1px solid rgba(212,175,106,0.3)",
      borderRadius: "2px"
    }}>
      <span className="text-xs tracking-[0.5em] uppercase" style={{ color: "#D4AF6A" }}>Royal Invitation</span>
    </div>
  </div>
</motion.div>

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 3: VINTAGE ROSE GARDEN
   ───────────────────────────────────────────────────────────────────────────
   Soft watercolor roses, romantic ivory and blush tones, garden wedding aesthetic
   ═══════════════════════════════════════════════════════════════════════════ */

// Background:
background: "linear-gradient(135deg, #FFF5F0 0%, #FFE8E0 35%, #FFF0E8 70%, #FFF5F0 100%)"

// Watercolor rose overlays:
<div className="absolute inset-0 opacity-20">
  <motion.div className="absolute w-64 h-64 rounded-full top-0 right-0" style={{
    background: "radial-gradient(circle, rgba(255,182,193,0.4) 0%, transparent 60%)",
    filter: "blur(40px)"
  }} animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 6, repeat: Infinity }} />
  <motion.div className="absolute w-80 h-80 rounded-full bottom-0 left-0" style={{
    background: "radial-gradient(circle, rgba(255,218,224,0.3) 0%, transparent 60%)",
    filter: "blur(50px)"
  }} animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} />
</div>

// Floral pattern SVG:
<svg className="absolute inset-0 opacity-12 pointer-events-none">
  <defs>
    <pattern id="roses" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
      <circle cx="60" cy="60" r="20" fill="none" stroke="#FFB6C1" strokeWidth="0.8" />
      <circle cx="60" cy="60" r="15" fill="none" stroke="#FFB6C1" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="10" fill="none" stroke="#FFB6C1" strokeWidth="0.4" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <ellipse key={i} cx={60 + 18 * Math.cos((i * 60) * Math.PI / 180)} cy={60 + 18 * Math.sin((i * 60) * Math.PI / 180)}
          rx="5" ry="8" fill="rgba(255,182,193,0.2)" transform={`rotate(${i * 60} ${60 + 18 * Math.cos((i * 60) * Math.PI / 180)} ${60 + 18 * Math.sin((i * 60) * Math.PI / 180)})`} />
      ))}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#roses)" />
</svg>

// Ivory envelope with rose details:
<motion.div style={{
  background: "linear-gradient(145deg, #FFFAF7 0%, #FFF0E8 50%, #FFE8E0 100%)",
  boxShadow: "0 20px 60px rgba(255,182,193,0.3), inset 0 1px 0 rgba(255,255,255,0.8)",
  border: "2px solid rgba(255,182,193,0.2)"
}}>
  {/* Rose corner decorations */}
  {[0, 1, 2, 3].map(i => (
    <div key={i} className={`absolute ${i < 2 ? 'top-3' : 'bottom-3'} ${i % 2 === 0 ? 'left-3' : 'right-3'}`}>
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="8" fill="none" stroke="#FFB6C1" strokeWidth="1" />
        <circle cx="16" cy="16" r="5" fill="rgba(255,182,193,0.2)" />
        <circle cx="16" cy="16" r="3" fill="rgba(255,182,193,0.3)" />
      </svg>
    </div>
  ))}

  {/* Ribbon seal */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{
      background: "linear-gradient(145deg, #FFB6C1 0%, #FF9EAD 100%)",
      boxShadow: "0 8px 30px rgba(255,182,193,0.5)"
    }}>
      <div className="absolute inset-1 rounded-full" style={{
        background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4) 0%, transparent 60%)"
      }} />
      <span className="font-serif text-3xl" style={{ color: "#FFF", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>HK</span>
    </div>
  </div>
</motion.div>

// Falling rose petals:
{[...Array(15)].map((_, i) => (
  <motion.div
    key={i}
    className="absolute w-3 h-3 rounded-full"
    style={{
      background: "radial-gradient(ellipse, #FFB6C1 0%, #FF9EAD 100%)",
      left: `${Math.random() * 100}%`,
      top: `${-10 - Math.random() * 20}%`,
      opacity: 0.6
    }}
    animate={{
      y: `${110 + Math.random() * 20}vh`,
      x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
      rotate: 360,
      opacity: [0, 0.6, 0]
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      repeat: Infinity,
      delay: i * 0.4,
      ease: "linear"
    }}
  />
))}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 4: ART DECO EMERALD
   ───────────────────────────────────────────────────────────────────────────
   Geometric patterns, emerald green with gold, 1920s Great Gatsby style
   ═══════════════════════════════════════════════════════════════════════════ */

// Background:
background: "linear-gradient(135deg, #0A2F23 0%, #0D4030 35%, #0F5239 70%, #0A2F23 100%)"

// Art deco geometric pattern:
<svg className="absolute inset-0 opacity-25 pointer-events-none">
  <defs>
    <pattern id="artDeco" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M50 10 L60 30 L80 30 L65 43 L70 63 L50 50 L30 63 L35 43 L20 30 L40 30 Z"
        fill="none" stroke="#D4AF6A" strokeWidth="0.5" />
      <rect x="45" y="45" width="10" height="10" fill="none" stroke="#D4AF6A" strokeWidth="0.3" />
      <line x1="30" y1="30" x2="70" y2="70" stroke="#D4AF6A" strokeWidth="0.2" />
      <line x1="70" y1="30" x2="30" y2="70" stroke="#D4AF6A" strokeWidth="0.2" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#artDeco)" />
</svg>

// Emerald envelope with gold trim:
<motion.div style={{
  background: "linear-gradient(145deg, #0F5B3F 0%, #0C4530 50%, #0A3626 100%)",
  boxShadow: "0 30px 80px rgba(15,91,63,0.6), inset 0 1px 0 rgba(212,175,106,0.2)",
  border: "2px solid rgba(212,175,106,0.4)"
}}>
  {/* Gold art deco corners */}
  {[0, 1, 2, 3].map(i => (
    <div key={i} className={`absolute ${i < 2 ? 'top-4' : 'bottom-4'} ${i % 2 === 0 ? 'left-4' : 'right-4'} ${i > 1 ? 'rotate-180' : ''}`}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <path d="M5 5 L15 5 L15 2 L5 2 Z M5 5 L5 15 L2 15 L2 5 Z" fill="#D4AF6A" />
        <circle cx="10" cy="10" r="3" fill="none" stroke="#D4AF6A" strokeWidth="1" />
        <path d="M7 13 L10 10 L13 13 M13 7 L10 10 L7 7" stroke="#D4AF6A" strokeWidth="0.8" fill="none" />
      </svg>
    </div>
  ))}

  {/* Geometric center emblem */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="relative">
      <div className="w-32 h-32 flex items-center justify-center" style={{
        background: "linear-gradient(145deg, #D4AF6A 0%, #B8975A 100%)",
        clipPath: "polygon(50% 0%, 85% 15%, 100% 50%, 85% 85%, 50% 100%, 15% 85%, 0% 50%, 15% 15%)",
        boxShadow: "0 10px 40px rgba(212,175,106,0.4)"
      }}>
        <KHCrest size={55} />
      </div>
    </div>
  </div>

  {/* Gold accent lines */}
  <div className="absolute left-12 right-12 top-8" style={{
    height: "2px",
    background: "linear-gradient(90deg, transparent, #D4AF6A 20%, #D4AF6A 80%, transparent)"
  }} />
  <div className="absolute left-12 right-12 bottom-8" style={{
    height: "2px",
    background: "linear-gradient(90deg, transparent, #D4AF6A 20%, #D4AF6A 80%, transparent)"
  }} />
</motion.div>

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 5: CLASSIC IVORY DAMASK
   ───────────────────────────────────────────────────────────────────────────
   Traditional luxury, cream and gold damask, timeless elegance
   ═══════════════════════════════════════════════════════════════════════════ */

// Background:
background: "linear-gradient(135deg, #F8F6F0 0%, #F0EBE3 35%, #E8E0D8 70%, #F8F6F0 100%)"

// Damask pattern overlay:
<svg className="absolute inset-0 opacity-18 pointer-events-none">
  <defs>
    <pattern id="classicDamask" x="0" y="0" width="150" height="150" patternUnits="userSpaceOnUse">
      <path d="M75 30 Q65 45 75 60 T 75 90 Q85 75 75 60 T 75 30" fill="none" stroke="#B9975B" strokeWidth="1.2" />
      <circle cx="75" cy="75" r="25" fill="none" stroke="#B9975B" strokeWidth="0.8" />
      <path d="M75 40 Q65 50 75 60 M75 60 Q85 50 75 40" fill="#B9975B" opacity="0.2" />
      <ellipse cx="75" cy="110" rx="15" ry="8" fill="#B9975B" opacity="0.15" />
      <ellipse cx="75" cy="40" rx="15" ry="8" fill="#B9975B" opacity="0.15" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#classicDamask)" />
</svg>

// Luxury ivory envelope:
<motion.div style={{
  background: "linear-gradient(145deg, #F5F3ED 0%, #EBE7DC 50%, #E1DABF 100%)",
  boxShadow: "0 25px 70px rgba(185,151,91,0.25), inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.05)",
  border: "1px solid rgba(185,151,91,0.2)"
}}>
  {/* Embossed damask corner motifs */}
  {[0, 1, 2, 3].map(i => (
    <div key={i} className={`absolute ${i < 2 ? 'top-5' : 'bottom-5'} ${i % 2 === 0 ? 'left-5' : 'right-5'} ${i > 1 ? 'rotate-180' : ''}`}>
      <svg width="48" height="48" viewBox="0 0 48 48" opacity="0.3">
        <path d="M24 8 Q18 14 24 20 T 24 32 Q30 26 24 20 T 24 8" fill="none" stroke="#B9975B" strokeWidth="1" />
        <circle cx="24" cy="24" r="12" fill="none" stroke="#B9975B" strokeWidth="0.6" />
        <ellipse cx="24" cy="30" rx="8" ry="4" fill="rgba(185,151,91,0.2)" />
      </svg>
    </div>
  ))}

  {/* Classic wax seal */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{
      background: "linear-gradient(145deg, #8B1F1F 0%, #6B1010 100%)",
      boxShadow: "0 12px 40px rgba(139,31,31,0.5), inset 0 2px 8px rgba(255,255,255,0.12)"
    }}>
      {/* Wax texture */}
      <div className="absolute inset-0 rounded-full" style={{
        background: `
          radial-gradient(circle at 35% 35%, rgba(255,255,255,0.15) 0%, transparent 60%),
          radial-gradient(circle at 65% 70%, rgba(0,0,0,0.1) 0%, transparent 40%)
        `
      }} />
      <KHCrest size={52} />
    </div>
    {/* Ribbon under seal */}
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6" style={{
      background: "linear-gradient(90deg, transparent, #8B1F1F 20%, #8B1F1F 80%, transparent)",
      clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 90% 80%, 10% 80%, 0% 100%)"
    }} />
  </div>

  {/* Decorative divider line */}
  <div className="absolute left-16 right-16 bottom-16 flex items-center justify-center gap-4">
    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #B9975B)" }} />
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#B9975B" strokeWidth="0.8" />
      <circle cx="10" cy="10" r="3" fill="#B9975B" />
    </svg>
    <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #B9975B, transparent)" }} />
  </div>
</motion.div>

// Names with classic serif typography:
<motion.div className="absolute -bottom-32 left-0 right-0 text-center">
  <div className="inline-block px-8 py-3 mb-4" style={{
    background: "rgba(185,151,91,0.08)",
    borderTop: "1px solid rgba(185,151,91,0.2)",
    borderBottom: "1px solid rgba(185,151,91,0.2)"
  }}>
    <p className="text-[10px] tracking-[0.6em] uppercase mb-2" style={{ color: "rgba(122,106,74,0.6)" }}>Invitation from</p>
    <div className="flex items-center gap-4">
      <span className="font-serif text-2xl tracking-widest" style={{ color: "#7A6A4A" }}>Himasree</span>
      <span className="font-serif text-lg italic" style={{ color: "rgba(122,106,74,0.4)" }}>&</span>
      <span className="font-serif text-2xl tracking-widest" style={{ color: "#7A6A4A" }}>Kaustav</span>
    </div>
  </div>
</motion.div>
