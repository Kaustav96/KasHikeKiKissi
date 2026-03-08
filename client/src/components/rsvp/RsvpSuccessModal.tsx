import { motion, AnimatePresence } from "framer-motion";
import KHCrest from "@/components/KHCrest";
import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  status: "confirmed" | "declined" | null;
  onClose: () => void;
}

export default function RsvpSuccessModal({ open, status, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-md w-[92%] rounded-2xl p-8 text-center"
            style={{
              background: "var(--wedding-card-bg)",
              border: "2px solid var(--wedding-accent)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.25)",
            }}
            initial={{ scale: 0.85, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating sparkles */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={28} color="var(--wedding-accent)" />
            </motion.div>

            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none rounded-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  background: "var(--wedding-accent)",
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  boxShadow: "0 0 8px var(--wedding-accent)",
                }}
                animate={{
                  y: [-10, -30],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}

            <div className="flex justify-center mb-4 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <KHCrest size={70} />
              </motion.div>
            </div>

            <motion.h2
              className="font-serif text-2xl mb-2 relative z-10"
              style={{ color: "var(--wedding-text)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {status === "confirmed"
                ? "Your Presence Means Everything"
                : "Thank You For Letting Us Know"}
            </motion.h2>

            <motion.p
              className="text-sm leading-relaxed mb-6 relative z-10"
              style={{ color: "var(--wedding-muted)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {status === "confirmed"
                ? "We are delighted to celebrate this beautiful day with you."
                : "We will miss you, but your blessings mean the world to us."}
            </motion.p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--wedding-accent)] to-transparent" />
              <span className="text-[var(--wedding-accent)] text-xs">✦</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-[var(--wedding-accent)] to-transparent" />
            </div>

            <motion.button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all relative z-10 hover:shadow-lg"
              style={{
                background: "var(--wedding-accent)",
                color: "var(--wedding-bg)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

