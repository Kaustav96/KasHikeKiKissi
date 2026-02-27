import { useWeddingTheme } from "@/context/ThemeContext";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { side } = useWeddingTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = location.startsWith("/admin");
  if (isAdmin) return null;

  const sections = ["story", "events", "venue", "rsvp", "wardrobe", "faqs"];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "rgba(26, 15, 10, 0.95)",
        borderColor: "var(--wedding-border)",
      }}
      data-testid="header"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => window.history.replaceState(null, '', '/')}
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
        <nav className="hidden md:flex items-center gap-4 lg:gap-6" data-testid="header-nav">
          {sections.map((section) => (
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
          className="md:hidden border-t shadow-lg"
          style={{
            background: "rgba(26, 15, 10, 0.98)",
            borderColor: "var(--wedding-border)",
          }}
          data-testid="mobile-menu"
        >
          <div className="px-4 py-3 space-y-3">
            {sections.map((section) => (
              <a
                key={section}
                href={`/#${section}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm tracking-[0.15em] uppercase transition-colors hover:opacity-80 py-2"
                style={{ color: "var(--wedding-text)" }}
                data-testid={`mobile-nav-${section}`}
              >
                {section === "faqs" ? "FAQ" : section}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
