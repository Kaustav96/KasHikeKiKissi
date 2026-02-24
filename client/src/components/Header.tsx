import { Volume2, VolumeX } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { useWeddingTheme } from "@/context/ThemeContext";
import { Link, useLocation } from "wouter";

export default function Header() {
  const { side, setSide } = useWeddingTheme();
  const { isPlaying, isMuted, toggleMute } = useMusic();
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");
  if (isAdmin) return null;

  const accentColor = side === "groom" ? "#B9975B" : "#8B0000";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: side === "groom"
          ? "rgba(239,230,216,0.92)"
          : "rgba(248,241,231,0.92)",
        borderColor: `var(--wedding-border)`,
      }}
      data-testid="header"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" data-testid="header-logo">
          <span
            className="font-serif text-lg font-semibold tracking-wider cursor-pointer"
            style={{ color: accentColor }}
          >
            K & H
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6" data-testid="header-nav">
          {["story", "events", "venue", "rsvp", "shagun", "faqs"].map((section) => (
            <a
              key={section}
              href={`/#${section}`}
              className="text-xs tracking-[0.15em] uppercase transition-colors hover:opacity-80"
              style={{ color: "var(--wedding-text)" }}
              data-testid={`nav-${section}`}
            >
              {section === "faqs" ? "FAQ" : section}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex rounded-full p-0.5 text-xs"
            style={{ border: `1px solid var(--wedding-border)` }}
            data-testid="theme-toggle"
          >
            <button
              className="px-3 py-1 rounded-full transition-all text-xs tracking-wide"
              style={{
                background: side === "groom" ? accentColor : "transparent",
                color: side === "groom" ? "#fff" : "var(--wedding-text)",
              }}
              onClick={() => setSide("groom")}
              data-testid="toggle-groom"
            >
              Groom
            </button>
            <button
              className="px-3 py-1 rounded-full transition-all text-xs tracking-wide"
              style={{
                background: side === "bride" ? accentColor : "transparent",
                color: side === "bride" ? "#fff" : "var(--wedding-text)",
              }}
              onClick={() => setSide("bride")}
              data-testid="toggle-bride"
            >
              Bride
            </button>
          </div>

          {isPlaying && (
            <button
              onClick={toggleMute}
              className="p-2 rounded-full transition-colors hover:opacity-80"
              style={{ color: accentColor }}
              data-testid="mute-toggle"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
