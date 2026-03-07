import { useState } from "react";

export default function HeroBokeh() {
  const [petals] = useState(() =>
    Array.from({ length: 500 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 6,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Soft accent glow - adapts to theme */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[180px] -top-40 left-1/2 -translate-x-1/2"
        style={{
          background: 'var(--wedding-accent)',
          opacity: 0.08
        }}
      ></div>

      {/* Floating petals */}
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
          }}
        />
      ))}
    </div>
  );
}