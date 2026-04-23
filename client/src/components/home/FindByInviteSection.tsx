import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Loader2, User, ChevronRight, X as XIcon, Heart, Phone, Users, Check, Sparkles
} from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { ThinGoldDivider } from "../RoyalOrnaments";
import { apiRequest } from "@/lib/queryClient";
import { ANIMATION_CONSTANTS } from "@/lib/animations";

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
  const [clearingGuest, setClearingGuest] = useState(false);

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
        const guests = Array.isArray(data) ? data : [];
        setResults(guests);
        // Auto-select if exactly one result (skip duplicate found-list state)
        if (guests.length === 1) {
          setSelectedGuest(guests[0]);
        }
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

  const handleContinueToRsvp = () => {
    onSubmitDirect(query.trim());
    const el = document.getElementById("rsvp");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <section id="find-invite" className="py-24 md:py-32 px-4 sm:px-8 relative" style={{ background: "var(--wedding-alt-bg)" }} data-testid="find-invite-section">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-lg mx-auto relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
            whileHover={{ scale: 1.05, rotate: 6 }}
          >
            <Heart size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Your Invitation
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            You're Warmly Invited
          </h2>
          <SimpleDivider />
          <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            Search your name to view your personalized details, or simply continue to RSVP
          </p>
        </motion.div>

        {/* Search input — visually secondary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative flex gap-2 mb-2"
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
                if (newValue.trim().length === 0) {
                  setResults(null);
                  setSelectedGuest(null);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter your full name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
              style={{
                background: "var(--wedding-card-bg)",
                border: "1px solid var(--wedding-border)",
                color: "var(--wedding-text)",
              }}
            />
          </div>
          {/* Search button — outlined/secondary style */}
          <motion.button
            onClick={handleSearch}
            disabled={searching || query.trim().length < 3}
            className="px-4 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-40"
            style={{ background: "var(--wedding-card-bg)", color: "var(--wedding-accent)", border: "1px solid var(--wedding-border)" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {searching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
            Search
          </motion.button>
        </motion.div>

        {/* Cleaner helper text */}
        <p className="text-[10px] text-center mb-5" style={{ color: "var(--wedding-muted)", opacity: 0.55 }}>
          Find your name for personalized details (optional)
        </p>

        {/* Results */}
        <AnimatePresence mode="wait">
          {/* Refined not-found copy */}
          {notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl px-4 py-3 mb-4 text-center"
              style={{ background: "rgba(176,132,72,0.06)", border: "1px solid var(--wedding-border)" }}
            >
              <p className="text-sm mb-0.5" style={{ color: "var(--wedding-text)" }}>
                We couldn't find an exact match — no worries 💛
              </p>
              <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                Try your full name as it appears on your invitation, or continue to RSVP below.
              </p>
            </motion.div>
          )}

          {/* Multi-result list — only when >1 match (single auto-opens detail) */}
          {found && !selectedGuest && results!.length > 1 && (
            <motion.div
              key="found-list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-2 mb-4"
            >
              <p className="text-xs text-center mb-3" style={{ color: "var(--wedding-muted)" }}>
                We found {results!.length} guests — please select yours
              </p>
              {results!.map((guest) => (
                <motion.button
                  key={guest.id}
                  onClick={() => setSelectedGuest(guest)}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:shadow-lg"
                  style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(176,132,72,0.10)", color: "var(--wedding-accent)" }}
                  >
                    <User size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--wedding-text)" }}>{guest.name}</p>
                    <p className="text-[10px]" style={{ color: "var(--wedding-accent)", opacity: 0.8 }}>
                      Tap to view your invitation →
                    </p>
                  </div>
                  <ChevronRight size={13} style={{ color: "var(--wedding-accent)", opacity: 0.4 }} />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Guest detail card — compact with spring animation + gold glow */}
          {selectedGuest && (
            <motion.div
              key="guest-detail"
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="rounded-2xl overflow-hidden relative mb-4"
              style={{
                background: "var(--wedding-card-bg)",
                border: "2px solid var(--wedding-accent)",
                boxShadow: "0 4px 30px rgba(176,132,72,0.15), 0 0 60px rgba(176,132,72,0.06)",
              }}
            >
              {/* Gold top bar */}
              <div className="h-[3px]" style={{
                background: "linear-gradient(90deg, transparent, var(--wedding-accent) 30%, var(--wedding-accent) 70%, transparent)"
              }} />

              <button
                onClick={() => setSelectedGuest(null)}
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 z-10"
                style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
                aria-label="Back to results"
              >
                <XIcon size={11} />
              </button>

              <div className="px-5 py-5 sm:px-7 sm:py-6 text-center">
                {/* Icon with gold glow pulse */}
                <motion.div
                  className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(176,132,72,0.0)",
                      "0 0 20px rgba(176,132,72,0.25)",
                      "0 0 0px rgba(176,132,72,0.0)",
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart size={24} style={{ color: "var(--wedding-accent)" }} />
                </motion.div>

                {/* Emotional copy */}
                <motion.p
                  className="text-[10px] tracking-[0.3em] uppercase mb-1.5"
                  style={{ color: "var(--wedding-accent)", opacity: 0.8 }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {selectedGuest.rsvpStatus === "declined"
                    ? "We'll miss you at our celebration 💛"
                    : "We're so happy you're joining us ✨"}
                </motion.p>
                <motion.h3
                  className="font-serif text-xl sm:text-2xl font-bold mb-2 leading-tight"
                  style={{ color: "var(--wedding-text)" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome, {selectedGuest.name.split(" ")[0]} 💛
                </motion.h3>

                <ThinGoldDivider className="mb-3" />

                <p className="text-xs leading-[1.7] mb-4" style={{ color: "var(--wedding-muted)" }}>
                  {selectedGuest.rsvpStatus === "confirmed"
                    ? "Your RSVP is confirmed — we can't wait to celebrate with you!"
                    : selectedGuest.rsvpStatus === "declined"
                    ? "We see you've declined, but you're always welcome to change your mind."
                    : "Your invite is ready — we'd love for you to complete your RSVP."}
                </p>

                {/* Guest details — compact */}
                <div
                  className="rounded-lg px-3.5 py-3 mb-4 text-left space-y-1.5"
                  style={{ background: "rgba(176,132,72,0.04)", border: "1px solid var(--wedding-border)" }}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <User size={11} style={{ color: "var(--wedding-accent)" }} />
                    <span style={{ color: "var(--wedding-muted)" }}>{selectedGuest.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Users size={11} style={{ color: "var(--wedding-accent)" }} />
                    <span style={{ color: "var(--wedding-muted)" }}>
                      {selectedGuest.adultsCount ?? 1} Adult{(selectedGuest.adultsCount ?? 1) > 1 ? "s" : ""}
                      {selectedGuest.childrenCount > 0 ? `, ${selectedGuest.childrenCount} Child${selectedGuest.childrenCount > 1 ? "ren" : ""}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {selectedGuest.rsvpStatus === "confirmed" ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Sparkles size={11} style={{ color: "#22c55e" }} />
                        <span style={{ color: "#22c55e" }}>RSVP Confirmed ✨</span>
                      </motion.div>
                    ) : (
                      <>
                        <Check size={11} style={{ color: "var(--wedding-accent)" }} />
                        <span style={{ color: "var(--wedding-muted)" }}>
                          {selectedGuest.rsvpStatus === "declined" ? "Declined" : "RSVP Pending"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Dynamic CTA based on status */}
                <motion.button
                  onClick={() => onEditRsvp(selectedGuest)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all mb-2"
                  style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)", border: "none" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {selectedGuest.rsvpStatus === "confirmed" ? "View Your Invitation" : "Edit My RSVP"}
                </motion.button>

                {/* Subtle secondary "search another" */}
                <button
                  onClick={() => {
                    setClearingGuest(true);
                    setTimeout(() => {
                      setSelectedGuest(null);
                      setQuery("");
                      setResults(null);
                      setClearingGuest(false);
                    }, 600);
                  }}
                  className="w-full py-1.5 text-[10px] font-medium transition-all opacity-50 hover:opacity-75"
                  style={{ background: "transparent", color: "var(--wedding-muted)", border: "none" }}
                >
                  Search for another guest
                </button>

                {/* Transition overlay when clearing */}
                <AnimatePresence>
                  {clearingGuest && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
                      style={{ background: "var(--wedding-card-bg)" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        className="text-center"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.25, delay: 0.05 }}
                      >
                        <Search size={24} className="mx-auto mb-2" style={{ color: "var(--wedding-accent)" }} />
                        <p className="text-xs font-medium" style={{ color: "var(--wedding-text)" }}>Clearing selection…</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRIMARY CTA — prominent, always visible when no guest detail open */}
        {!selectedGuest && (
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleContinueToRsvp}
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl text-sm font-bold tracking-wide transition-all"
              style={{
                background: "var(--wedding-accent)",
                color: "var(--wedding-bg)",
                border: "none",
                boxShadow: "0 4px 24px rgba(176,132,72,0.3)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 32px rgba(176,132,72,0.45)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              <Sparkles size={16} />
              Continue to RSVP
              <ChevronRight size={15} />
            </motion.button>
            <p className="text-[10px] mt-2.5" style={{ color: "var(--wedding-muted)", opacity: 0.55 }}>
              No search needed — we'd love to celebrate with you 💛
            </p>
          </motion.div>
        )}

        {/* Bottom contact links */}
        <motion.div
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>Need help? Reach out to us</p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <a
              href="tel:+918376916635"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
            >
              <Phone size={11} /> Contact Kaustav (Groom Side)
            </a>
            <a
              href="tel:+919582304872"
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
