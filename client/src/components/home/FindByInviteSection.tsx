import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Loader2, User, ChevronRight, X as XIcon, Heart, Phone, Users, Check
} from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { ThinGoldDivider } from "../RoyalOrnaments";
import { apiRequest } from "@/lib/queryClient";

export default function FindByInviteSection({
  onEditRsvp,
  onSubmitDirect,
  onSearchReady
}: {
  onEditRsvp: (guest: any) => void;
  onSubmitDirect: (name: string) => void;
  onSearchReady: (searchFn: () => void, currentQuery: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);

  const handleSearch = useCallback(async () => {
    const name = query.trim();
    if (name.length < 2) return;
    setSearching(true);
    setResults(null);
    setSelectedGuest(null);
    try {
      const res = await apiRequest("GET", `/api/guests/by-name?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [query]);

  // Expose search function to parent
  useEffect(() => {
    onSearchReady(handleSearch, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSearch, query]);

  const notFound = results !== null && results.length === 0;
  const found = results !== null && results.length > 0;

  return (
    <section id="find-invite" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-alt-bg)" }} data-testid="find-invite-section">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <Search size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Check Your Invite
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Find Your Invitation
          </h2>
          <SimpleDivider />
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            Search for your name to view your personalized invitation details
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex gap-2 mb-4"
        >
          <div className="flex-1 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--wedding-accent)", opacity: 0.55 }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const newValue = e.target.value;
                setQuery(newValue);
                // Clear results when search box is cleared
                if (newValue.trim().length === 0) {
                  setResults(null);
                  setSelectedGuest(null);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter your full name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
              style={{
                background: "var(--wedding-card-bg)",
                border: "1px solid var(--wedding-border)",
                color: "var(--wedding-text)",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching || query.trim().length < 3}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl p-5 text-center"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
            >
              <User size={28} className="mx-auto mb-3" style={{ color: "var(--wedding-accent)", opacity: 0.4 }} />
              <p className="font-serif text-base font-semibold mb-1" style={{ color: "var(--wedding-text)" }}>
                We couldn't find your name
              </p>
              <p className="text-xs mb-4" style={{ color: "var(--wedding-muted)" }}>
                Don't worry! You can still RSVP directly or reach out to us.
              </p>
              <button
                onClick={() => {
                  onSubmitDirect(query.trim());
                  const el = document.getElementById("rsvp");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.replaceState(null, "", window.location.pathname);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)", border: "none", cursor: "pointer" }}
              >
                Submit RSVP Directly <ChevronRight size={11} />
              </button>
            </motion.div>
          )}

          {found && !selectedGuest && (
            <motion.div
              key="found-list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-xs text-center mb-3" style={{ color: "var(--wedding-muted)" }}>
                Found {results!.length} guest{results!.length > 1 ? "s" : ""} — tap to view &amp; edit your RSVP
              </p>
              {results!.map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => setSelectedGuest(guest)}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all hover:scale-[1.01]"
                  style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(176,132,72,0.10)", color: "var(--wedding-accent)" }}
                  >
                    <User size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--wedding-text)" }}>{guest.name}</p>
                    <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                      {guest.rsvpStatus === "confirmed" ? "✓ RSVP Confirmed" : guest.rsvpStatus === "declined" ? "✗ Declined" : "RSVP Pending"}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--wedding-accent)", opacity: 0.8 }}>
                      Tap to view &amp; edit RSVP →
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--wedding-accent)", opacity: 0.5 }} />
                </button>
              ))}
            </motion.div>
          )}

          {selectedGuest && (
            <motion.div
              key="guest-detail"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="rounded-2xl overflow-hidden relative"
              style={{ background: "var(--wedding-card-bg)", border: "2px solid var(--wedding-accent)", boxShadow: "0 8px 40px rgba(176,132,72,0.18)" }}
            >
              {/* Gold top bar */}
              <div className="h-[4px]" style={{
                background: "linear-gradient(90deg, transparent, var(--wedding-accent) 40%, var(--wedding-accent) 60%, transparent)"
              }} />

              {/* Back / close corner button */}
              <button
                onClick={() => setSelectedGuest(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
                style={{ background: "rgba(176,132,72,0.12)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
                aria-label="Back to results"
              >
                <XIcon size={13} />
              </button>

              <div className="p-6 sm:p-8 text-center">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                >
                  <Heart size={28} style={{ color: "var(--wedding-accent)" }} />
                </div>

                <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: "var(--wedding-accent)", opacity: 0.7 }}>
                  You're on the list!
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-tight" style={{ color: "var(--wedding-text)" }}>
                  Hello, {selectedGuest.name.split(" ")[0]}!
                </h3>

                <ThinGoldDivider className="mb-4" />

                <p className="text-sm leading-[1.75] mb-5" style={{ color: "var(--wedding-muted)" }}>
                  We can't wait to celebrate with you at our wedding.{" "}
                  {selectedGuest.rsvpStatus === "confirmed"
                    ? "Your RSVP is confirmed — we're so excited to see you!"
                    : selectedGuest.rsvpStatus === "declined"
                    ? "We see you've declined, but you're always welcome to reach out."
                    : "Your invite is ready — please complete your RSVP below."}
                </p>

                {/* Guest details card */}
                <div
                  className="rounded-xl px-4 py-4 mb-5 text-left space-y-2"
                  style={{ background: "rgba(176,132,72,0.05)", border: "1px solid var(--wedding-border)" }}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <User size={12} style={{ color: "var(--wedding-accent)" }} />
                    <span style={{ color: "var(--wedding-muted)" }}>{selectedGuest.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Users size={12} style={{ color: "var(--wedding-accent)" }} />
                    <span style={{ color: "var(--wedding-muted)" }}>
                      {selectedGuest.adultsCount ?? 1} Adult{(selectedGuest.adultsCount ?? 1) > 1 ? "s" : ""}
                      {selectedGuest.childrenCount > 0 ? `, ${selectedGuest.childrenCount} Child${selectedGuest.childrenCount > 1 ? "ren" : ""}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs">
                    <Check size={12} style={{ color: selectedGuest.rsvpStatus === "confirmed" ? "#22c55e" : "var(--wedding-accent)" }} />
                    <span className="capitalize" style={{ color: selectedGuest.rsvpStatus === "confirmed" ? "#22c55e" : "var(--wedding-muted)" }}>
                      {selectedGuest.rsvpStatus === "confirmed" ? "RSVP Confirmed" : selectedGuest.rsvpStatus === "declined" ? "Declined" : "RSVP Pending"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onEditRsvp(selectedGuest)}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all mb-2"
                  style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)", border: "none" }}
                >
                  Edit My RSVP
                </button>
                <button
                  onClick={() => { setSelectedGuest(null); setQuery(""); setResults(null); }}
                  className="w-full py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "transparent", color: "var(--wedding-muted)", border: "1px solid var(--wedding-border)" }}
                >
                  Search for Another Guest
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom contact links */}
        <motion.div
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>Can't find your name?</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
            >
              <Phone size={11} /> Contact Kaustav (Groom Side)
            </a>
            <a
              href="tel:+919876543211"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
            >
              <Phone size={11} /> Contact Himasree (Bride Side)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
