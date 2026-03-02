import { useWeddingTheme } from "@/context/ThemeContext";
import { useState } from "react";

interface ViewingSideOverlayProps {
  onBackToSelection: () => void;
  onSideChange: (side: "groom" | "bride") => void;
}

export default function ViewingSideOverlay({ onBackToSelection, onSideChange }: ViewingSideOverlayProps) {
  const { side } = useWeddingTheme();
  const [isHovered, setIsHovered] = useState(false);

  const accentColor = "var(--wedding-accent)";
  const textColor = "var(--wedding-text)";
  const mutedColor = "var(--wedding-muted)";
  const otherSide = side === "groom" ? "bride" : "groom";

  return (
    <div
      className="fixed bottom-4 left-3 sm:bottom-6 sm:left-6 z-[60] touch-manipulation"
      data-testid="viewing-side-overlay"
    >
      <div
        className="flex flex-col gap-1.5 sm:gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-lg border transition-all duration-300"
        style={{
          background: "var(--wedding-card-bg)",
          borderColor: accentColor,
          minWidth: isHovered ? "180px" : "160px",
          pointerEvents: "auto",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
      >
        {/* Viewing Label */}
        <span className="text-[9px] sm:text-[10px] tracking-wider uppercase" style={{ color: mutedColor }}>
          Viewing As:
        </span>

        {/* Selected Side */}
        <div className="flex items-center justify-between">
          <span
            className="text-sm sm:text-base font-bold capitalize"
            style={{ color: accentColor }}
          >
            {side === "groom" ? "Groom" : "Bride"} Side
          </span>
        </div>

        {/* Hover Options */}
        {isHovered && (
          <div className="pt-1.5 sm:pt-2 border-t space-y-1.5 sm:space-y-2" style={{ borderColor: "var(--wedding-border)" }}>
            <button
              onClick={() => onSideChange(otherSide)}
              className="w-full text-left text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: "var(--wedding-secondary)",
                color: textColor
              }}
              data-testid={`switch-to-${otherSide}`}
            >
              Switch to {otherSide === "groom" ? "Groom" : "Bride"} Side
            </button>
            <button
              onClick={onBackToSelection}
              className="w-full text-[10px] sm:text-xs px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all hover:opacity-80"
              style={{
                background: "transparent",
                border: `2px solid ${accentColor}`,
                color: accentColor
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
