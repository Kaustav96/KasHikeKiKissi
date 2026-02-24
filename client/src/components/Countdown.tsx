import { useEffect, useState } from "react";

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
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center"
        data-testid={`countdown-${label}`}
      >
        <span className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-white/70 text-xs uppercase tracking-widest font-sans">{label}</span>
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
      <p className="text-white/80 font-serif text-lg italic" data-testid="countdown-past">
        We are married! Thank you for celebrating with us.
      </p>
    );
  }

  return (
    <div className="flex gap-3 sm:gap-4 justify-center" data-testid="countdown-container">
      <CountdownUnit value={timeLeft.days} label="days" />
      <CountdownUnit value={timeLeft.hours} label="hours" />
      <CountdownUnit value={timeLeft.minutes} label="mins" />
      <CountdownUnit value={timeLeft.seconds} label="secs" />
    </div>
  );
}
