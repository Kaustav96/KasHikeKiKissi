import { useWeddingTheme } from "@/context/ThemeContext";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    // Remove hash from URL without adding to history
    window.history.replaceState(null, "", window.location.pathname);
  }
}

export default function Header() {
  const { side } = useWeddingTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Simple logic: hide at top (0-80px), show and stick when scrolled past 80px
      if (currentScrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = location.startsWith("/admin");
  if (isAdmin) return null;

  const sections = [
    { id: "find-invite", label: "Find Invite" },
    { id: "events", label: "Events" },
    { id: "venue", label: "Venue" },
    { id: "wardrobe", label: "Wardrobe" },
    { id: "story", label: "Our Story" },
    { id: "rsvp", label: "RSVP" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: scrolled ? "var(--wedding-card-bg)" : "rgba(255,255,255,0.7)",
        borderColor: scrolled ? "var(--wedding-border)" : "rgba(176,132,72,0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: scrolled ? "0 2px 20px rgba(46,43,39,0.07)" : "none",
        opacity: scrolled ? 1 : 0,
        transform: scrolled ? "translateY(0)" : "translateY(-100%)",
        pointerEvents: scrolled ? "auto" : "none",
        transition: "all 0.3s ease",
      }}
      data-testid="header"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => window.history.replaceState(null, "", "/")}
          data-testid="header-logo"
        >
          <span
            className="font-serif text-base sm:text-lg font-semibold tracking-wider cursor-pointer"
            style={{ color: "var(--wedding-accent)" }}
          >
            H & K
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5" data-testid="header-nav">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className="text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: "var(--wedding-text)", background: "none", border: "none", padding: 0 }}
              data-testid={`nav-${id}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-button"
        >
          {mobileMenuOpen ? (
            <X size={20} style={{ color: "var(--wedding-accent)" }} />
          ) : (
            <Menu size={20} style={{ color: "var(--wedding-accent)" }} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-t"
          style={{
            background: "var(--wedding-card-bg)",
            borderColor: "var(--wedding-border)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "0 8px 24px rgba(46,43,39,0.10)",
          }}
          data-testid="mobile-menu"
        >
          <div className="px-4 py-3 space-y-1">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className="flex items-center gap-3 text-xs tracking-[0.18em] uppercase py-3 px-2 rounded-lg w-full text-left transition-colors border-b"
                style={{
                  color: "var(--wedding-text)",
                  borderColor: "var(--wedding-border)",
                  background: "none",
                }}
                data-testid={`mobile-nav-${id}`}
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: "var(--wedding-accent)" }}
                />
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

