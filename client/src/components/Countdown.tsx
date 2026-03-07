import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

interface CountdownProps {
  targetDate: Date;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const prevValue = useRef(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  const display = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2.5">
      {/* Luxurious glassmorphism block */}
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "2px solid rgba(var(--wedding-accent-rgb), 0.4)",
          boxShadow: "0 8px 32px rgba(var(--wedding-accent-rgb), 0.25), 0 2px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.9)",
        }}
        data-testid={`countdown-${label}`}
        animate={{
          boxShadow: [
            "0 8px 32px rgba(var(--wedding-accent-rgb), 0.25), 0 2px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.9)",
            "0 8px 32px rgba(var(--wedding-accent-rgb), 0.45), 0 2px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.9)",
            "0 8px 32px rgba(var(--wedding-accent-rgb), 0.25), 0 2px 8px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.9)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Animated corner ornaments */}
        <motion.div
          className="absolute top-1 left-1 w-3 h-3 sm:w-4 sm:h-4"
          style={{
            borderTop: "2px solid var(--wedding-accent)",
            borderLeft: "2px solid var(--wedding-accent)",
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4"
          style={{
            borderTop: "2px solid var(--wedding-accent)",
            borderRight: "2px solid var(--wedding-accent)",
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-1 left-1 w-3 h-3 sm:w-4 sm:h-4"
          style={{
            borderBottom: "2px solid var(--wedding-accent)",
            borderLeft: "2px solid var(--wedding-accent)",
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4"
          style={{
            borderBottom: "2px solid var(--wedding-accent)",
            borderRight: "2px solid var(--wedding-accent)",
            opacity: 0.5,
          }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />

        {/* Animated shimmer line - top */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(var(--wedding-accent-rgb), 0.8), transparent)" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Radial glow behind number */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(var(--wedding-accent-rgb), 0.15) 0%, transparent 65%)",
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.span
            key={display}
            className="font-serif text-2xl sm:text-4xl font-bold tabular-nums relative z-10"
            style={{
              color: "var(--wedding-accent)",
              textShadow: "0 2px 12px rgba(var(--wedding-accent-rgb), 0.4), 0 0 20px rgba(var(--wedding-accent-rgb), 0.2)",
            }}
            initial={{ y: animating ? -12 : 0, opacity: animating ? 0 : 1, scale: animating ? 0.8 : 1 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{ y: 12, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </motion.div>
      <span
        className="text-xs sm:text-sm uppercase tracking-[0.3em] font-semibold"
        style={{ color: "var(--wedding-text)", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const isPast = targetDate.getTime() <= Date.now();

  if (isPast) {
    return (
      <motion.p
        className="font-serif text-lg italic"
        style={{ color: "var(--wedding-accent)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        data-testid="countdown-past"
      >
        We are married! Thank you for celebrating with us.
      </motion.p>
    );
  }

  return (
    <motion.div
      className="flex gap-4 sm:gap-6 justify-center items-center"
      data-testid="countdown-container"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      <CountdownUnit value={timeLeft.days} label="days" />

      {/* Decorative separator */}
      <motion.div
        className="flex flex-col gap-1.5"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
      </motion.div>

      <CountdownUnit value={timeLeft.hours} label="hours" />

      {/* Decorative separator */}
      <motion.div
        className="flex flex-col gap-1.5"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
      </motion.div>

      <CountdownUnit value={timeLeft.minutes} label="mins" />

      {/* Decorative separator */}
      <motion.div
        className="flex flex-col gap-1.5"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
        <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-accent)" }} />
      </motion.div>

      <CountdownUnit value={timeLeft.seconds} label="secs" />
    </motion.div>
  );
}
