import { motion } from "framer-motion";
import { useEffect } from "react";

interface DoorOpeningAnimationProps {
  onComplete: () => void;
}

export default function DoorOpeningAnimation({ onComplete }: DoorOpeningAnimationProps) {
  useEffect(() => {
    // Complete animation after doors fully open
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Left Door */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2"
        style={{
          background: "linear-gradient(135deg, #9F2A3B 0%, #8B1E2D 50%, #5E141F 100%)",
          boxShadow: "4px 0 30px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.8, delay: 0, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gold edge highlight */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1"
          style={{
            background: "linear-gradient(to bottom, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
          }}
        />
      </motion.div>

      {/* Right Door */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2"
        style={{
          background: "linear-gradient(135deg, #16233B 0%, #0A1220 50%, #0A1220 100%)",
          boxShadow: "-4px 0 30px rgba(0,0,0,0.5)",
        }}
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gold edge highlight */}
        <div
          className="absolute top-0 bottom-0 left-0 w-1"
          style={{
            background: "linear-gradient(to bottom, transparent, #D4AF37 20%, #D4AF37 80%, transparent)",
          }}
        />
      </motion.div>

      {/* Golden sparkle burst in center */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div
          className="w-40 h-40 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,215,0,0.8) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </div>
  );
}

