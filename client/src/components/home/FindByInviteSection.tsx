import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Loader2, User, ChevronRight, X as XIcon, Heart, Phone, Users, Check, Clock, XCircle
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
  const [clearingGuest, setClearingGuest] = useState(false); // transition state
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (searchQuery?: string) => {
    const name = (searchQuery ?? query).trim();
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

  // Debounced auto-search: triggers 500ms after user stops typing (min 3 chars)
  useEffect(() => {
    const trimmed = query.trim();

    // Clear results immediately when query is too short
    if (trimmed.length < 3) {
      if (trimmed.length === 0) {
        setResults(null);
        setSelectedGuest(null);
      }
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      return;
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      handleSearch(trimmed);
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  // Expose search function to parent
  useEffect(() => {
    onSearchReady(handleSearch, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSearch, query]);

  const notFound = results !== null && results.length === 0;
  const found = results !== null && results.length > 0;

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
            <Search size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
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
          className="relative flex gap-2 mb-1"
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
              onChange={(e) => setQuery(e.target.value)}
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
          <motion.button
            onClick={() => handleSearch()}
            disabled={searching || query.trim().length < 3}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Search
          </motion.button>
        </motion.div>

        {/* Subtle live-search hint */}
        <div className="mb-4 min-h-[18px]">
          {searching && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: "var(--wedding-accent)" }}>
              <Loader2 size={11} className="animate-spin" /> Searching…
            </p>
          )}
          {!searching && query.trim().length >= 1 && query.trim().length < 3 && (
            <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
              Type at least 3 characters to search
            </p>
          )}
        </div>

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
              <motion.button
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
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Submit RSVP Directly <ChevronRight size={11} />
              </motion.button>
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
                Found {results!.length} guest{results!.length > 1 ? "s" : ""} — tap to view your RSVP
              </p>
              {results!.map((guest) => {
                const isPending = guest.rsvpApprovalStatus === "pending_approval";
                const isRejected = guest.rsvpApprovalStatus === "rejected";
                return (
                  <motion.button
                    key={guest.id}
                    onClick={() => setSelectedGuest(guest)}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all hover:shadow-xl"
                    style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(176,132,72,0.10)", color: "var(--wedding-accent)" }}
                    >
                      {isPending ? <Clock size={16} /> : isRejected ? <XCircle size={16} style={{ color: "#ef4444" }} /> : <User size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "var(--wedding-text)" }}>{guest.name}</p>
                      <p className="text-xs" style={{ color: isPending ? "#f59e0b" : isRejected ? "#ef4444" : "var(--wedding-muted)" }}>
                        {isPending
                          ? "⏳ Awaiting approval"
                          : isRejected
                          ? "✗ Request declined"
                          : guest.rsvpStatus === "confirmed"
                          ? "✓ RSVP Confirmed"
                          : guest.rsvpStatus === "declined"
                          ? "✗ Declined"
                          : "RSVP Pending"}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--wedding-accent)", opacity: 0.8 }}>
                        Tap to view →
                      </p>
                    </div>
                    <ChevronRight size={14} style={{ color: "var(--wedding-accent)", opacity: 0.5 }} />
                  </motion.button>
                );
              })}
            </motion.div>
          )}

          {selectedGuest && (
            <motion.div
              key="guest-detail"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="rounded-2xl overflow-hidden relative"
              style={{ background: "var(--wedding-card-bg)", border: `2px solid ${selectedGuest.rsvpApprovalStatus === "rejected" ? "#ef4444" : selectedGuest.rsvpApprovalStatus === "pending_approval" ? "#f59e0b" : "var(--wedding-accent)"}`, boxShadow: "0 8px 40px rgba(176,132,72,0.18)" }}
            >
              {/* Top bar — colour reflects status */}
              <div className="h-[4px]" style={{
                background: selectedGuest.rsvpApprovalStatus === "rejected"
                  ? "linear-gradient(90deg, transparent, #ef4444 40%, #ef4444 60%, transparent)"
                  : selectedGuest.rsvpApprovalStatus === "pending_approval"
                  ? "linear-gradient(90deg, transparent, #f59e0b 40%, #f59e0b 60%, transparent)"
                  : "linear-gradient(90deg, transparent, var(--wedding-accent) 40%, var(--wedding-accent) 60%, transparent)"
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
                {/* Icon — reflects status */}
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                >
                  {selectedGuest.rsvpApprovalStatus === "rejected"
                    ? <XCircle size={28} style={{ color: "#ef4444" }} />
                    : selectedGuest.rsvpApprovalStatus === "pending_approval"
                    ? <Clock size={28} style={{ color: "#f59e0b" }} />
                    : <Heart size={28} style={{ color: "var(--wedding-accent)" }} />}
                </div>

                <p className="text-[10px] tracking-[0.35em] uppercase mb-2" style={{
                  color: selectedGuest.rsvpApprovalStatus === "rejected" ? "#ef4444"
                    : selectedGuest.rsvpApprovalStatus === "pending_approval" ? "#f59e0b"
                    : "var(--wedding-accent)",
                  opacity: 0.85
                }}>
                  {selectedGuest.rsvpApprovalStatus === "rejected"
                    ? "Request Declined"
                    : selectedGuest.rsvpApprovalStatus === "pending_approval"
                    ? "Under Review"
                    : "You're on the list!"}
                </p>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-tight" style={{ color: "var(--wedding-text)" }}>
                  Hello, {selectedGuest.name.split(" ")[0]}!
                </h3>

                <ThinGoldDivider className="mb-4" />

                <p className="text-sm leading-[1.75] mb-5" style={{ color: "var(--wedding-muted)" }}>
                  {selectedGuest.rsvpApprovalStatus === "rejected"
                    ? "We're sorry, but your RSVP request was not approved. Please contact us directly if you have any questions."
                    : selectedGuest.rsvpApprovalStatus === "pending_approval"
                    ? "Your RSVP is under review by the wedding team. We'll confirm your spot soon — no further action needed from your side."
                    : selectedGuest.rsvpStatus === "confirmed"
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
                  {selectedGuest.rsvpApprovalStatus !== "pending_approval" && selectedGuest.rsvpApprovalStatus !== "rejected" && (
                    <div className="flex items-center gap-2.5 text-xs">
                      <Users size={12} style={{ color: "var(--wedding-accent)" }} />
                      <span style={{ color: "var(--wedding-muted)" }}>
                        {selectedGuest.adultsCount ?? 1} Adult{(selectedGuest.adultsCount ?? 1) > 1 ? "s" : ""}
                        {selectedGuest.childrenCount > 0 ? `, ${selectedGuest.childrenCount} Child${selectedGuest.childrenCount > 1 ? "ren" : ""}` : ""}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 text-xs">
                    {selectedGuest.rsvpApprovalStatus === "rejected"
                      ? <XCircle size={12} style={{ color: "#ef4444" }} />
                      : selectedGuest.rsvpApprovalStatus === "pending_approval"
                      ? <Clock size={12} style={{ color: "#f59e0b" }} />
                      : <Check size={12} style={{ color: selectedGuest.rsvpStatus === "confirmed" ? "#22c55e" : "var(--wedding-accent)" }} />}
                    <span style={{
                      color: selectedGuest.rsvpApprovalStatus === "rejected" ? "#ef4444"
                        : selectedGuest.rsvpApprovalStatus === "pending_approval" ? "#f59e0b"
                        : selectedGuest.rsvpStatus === "confirmed" ? "#22c55e"
                        : "var(--wedding-muted)"
                    }}>
                      {selectedGuest.rsvpApprovalStatus === "rejected"
                        ? "Request Declined"
                        : selectedGuest.rsvpApprovalStatus === "pending_approval"
                        ? "Awaiting Approval"
                        : selectedGuest.rsvpStatus === "confirmed"
                        ? "RSVP Confirmed"
                        : selectedGuest.rsvpStatus === "declined"
                        ? "Declined"
                        : "RSVP Pending"}
                    </span>
                  </div>
                </div>

                {/* Only show Edit button for fully approved guests */}
                {selectedGuest.rsvpApprovalStatus !== "pending_approval" && selectedGuest.rsvpApprovalStatus !== "rejected" && (
                  <button
                    onClick={() => onEditRsvp(selectedGuest)}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all mb-2"
                    style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)", border: "none" }}
                  >
                    Edit My RSVP
                  </button>
                )}

                {/* Contact prompt for rejected */}
                {selectedGuest.rsvpApprovalStatus === "rejected" && (
                  <div className="mb-2 space-y-2">
                    <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                      Have questions? Please reach out directly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <a href="tel:+918376916635" className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg" style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}>
                        <Phone size={11} /> Groom Side
                      </a>
                      <a href="tel:+919582304872" className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg" style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}>
                        <Phone size={11} /> Bride Side
                      </a>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setClearingGuest(true);
                    setTimeout(() => {
                      setSelectedGuest(null);
                      setQuery("");
                      setResults(null);
                      setClearingGuest(false);
                    }, 800);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "transparent", color: "var(--wedding-muted)", border: "1px solid var(--wedding-border)" }}
                >
                  Search for Another Guest
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
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="text-center"
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <Search size={28} className="mx-auto mb-2" style={{ color: "var(--wedding-accent)" }} />
                        <p className="text-sm font-medium" style={{ color: "var(--wedding-text)" }}>Searching for another guest…</p>
                        <p className="text-xs mt-1" style={{ color: "var(--wedding-muted)" }}>Clearing your selection</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
