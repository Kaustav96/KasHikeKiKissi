import { motion } from "framer-motion";
import KHCrest from "./KHCrest";

interface SideSelectionLandingProps {
  onSelectSide: (side: "groom" | "bride") => void;
}

export default function SideSelectionLanding({ onSelectSide }: SideSelectionLandingProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0F0805 0%, #1A0F0A 50%, #0F0805 100%)",
      }}
    >
      {/* Decorative Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-12 z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <KHCrest size={80} />

          <motion.p
            className="mt-8 text-sm tracking-[0.3em] uppercase mb-3"
            style={{ color: "#C19A6B" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The Sacred Union of
          </motion.p>

          <motion.h1
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-2"
            style={{ color: "#F5E6D3" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            Himasree
          </motion.h1>

          <motion.div
            className="flex items-center justify-center gap-4 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="font-serif text-3xl italic" style={{ color: "#D4AF37" }}>&amp;</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </motion.div>

          <motion.h1
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold"
            style={{ color: "#F5E6D3" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
          >
            Kaustav
          </motion.h1>
        </motion.div>

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <h2
            className="font-serif text-2xl sm:text-3xl mb-3"
            style={{ color: "#F5E6D3" }}
          >
            Please Select Your Side
          </h2>
          <p className="text-sm tracking-wide" style={{ color: "#C19A6B" }}>
            Choose to continue as groom's guest or bride's guest
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Groom Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => onSelectSide("groom")}
              className="w-full p-8 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl group"
              style={{
                background: "linear-gradient(135deg, #1A0F0A 0%, #2C1810 100%)",
                borderColor: "#D4AF37",
              }}
            >
              <div className="text-center">
                <div className="mb-6">
                  <span className="text-6xl">🤵</span>
                </div>
                <h3
                  className="font-serif text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: "#F5E6D3" }}
                >
                  Ladke Wale
                </h3>
                <p className="text-sm mb-6" style={{ color: "#C19A6B" }}>
                  Groom's Family & Friends
                </p>
                <div
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-[#1A0F0A] transition-all group-hover:gap-4"
                  style={{ background: "#D4AF37" }}
                >
                  Enter as Groom's Guest
                  <span>→</span>
                </div>
              </div>
            </button>
          </motion.div>

          {/* Bride Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => onSelectSide("bride")}
              className="w-full p-8 rounded-2xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl group"
              style={{
                background: "linear-gradient(135deg, #1C0A0E 0%, #2D1319 100%)",
                borderColor: "#E8B4A0",
              }}
            >
              <div className="text-center">
                <div className="mb-6">
                  <span className="text-6xl">👰</span>
                </div>
                <h3
                  className="font-serif text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: "#FFE5E5" }}
                >
                  Ladki Wale
                </h3>
                <p className="text-sm mb-6" style={{ color: "#C97B84" }}>
                  Bride's Family & Friends
                </p>
                <div
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-[#1C0A0E] transition-all group-hover:gap-4"
                  style={{ background: "#E8B4A0" }}
                >
                  Enter as Bride's Guest
                  <span>→</span>
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        <motion.p
          className="text-center mt-12 text-xs tracking-wide"
          style={{ color: "#C19A6B" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          This selection will customize your experience
        </motion.p>
      </div>
    </div>
  );
}
