// Royal ornamental decorative components for luxury wedding theme

export function MandalaHalfOrnament({ className = "", side = "left" }: { className?: string; side?: "left" | "right" }) {
  const transform = side === "right" ? "scale(-1, 1)" : "";

  return (
    <svg
      className={className}
      viewBox="0 0 200 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform }}
    >
      <defs>
        <radialGradient id="mandalaGrad" cx="0%" cy="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#B8860B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.05" />
        </radialGradient>
      </defs>

      {/* Outer radiating petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = 0;
        const y1 = 200;
        const x2 = Math.cos(rad) * 180;
        const y2 = 200 + Math.sin(rad) * 180;

        return (
          <g key={i}>
            <path
              d={`M ${x1} ${y1} Q ${x2 * 0.3} ${y2 * 0.8} ${x2} ${y2}`}
              stroke="url(#mandalaGrad)"
              strokeWidth="0.5"
              fill="none"
            />
            <circle
              cx={x2 * 0.6}
              cy={200 + Math.sin(rad) * 180 * 0.6}
              r="2"
              fill="#D4AF37"
              opacity="0.2"
            />
          </g>
        );
      })}

      {/* Middle layer circles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) - 90;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 120;
        const y = 200 + Math.sin(rad) * 120;

        return (
          <circle
            key={`mid-${i}`}
            cx={x}
            cy={y}
            r="8"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}

      {/* Inner decorative arcs */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5) - 90;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 60;
        const y = 200 + Math.sin(rad) * 60;

        return (
          <path
            key={`inner-${i}`}
            d={`M ${x * 0.7} ${y * 0.95} Q ${x * 0.85} ${y * 0.85} ${x} ${y}`}
            stroke="#D4AF37"
            strokeWidth="0.3"
            fill="none"
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
}

export function GoldMedallion({ className = "", size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#D4AF37" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#B8860B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="60" cy="60" r="55" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.3" />
      <circle cx="60" cy="60" r="52" fill="none" stroke="#D4AF37" strokeWidth="0.3" opacity="0.4" />

      {/* Decorative dots around outer ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15) * Math.PI / 180;
        const x = 60 + Math.cos(angle) * 53.5;
        const y = 60 + Math.sin(angle) * 53.5;
        return <circle key={i} cx={x} cy={y} r="0.8" fill="#D4AF37" opacity="0.4" />;
      })}

      {/* Middle ornamental layer */}
      <circle cx="60" cy="60" r="45" fill="url(#goldGrad)" />
      <circle cx="60" cy="60" r="45" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />

      {/* Inner petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30) * Math.PI / 180;
        const x1 = 60 + Math.cos(angle) * 25;
        const y1 = 60 + Math.sin(angle) * 25;
        const x2 = 60 + Math.cos(angle) * 35;
        const y2 = 60 + Math.sin(angle) * 35;

        return (
          <g key={`petal-${i}`}>
            <path
              d={`M ${x1} ${y1} Q 60 60 ${x2} ${y2}`}
              stroke="#D4AF37"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
            <circle cx={x2} cy={y2} r="2" fill="#D4AF37" opacity="0.25" />
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx="60" cy="60" r="20" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
      <circle cx="60" cy="60" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />

      {/* Center star pattern */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const x = 60 + Math.cos(angle) * 8;
        const y = 60 + Math.sin(angle) * 8;
        return (
          <line
            key={`star-${i}`}
            x1="60"
            y1="60"
            x2={x}
            y2={y}
            stroke="#D4AF37"
            strokeWidth="0.5"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}

export function CornerOrnament({ className = "", position = "top-left" }: { className?: string; position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const rotation = {
    "top-left": "0",
    "top-right": "90",
    "bottom-right": "180",
    "bottom-left": "270"
  }[position];

  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Corner flourish */}
      <path
        d="M 0 0 L 0 25 Q 0 15 10 15 L 25 15 Q 20 15 20 10 L 20 0"
        stroke="#D4AF37"
        strokeWidth="0.5"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 0 0 L 0 35 Q 0 22 15 22 L 35 22 Q 28 22 28 15 L 28 0"
        stroke="#D4AF37"
        strokeWidth="0.3"
        fill="none"
        opacity="0.3"
      />

      {/* Decorative dots */}
      <circle cx="15" cy="15" r="1.5" fill="#D4AF37" opacity="0.4" />
      <circle cx="25" cy="25" r="1" fill="#D4AF37" opacity="0.3" />
      <circle cx="8" cy="8" r="1" fill="#D4AF37" opacity="0.4" />

      {/* Small curves */}
      <path d="M 5 0 Q 5 5 10 5" stroke="#D4AF37" strokeWidth="0.3" fill="none" opacity="0.3" />
      <path d="M 0 5 Q 5 5 5 10" stroke="#D4AF37" strokeWidth="0.3" fill="none" opacity="0.3" />
    </svg>
  );
}

export function ThinGoldDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#D4AF37] opacity-30" />
      <div className="flex gap-1">
        <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-40" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] opacity-50" />
        <div className="w-1 h-1 rounded-full bg-[#D4AF37] opacity-40" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#D4AF37] opacity-30" />
    </div>
  );
}

export function RoyalFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner ornaments */}
      <div className="absolute -top-2 -left-2 pointer-events-none z-10">
        <CornerOrnament position="top-left" />
      </div>
      <div className="absolute -top-2 -right-2 pointer-events-none z-10">
        <CornerOrnament position="top-right" />
      </div>
      <div className="absolute -bottom-2 -left-2 pointer-events-none z-10">
        <CornerOrnament position="bottom-left" />
      </div>
      <div className="absolute -bottom-2 -right-2 pointer-events-none z-10">
        <CornerOrnament position="bottom-right" />
      </div>

      {/* Frame borders */}
      <div className="absolute inset-0 border border-[#D4AF37] opacity-20 pointer-events-none" />
      <div className="absolute inset-[3px] border border-[#D4AF37] opacity-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}
