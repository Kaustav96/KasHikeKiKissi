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
      {/* Glassmorphism block */}
      <div
        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(185,151,91,0.25)",
          boxShadow: "0 4px 20px rgba(185,151,91,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
        data-testid={`countdown-${label}`}
      >
        {/* Subtle top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(185,151,91,0.5), transparent)" }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={display}
            className="font-serif text-2xl sm:text-3xl font-bold tabular-nums"
            style={{ color: "var(--wedding-accent)" }}
            initial={{ y: animating ? -8 : 0, opacity: animating ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium"
        style={{ color: "var(--wedding-muted)" }}
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
      className="flex gap-3 sm:gap-5 justify-center"
      data-testid="countdown-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <CountdownUnit value={timeLeft.days} label="days" />
      <CountdownUnit value={timeLeft.hours} label="hours" />
      <CountdownUnit value={timeLeft.minutes} label="mins" />
      <CountdownUnit value={timeLeft.seconds} label="secs" />
    </motion.div>
  );
}
