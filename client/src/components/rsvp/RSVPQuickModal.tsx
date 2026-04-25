/**
 * RSVPQuickModal
 *
 * Name-lookup ONLY — no form inside.
 * Flow:
 *   Enter name → search
 *   1 result  → onResolve(guest, name)  immediately
 *   >1 results → show disambiguation list → user picks one
 *   0 results  → show message → auto-resolve(null, name) after 1.8s
 *   Skip       → onResolve(null, "")   → parent scrolls to #rsvp
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X as XIcon, ChevronRight, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RSVPQuickModalProps {
  open: boolean;
  onClose: () => void;
  /** Called when lookup is done. guest=null means not found / skipped. */
  onResolve: (guest: any | null, name: string) => void;
  initialName?: string;
}

const inputStyle: React.CSSProperties = {
  background: "var(--wedding-card-bg)",
  border: "1.5px solid var(--wedding-border)",
  color: "var(--wedding-text)",
  outline: "none",
};

export default function RSVPQuickModal({ open, onClose, onResolve, initialName }: RSVPQuickModalProps) {
  const [nameInput, setNameInput] = useState(initialName ?? "");
  const [searching, setSearching] = useState(false);
  const [nameNotFound, setNameNotFound] = useState(false);
  const [multipleGuests, setMultipleGuests] = useState<any[]>([]);
  const autoResolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Reset on open ── */
  useEffect(() => {
    if (open) {
      setNameInput(initialName ?? "");
      setSearching(false);
      setNameNotFound(false);
      setMultipleGuests([]);
    } else {
      if (autoResolveTimer.current) clearTimeout(autoResolveTimer.current);
    }
  }, [open, initialName]);

  const resolve = (guest: any | null, name: string) => {
    if (autoResolveTimer.current) clearTimeout(autoResolveTimer.current);
    onClose();
    onResolve(guest, name);
  };

  const handleSearch = async () => {
    const name = nameInput.trim();
    if (name.length < 2) return;
    setSearching(true);
    setNameNotFound(false);
    setMultipleGuests([]);
    try {
      const res = await apiRequest("GET", `/api/guests/by-name?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const guests = await res.json();
        if (Array.isArray(guests) && guests.length === 1) {
          // Exactly one match — safe to resolve with full guest data
          resolve(guests[0], name);
          return;
        }
        if (Array.isArray(guests) && guests.length > 1) {
          // Multiple matches — show picker; user must self-identify
          // We do NOT auto-resolve with guest data here (security: can't verify identity)
          setMultipleGuests(guests);
          setSearching(false);
          return;
        }
      }
      // 0 results — show not-found, auto-close after 1.8s with null guest (blank form)
      setNameNotFound(true);
      autoResolveTimer.current = setTimeout(() => resolve(null, name), 1800);
    } catch {
      setNameNotFound(true);
      autoResolveTimer.current = setTimeout(() => resolve(null, nameInput.trim()), 1800);
    } finally {
      setSearching(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)" }}
            onClick={() => resolve(null, nameInput.trim())}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "var(--wedding-bg)",
              border: "1.5px solid var(--wedding-border)",
              boxShadow: "0 -8px 60px rgba(0,0,0,0.6)",
              maxHeight: "85vh",
            }}
            initial={{ y: 70, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Accent bar */}
            <div className="h-[2px] flex-shrink-0" style={{
              background: "linear-gradient(90deg, transparent, var(--wedding-accent) 30%, var(--wedding-accent) 70%, transparent)"
            }} />

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--wedding-border)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 pb-4 pt-1 flex-shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase font-medium"
                  style={{ color: "var(--wedding-accent)", opacity: 0.7 }}>
                  {multipleGuests.length > 0 ? "Multiple matches found" : "Let's get started"}
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5"
                  style={{ color: "var(--wedding-text)" }}>
                  {multipleGuests.length > 0 ? "Which one are you?" : "RSVP"}
                </h2>
              </div>
              <button
                onClick={() => resolve(null, nameInput.trim())}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--wedding-border)",
                  color: "var(--wedding-muted)",
                }}
              >
                <XIcon size={15} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mx-5 sm:mx-6 flex-shrink-0" style={{ background: "var(--wedding-border)" }} />

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 sm:px-6 py-5">
              <AnimatePresence mode="wait">

                {/* ── Multiple results: disambiguation list ── */}
                {multipleGuests.length > 0 && (
                  <motion.div
                    key="multi"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      We found a few people named <span style={{ color: "var(--wedding-accent)", fontWeight: 600 }}>"{nameInput.trim()}"</span>. Select your name and the form will open for you — you'll confirm the details there.
                    </p>

                    <div className="space-y-2 mb-4">
                      {multipleGuests.map((guest) => (
                        <motion.button
                          key={guest.id}
                          onClick={() => {
                            // Resolve with null guest — name only hint.
                            // The RSVP form's own debounced lookup will find & verify them.
                            // This prevents someone accidentally (or intentionally) editing
                            // another person's record just by seeing their name in this list.
                            resolve(null, guest.name);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1.5px solid var(--wedding-border)",
                          }}
                          whileHover={{
                            borderColor: "var(--wedding-accent)",
                            background: "rgba(255,255,255,0.07)",
                            scale: 1.01,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--wedding-border)" }}
                          >
                            <User size={15} style={{ color: "var(--wedding-accent)" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--wedding-text)" }}>
                              {guest.name}
                            </p>
                            {guest.rsvpStatus && (
                              <p className="text-[10px] mt-0.5" style={{ color: "var(--wedding-muted)" }}>
                                {guest.rsvpStatus === "confirmed" ? "✓ RSVP confirmed" : "RSVP pending"}
                              </p>
                            )}
                          </div>
                          <ChevronRight size={14} style={{ color: "var(--wedding-accent)", opacity: 0.5, flexShrink: 0 }} />
                        </motion.button>
                      ))}
                    </div>

                    {/* None of these is me */}
                    <button
                      onClick={() => resolve(null, nameInput.trim())}
                      className="w-full py-2.5 text-xs rounded-xl transition-all"
                      style={{
                        background: "transparent",
                        color: "var(--wedding-muted)",
                        border: "1px solid var(--wedding-border)",
                        opacity: 0.6,
                      }}
                    >
                      None of these — continue to RSVP form
                    </button>
                  </motion.div>
                )}

                {/* ── Default: name search ── */}
                {multipleGuests.length === 0 && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      Enter your name so we can find your invitation and personalise your RSVP.
                    </p>

                    <label className="text-[11px] tracking-[0.2em] uppercase font-semibold block mb-2"
                      style={{ color: "var(--wedding-accent)" }}>
                      Your Name
                    </label>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => { setNameInput(e.target.value); setNameNotFound(false); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Enter your full name..."
                        autoFocus
                        className="flex-1 px-4 py-3 rounded-xl text-sm"
                        style={inputStyle}
                      />
                      <motion.button
                        onClick={handleSearch}
                        disabled={searching || nameInput.trim().length < 2}
                        className="px-4 py-3 rounded-xl flex items-center gap-1.5 text-sm font-semibold disabled:opacity-40"
                        style={{
                          background: "var(--wedding-accent)",
                          color: "var(--wedding-bg)",
                          border: "none",
                          boxShadow: "0 3px 14px rgba(0,0,0,0.3)",
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {searching
                          ? <Loader2 size={15} className="animate-spin" />
                          : <><Search size={15} /> Find</>}
                      </motion.button>
                    </div>

                    {/* Not-found message — auto-scrolls after 1.8s */}
                    <AnimatePresence>
                      {nameNotFound && (
                        <motion.div
                          key="not-found"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-start gap-3 px-4 py-3 rounded-xl mb-4"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--wedding-border)",
                          }}
                        >
                          <span className="text-base mt-0.5">🔍</span>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--wedding-text)" }}>
                              We couldn't find your invitation
                            </p>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                              Don't worry — taking you to the RSVP form now…
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Skip link */}
                    {!nameNotFound && (
                      <motion.button
                        onClick={() => resolve(null, nameInput.trim())}
                        className="w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-all"
                        style={{
                          background: "transparent",
                          color: "var(--wedding-muted)",
                          border: "1px solid var(--wedding-border)",
                          opacity: 0.7,
                        }}
                        whileHover={{ opacity: 1, borderColor: "var(--wedding-accent)", color: "var(--wedding-accent)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Skip — go straight to RSVP <ChevronRight size={13} />
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
