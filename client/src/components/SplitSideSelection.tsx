import { useState } from "react";
import { motion } from "framer-motion";

interface SplitSideSelectionProps {
  onSelectSide: (side: "bride" | "groom") => void;
}

export default function SplitSideSelection({ onSelectSide }: SplitSideSelectionProps) {
  const [hoveredSide, setHoveredSide] = useState<"bride" | "groom" | null>(null);

  return (
    <>
      {/* DESKTOP & TABLET: Split Side Layout (≥768px) */}
      <div className="hidden md:block fixed inset-0 overflow-hidden">
        {/* Bride's Side - Left Half */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 cursor-pointer overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #9F2A3B 0%, #8B1E2D 50%, #5E141F 100%)",
          }}
          initial={{ width: "50%" }}
          animate={{
            width: hoveredSide === "bride" ? "60%" : hoveredSide === "groom" ? "40%" : "50%",
            background:
              hoveredSide === "bride"
                ? "linear-gradient(135deg, #B52E43 0%, #9F2A3B 50%, #8B1E2D 100%)"
                : "linear-gradient(135deg, #9F2A3B 0%, #8B1E2D 50%, #5E141F 100%)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onHoverStart={() => setHoveredSide("bride")}
          onHoverEnd={() => setHoveredSide(null)}
          onClick={() => onSelectSide("bride")}
        >
          {/* Decorative Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='50' cy='10' r='4'/%3E%3Ccircle cx='10' cy='50' r='4'/%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-6 lg:px-8"
            animate={{
              scale: hoveredSide === "bride" ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/bride.png"
              alt="Bride"
              className="w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-cover rounded-full mx-auto mb-5 border-4 border-white/20"
              animate={{
                scale: hoveredSide === "bride" ? [1, 1.1, 1] : 1,
                boxShadow: hoveredSide === "bride" 
                  ? "0 0 40px rgba(255,255,255,0.4), 0 10px 40px rgba(0,0,0,0.5)"
                  : "0 0 20px rgba(255,255,255,0.2), 0 5px 20px rgba(0,0,0,0.3)"
              }}
              transition={{ duration: 0.6, repeat: hoveredSide === "bride" ? Infinity : 0 }}
            />
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3">
              Bride's Side
            </h2>
            <div
              className="h-[1px] w-28 mx-auto my-3"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
              }}
            />
            <p className="text-base lg:text-lg text-white/90 tracking-wide">Himasree</p>
            <p className="text-xs text-white/70 mt-2 tracking-wider uppercase">Family & Friends</p>
          </motion.div>
        </motion.div>

        {/* Gold vertical divider - moves with panels */}
        <motion.div
          className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #D4AF37 10%, #D4AF37 90%, transparent)",
            boxShadow: "0 0 20px rgba(212,175,55,0.6)",
          }}
          initial={{ left: "50%", scaleY: 0 }}
          animate={{
            left: hoveredSide === "bride" ? "60%" : hoveredSide === "groom" ? "40%" : "50%",
            scaleY: 1
          }}
          transition={{ 
            left: { duration: 0.4, ease: "easeInOut" },
            scaleY: { duration: 1, ease: "easeOut" }
          }}
        />

        {/* Groom's Side - Right Half */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 cursor-pointer overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #16233B 0%, #0A1220 50%, #0A1220 100%)",
          }}
          initial={{ width: "50%" }}
          animate={{
            width: hoveredSide === "groom" ? "60%" : hoveredSide === "bride" ? "40%" : "50%",
            background:
              hoveredSide === "groom"
                ? "linear-gradient(135deg, #1F2F4C 0%, #16233B 50%, #0A1220 100%)"
                : "linear-gradient(135deg, #16233B 0%, #0A1220 50%, #0A1220 100%)",
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onHoverStart={() => setHoveredSide("groom")}
          onHoverEnd={() => setHoveredSide(null)}
          onClick={() => onSelectSide("groom")}
        >
          {/* Decorative Pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M30 5 L35 20 L50 25 L35 30 L30 45 L25 30 L10 25 L25 20 Z'/%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3Ccircle cx='50' cy='10' r='3'/%3E%3Ccircle cx='10' cy='50' r='3'/%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 text-center px-6 lg:px-8"
            animate={{
              scale: hoveredSide === "groom" ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/groom.png"
              alt="Groom"
              className="w-48 h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-cover rounded-full mx-auto mb-5 border-4 border-white/20"
              animate={{
                scale: hoveredSide === "groom" ? [1, 1.1, 1] : 1,
                boxShadow: hoveredSide === "groom"
                  ? "0 0 40px rgba(245,215,122,0.5), 0 10px 40px rgba(0,0,0,0.5)"
                  : "0 0 20px rgba(245,215,122,0.3), 0 5px 20px rgba(0,0,0,0.3)"
              }}
              transition={{ duration: 0.6, repeat: hoveredSide === "groom" ? Infinity : 0 }}
            />
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold mb-3" style={{ color: "#F5D77A" }}>
              Groom's Side
            </h2>
            <div
              className="h-[1px] w-28 mx-auto my-3"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
              }}
            />
            <p className="text-base lg:text-lg tracking-wide" style={{ color: "#F5D77A" }}>
              Kaustav
            </p>
            <p className="text-xs mt-2 tracking-wider uppercase" style={{ color: "rgba(245,215,122,0.7)" }}>
              Family & Friends
            </p>
          </motion.div>
        </motion.div>

        {/* Center Shared Text - Top of Page */}
        <motion.div
          className="absolute top-8 lg:top-12 xl:top-16 left-0 right-0 z-30 text-center pointer-events-none px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.p
            className="text-xs lg:text-sm tracking-[0.4em] uppercase mb-2 lg:mb-3 font-medium"
            style={{
              color: "#F5D77A",
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to the Wedding Celebration of
          </motion.p>

          <h1
            className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-2"
            style={{
              color: "#FFFEF8",
              textShadow: "0 4px 16px rgba(0,0,0,0.9)",
            }}
          >
            Himasree{" "}
            <span style={{ color: "#D4AF37" }}>&</span>{" "}
            Kaustav
          </h1>

          <motion.div
            className="flex items-center justify-center gap-2 lg:gap-3 my-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div
              className="h-[1px] w-12 lg:w-16"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
              }}
            />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1C6 1 8 4.5 11 6C8 7.5 6 11 6 11C6 11 4 7.5 1 6C4 4.5 6 1 6 1Z" fill="#D4AF37" />
            </svg>
            <div
              className="h-[1px] w-12 lg:w-16"
              style={{
                background: "linear-gradient(to left, transparent, #D4AF37, transparent)",
              }}
            />
          </motion.div>

          <motion.p
            className="text-xs lg:text-sm tracking-wide text-white/90"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Choose your side to begin the celebration
          </motion.p>
        </motion.div>
      </div>

      {/* MOBILE: Stacked Vertical Layout (<768px) */}
      <div className="md:hidden fixed inset-0 flex flex-col"
        style={{
          background: "linear-gradient(180deg, #0F1B2E 0%, #14233C 60%, #0C1626 100%)",
        }}
      >
        {/* Top Header Text - Sticky */}
        <motion.div
          className="sticky top-0 z-30 text-center py-5 px-4"
          style={{
            background: "rgba(15,27,46,0.98)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(212,175,55,0.2)",
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-[9px] tracking-[0.35em] uppercase mb-2 font-medium"
            style={{ color: "#F5D77A" }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Welcome to the Wedding Celebration of
          </motion.p>

          <h1
            className="font-serif text-xl font-bold tracking-tight mb-1.5"
            style={{ color: "#FFFEF8" }}
          >
            Himasree{" "}
            <span style={{ color: "#D4AF37" }}>&</span>{" "}
            Kaustav
          </h1>

          <div className="flex items-center justify-center gap-2 my-2">
            <div
              className="h-[1px] w-8"
              style={{
                background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
              }}
            />
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M6 1C6 1 8 4.5 11 6C8 7.5 6 11 6 11C6 11 4 7.5 1 6C4 4.5 6 1 6 1Z" fill="#D4AF37" />
            </svg>
            <div
              className="h-[1px] w-8"
              style={{
                background: "linear-gradient(to left, transparent, #D4AF37, transparent)",
              }}
            />
          </div>

          <p className="text-[9px] tracking-wide text-white/90">
            Choose your side to begin the celebration
          </p>
        </motion.div>

        {/* Stacked Panels */}
        <div className="flex-1 flex flex-col">
          {/* Bride Panel - Top */}
          <motion.div
            className="flex-1 cursor-pointer flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #9F2A3B 0%, #8B1E2D 50%, #5E141F 100%)",
            }}
            onClick={() => onSelectSide("bride")}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Decorative Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='10' cy='10' r='4'/%3E%3Ccircle cx='50' cy='10' r='4'/%3E%3Ccircle cx='10' cy='50' r='4'/%3E%3Ccircle cx='50' cy='50' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px",
              }}
            />

            <div className="relative z-10 text-center px-6 py-6">
              <img
                src="/bride.png"
                alt="Bride"
                className="w-36 h-36 object-cover rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"
              />
              <h2 className="font-serif text-2xl font-bold text-white mb-2">
                Bride's Side
              </h2>
              <div
                className="h-[1px] w-20 mx-auto my-2"
                style={{
                  background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
                }}
              />
              <p className="text-sm text-white/90 tracking-wide">Himasree</p>
              <p className="text-[10px] text-white/70 mt-1 tracking-wider uppercase">Family & Friends</p>
            </div>
          </motion.div>

          {/* Horizontal Gold Divider */}
          <motion.div
            className="h-[2px] w-full z-20"
            style={{
              background: "linear-gradient(to right, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
              boxShadow: "0 0 15px rgba(212,175,55,0.6)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />

          {/* Groom Panel - Bottom */}
          <motion.div
            className="flex-1 cursor-pointer flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #16233B 0%, #0A1220 50%, #0A1220 100%)",
            }}
            onClick={() => onSelectSide("groom")}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Decorative Pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700' fill-opacity='0.4'%3E%3Cpath d='M30 5 L35 20 L50 25 L35 30 L30 45 L25 30 L10 25 L25 20 Z'/%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3Ccircle cx='50' cy='10' r='3'/%3E%3Ccircle cx='10' cy='50' r='3'/%3E%3Ccircle cx='50' cy='50' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px",
              }}
            />

            <div className="relative z-10 text-center px-6 py-6">
              <img
                src="/groom.png"
                alt="Groom"
                className="w-36 h-36 object-cover rounded-full mx-auto mb-4 border-4 border-white/20 shadow-lg"
              />
              <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#F5D77A" }}>
                Groom's Side
              </h2>
              <div
                className="h-[1px] w-20 mx-auto my-2"
                style={{
                  background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
                }}
              />
              <p className="text-sm tracking-wide" style={{ color: "#F5D77A" }}>
                Kaustav
              </p>
              <p className="text-[10px] mt-1 tracking-wider uppercase" style={{ color: "rgba(245,215,122,0.7)" }}>
                Family & Friends
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
