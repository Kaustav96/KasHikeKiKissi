import { motion } from "framer-motion";
import { MapPin, ChevronDown } from "lucide-react";
import { Countdown } from "./Countdown";
import type { WeddingConfig } from "@shared/schema";

interface InvitationCardHeroProps {
  config: WeddingConfig;
}

export default function InvitationCardHero({ config }: InvitationCardHeroProps) {
  const handleScrollDown = () => {
    const nextSection = document.querySelector('[data-section="events"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 px-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 100% 80% at 20% 50%, rgba(139,30,45,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 100% 80% at 80% 50%, rgba(15,27,46,0.35) 0%, transparent 60%),
          linear-gradient(180deg, #0a0f1a 0%, #1a1520 40%, #1a0f15 70%, #0a0a0f 100%)
        `,
      }}
    >
      {/* Subtle mandala pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23D4AF37' stroke-width='0.5'%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "300px",
          backgroundPosition: "center",
        }}
      />

      {/* Golden glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 45% 40% at 50% 50%, rgba(212,175,55,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Floating particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
          style={{
            background: "radial-gradient(circle, #FFD700, transparent)",
            left: `${8 + (i % 4) * 28}%`,
            top: `${10 + Math.floor(i / 4) * 25}%`,
          }}
          animate={{
            y: [0, -35, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: 3.5 + (i % 3),
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Compact Invitation Card */}
      <motion.div
        className="relative w-full max-w-[700px] lg:max-w-[800px]"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Soft shadow glow */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
          style={{
            background: "radial-gradient(ellipse, rgba(212,175,55,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Main card */}
        <div
          className="relative w-full rounded-2xl"
          style={{
            background: "linear-gradient(135deg, #FAF6ED 0%, #F7F1E1 50%, #F5EDD8 100%)",
            border: "3px solid #D4AF37",
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.7),
              0 0 80px rgba(212,175,55,0.3),
              inset 0 1px 0 rgba(255,255,255,0.6)
            `,
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Inner border */}
          <div
            className="absolute inset-4 sm:inset-5 md:inset-6 border rounded-lg pointer-events-none"
            style={{
              borderColor: "rgba(212,175,55,0.2)",
            }}
          />

          {/* Content - Compact, no scroll */}
          <div className="relative p-6 sm:p-8 md:p-10 text-center">
            {/* Ganesh Image */}
            <motion.div
              className="flex justify-center mb-4 sm:mb-5"
              initial={{ scale: 0.6, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, type: "spring", stiffness: 120 }}
            >
              <img 
                src="/ganesh.png" 
                alt="Lord Ganesh" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                }}
              />
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase mb-2 sm:mb-3 font-medium" style={{ color: "#9E7C1B" }}>
                You Are Cordially Invited To
              </p>

              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#0F1B2E" }}>
                The Wedding Celebration
              </h1>

              {/* Divider */}
              <div className="flex items-center justify-center gap-2 my-2 sm:my-3">
                <div className="h-[1px] w-10 sm:w-14" style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="sm:w-[14px] sm:h-[14px]">
                  <circle cx="8" cy="8" r="7" stroke="#D4AF37" strokeWidth="0.5" fill="none" />
                  <path d="M8 2 L9 6 L13 7 L9 8 L8 12 L7 8 L3 7 L7 6 Z" fill="#D4AF37" />
                </svg>
                <div className="h-[1px] w-10 sm:w-14" style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
              </div>

              <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "#9E7C1B" }}>of</p>
            </motion.div>

            {/* Two-column layout for Bride and Groom */}
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-5 md:mb-6 relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {/* Bride Column - LEFT */}
              <div className="text-center">
                <motion.img 
                  src="/bride.png" 
                  alt="Himasree" 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full mx-auto mb-3 border-2"
                  style={{ borderColor: "#D4AF37" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
                <h3 
                  className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2"
                  style={{ 
                    color: "#D4AF37",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                  }}
                >
                  Himasree
                </h3>
                <div className="text-[10px] sm:text-xs space-y-0.5" style={{ color: "#9E7C1B" }}>
                  <p className="italic font-light">Daughter of</p>
                  <p className="font-medium">Mrs. Pinki Dam</p>
                  <p className="font-medium">Mr. Himadri Dam</p>
                </div>
              </div>

              {/* Stylish Divider */}
              <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex flex-col items-center justify-center">
                <motion.div
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  {/* Top ornament */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
                    <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="0.5" fill="rgba(212,175,55,0.1)" />
                    <path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 Z" fill="#D4AF37" />
                  </svg>
                  
                  {/* Vertical line with gradient */}
                  <div 
                    className="w-[2px] h-16 sm:h-20 md:h-24 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #D4AF37 0%, rgba(212,175,55,0.3) 50%, #D4AF37 100%)",
                      boxShadow: "0 0 8px rgba(212,175,55,0.4)"
                    }}
                  />
                  
                  {/* Heart ornament in middle */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #FAF6ED 0%, #F7F1E1 100%)",
                      border: "2px solid #D4AF37",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                    }}
                  >
                    <span className="text-xs sm:text-sm">💕</span>
                  </div>
                  
                  {/* Bottom ornament */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-1">
                    <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="0.5" fill="rgba(212,175,55,0.1)" />
                    <path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 Z" fill="#D4AF37" />
                  </svg>
                </motion.div>
              </div>

              {/* Groom Column - RIGHT */}
              <div className="text-center">
                <motion.img 
                  src="/groom.png" 
                  alt="Kaustav" 
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-full mx-auto mb-3 border-2"
                  style={{ borderColor: "#D4AF37" }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
                <h3 
                  className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2"
                  style={{ 
                    color: "#D4AF37",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                  }}
                >
                  Kaustav
                </h3>
                <div className="text-[10px] sm:text-xs space-y-0.5" style={{ color: "#9E7C1B" }}>
                  <p className="italic font-light">Son of</p>
                  <p className="font-medium">Mrs. Anshu Banerjee</p>
                  <p className="font-medium">Mr. Krishnendu Banerjee</p>
                </div>
              </div>
            </motion.div>

            {/* Details Frame */}
            <motion.div
              className="relative mx-auto max-w-lg py-3 sm:py-4 md:py-5 px-4 sm:px-5 rounded-lg mb-3 sm:mb-4"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.12))",
                border: "2px solid rgba(212,175,55,0.25)",
                boxShadow: "inset 0 1px 8px rgba(212,175,55,0.08), 0 2px 12px rgba(0,0,0,0.1)",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {/* Corner accents */}
              {["top-1 left-1", "top-1 right-1 rotate-90", "bottom-1 left-1 -rotate-90", "bottom-1 right-1 rotate-180"].map((pos, i) => (
                <div key={i} className={`absolute ${pos}`}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M1 1 L6 1 Q7 1 7 2 L7 6" stroke="#D4AF37" strokeWidth="0.8" />
                  </svg>
                </div>
              ))}

              {config.weddingDate ? (
                <>
                  <p className="font-serif text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4" style={{ color: "#0F1B2E" }}>
                    {new Date(config.weddingDate).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "Asia/Kolkata"
                    })}
                  </p>

                  <div className="mb-3 scale-90 sm:scale-95 md:scale-100">
                    <Countdown targetDate={new Date(config.weddingDate)} />
                  </div>
                </>
              ) : (
                <p className="font-serif text-base sm:text-lg italic mb-3" style={{ color: "#0F1B2E" }}>Date To Be Announced</p>
              )}

              {config.venueName && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
                  style={{
                    background: "rgba(212,175,55,0.12)",
                    border: "1px solid rgba(212,175,55,0.25)",
                  }}
                >
                  <MapPin size={11} className="sm:w-[13px] sm:h-[13px]" style={{ color: "#9E7C1B" }} />
                  <span className="text-[11px] sm:text-xs tracking-wide font-medium" style={{ color: "#9E7C1B" }}>
                    {config.venueName}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.7 }}
            >
              <p className="text-[11px] sm:text-xs leading-relaxed max-w-md mx-auto mb-2 sm:mb-3 px-2" style={{ color: "#9E7C1B" }}>
                With the blessings of our families and loved ones,<br />we invite you to join us in this joyous celebration
              </p>
              <div className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                <span>✨</span>
                <span>🙏</span>
                <span>✨</span>
              </div>
            </motion.div>
          </div>

          {/* Corner flourishes */}
          {[
            { pos: "top-0 left-0", rotate: "0" },
            { pos: "top-0 right-0", rotate: "90" },
            { pos: "bottom-0 left-0", rotate: "-90" },
            { pos: "bottom-0 right-0", rotate: "180" }
          ].map((corner, i) => (
            <motion.div
              key={i}
              className={`absolute ${corner.pos} w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 pointer-events-none opacity-60`}
              style={{ transform: `rotate(${corner.rotate}deg)` }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
            >
              <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
                <path d="M5 5 L20 5 Q25 5 25 10 L25 20" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 10 L17 10 Q19 10 19 12 L19 17" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
                <circle cx="25" cy="5" r="2" fill="#D4AF37" opacity="0.7" />
                <circle cx="5" cy="25" r="2" fill="#D4AF37" opacity="0.7" />
              </svg>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="mt-6 sm:mt-8 md:mt-10 text-center cursor-pointer z-30"
        onClick={handleScrollDown}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <motion.p
          className="text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-2 font-medium"
          style={{ color: "#F5D77A", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to Begin the Celebration
        </motion.p>

        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "2px solid #D4AF37",
              boxShadow: "0 0 18px rgba(212,175,55,0.35), inset 0 0 8px rgba(212,175,55,0.15)",
            }}
          >
            <ChevronDown size={18} className="sm:w-[20px] sm:h-[20px]" style={{ color: "#D4AF37" }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

