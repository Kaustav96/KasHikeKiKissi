import { useWeddingTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";

interface ViewingSideOverlayProps {
  onBackToSelection: () => void;
  onSideChange: (side: "groom" | "bride") => void;
}

export default function ViewingSideOverlay({ onBackToSelection, onSideChange }: ViewingSideOverlayProps) {
  const { side } = useWeddingTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const accentColor = "var(--wedding-accent)";
  const textColor = "var(--wedding-text)";
  const mutedColor = "var(--wedding-muted)";
  const otherSide = side === "groom" ? "bride" : "groom";

  // Close when clicking/tapping outside
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[60] touch-manipulation"
      data-testid="viewing-side-overlay"
    >
      <div
        className="flex flex-col gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg border transition-all duration-300"
        style={{
          background: "var(--wedding-card-bg)",
          borderColor: accentColor,
          minWidth: "170px",
          pointerEvents: "auto",
          overflow: "hidden",
        }}
      >
        {/* Toggle button — tap/click to open */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex flex-col gap-1 px-3 py-2.5 sm:px-4 sm:py-3 w-full text-left"
        >
          <span className="text-[9px] sm:text-[10px] tracking-wider uppercase" style={{ color: mutedColor }}>
            Viewing As:
          </span>
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-sm sm:text-base font-bold capitalize"
              style={{ color: accentColor }}
            >
              {side === "groom" ? "Groom" : "Bride"} Side
            </span>
            {/* Chevron indicator */}
            <svg
              width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{
                color: accentColor,
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
                flexShrink: 0,
              }}
            >
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Expandable options */}
        {isOpen && (
          <div
            className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 border-t space-y-1.5 sm:space-y-2"
            style={{ borderColor: "var(--wedding-border)" }}
          >
            <button
              onClick={() => { onSideChange(otherSide); setIsOpen(false); }}
              className="w-full text-left text-xs sm:text-sm px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all active:opacity-70"
              style={{
                background: "var(--wedding-secondary)",
                color: textColor,
              }}
              data-testid={`switch-to-${otherSide}`}
            >
              Switch to {otherSide === "groom" ? "Groom" : "Bride"} Side
            </button>
            <button
              onClick={() => { setIsOpen(false); onBackToSelection(); }}
              className="w-full text-[10px] sm:text-xs px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-all active:opacity-70"
              style={{
                background: "transparent",
                border: `2px solid ${accentColor}`,
                color: accentColor,
              }}
              data-testid="back-to-selection"
            >
              ← Back to Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
