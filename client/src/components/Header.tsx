import { useWeddingTheme } from "@/context/ThemeContext";
import { Link, useLocation } from "wouter";

export default function Header() {
  const { side } = useWeddingTheme();
  const [location] = useLocation();

  const isAdmin = location.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        background: "rgba(26, 15, 10, 0.95)",
        borderColor: "var(--wedding-border)",
      }}
      data-testid="header"
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" data-testid="header-logo">
          <span
            className="font-serif text-lg font-semibold tracking-wider cursor-pointer"
            style={{ color: "var(--wedding-accent)" }}
          >
            K & H
          </span>
        </Link>

        <nav className="flex items-center gap-6" data-testid="header-nav">
          {["story", "events", "venue", "rsvp", "shagun", "faqs"].map((section) => (
            <a
              key={section}
              href={`/#${section}`}
              className="text-xs tracking-[0.15em] uppercase transition-colors hover:opacity-80 hidden sm:block"
              style={{ color: "var(--wedding-text)" }}
              data-testid={`nav-${section}`}
            >
              {section === "faqs" ? "FAQ" : section}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
