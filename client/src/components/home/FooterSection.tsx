import { Heart } from "lucide-react";

export default function FooterSection() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "var(--wedding-bg)" }}
      data-testid="footer"
    >
      {/* Top gold line */}
      <div className="h-px" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--wedding-accent) 50%, transparent 100%)",
        opacity: 0.35
      }} />

      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Golden heart icon */}
        <div className="flex justify-center mb-5">
          <Heart
            size={32}
            fill="var(--wedding-accent)"
            style={{ color: "var(--wedding-accent)", filter: "drop-shadow(0 2px 8px rgba(176,132,72,0.35))" }}
          />
        </div>

        {/* Names */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mb-2" style={{ color: "var(--wedding-accent)" }}>
          Himasree &amp; Kaustav
        </h3>

        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "var(--wedding-muted)", opacity: 0.7 }}>
          December 2026 &middot; Kolkata
        </p>

        <p className="text-xs leading-relaxed mb-6 italic" style={{ color: "var(--wedding-muted)", opacity: 0.65 }}>
          Two hearts, one journey &mdash; forever begins here
        </p>

        <div className="h-px mx-auto max-w-[80px] mb-6" style={{ background: "linear-gradient(90deg, transparent, var(--wedding-accent), transparent)" }} />

        <p className="text-[11px] tracking-widest uppercase" style={{ color: "var(--wedding-muted)", opacity: 0.5 }}>
          Crafted with love &amp; blessed by family &middot; © 2026
        </p>
      </div>
    </footer>
  );
}
