/**
 * RSVPQuickModal — mobile-optimised bottom sheet
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, X as XIcon, ChevronRight, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RSVPQuickModalProps {
  open: boolean;
  onClose: () => void;
  onResolve: (guest: any | null, name: string) => void;
  initialName?: string;
}

export default function RSVPQuickModal({ open, onClose, onResolve, initialName }: RSVPQuickModalProps) {
  const [nameInput, setNameInput] = useState(initialName ?? "");
  const [searching, setSearching] = useState(false);
  const [nameNotFound, setNameNotFound] = useState(false);
  const [multipleGuests, setMultipleGuests] = useState<any[]>([]);
  const autoResolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Detect touch device to skip autoFocus (prevents unwanted keyboard pop on iOS)
  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

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

  /** Close without triggering any scroll or prefill */
  const dismiss = () => {
    if (autoResolveTimer.current) clearTimeout(autoResolveTimer.current);
    onClose();
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
          resolve(guests[0], name);
          return;
        }
        if (Array.isArray(guests) && guests.length > 1) {
          setMultipleGuests(guests);
          setSearching(false);
          return;
        }
      }
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
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)" }}
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom-sheet on mobile, centred card on desktop */}
          <motion.div
            className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col"
            style={{
              background: "var(--wedding-bg)",
              border: "1.5px solid var(--wedding-border)",
              boxShadow: "0 -8px 60px rgba(0,0,0,0.6)",
              maxHeight: "92dvh",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            } as React.CSSProperties}
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            {/* Accent bar */}
            <div className="h-[2px] flex-shrink-0 rounded-t-3xl" style={{
              background: "linear-gradient(90deg, transparent, var(--wedding-accent) 30%, var(--wedding-accent) 70%, transparent)"
            }} />

            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--wedding-border)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-0 flex-shrink-0">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-medium"
                  style={{ color: "var(--wedding-accent)", opacity: 0.7 }}>
                  {multipleGuests.length > 0 ? "Multiple matches found" : "Let's get started"}
                </p>
                <h2 className="font-serif text-xl font-bold mt-0.5"
                  style={{ color: "var(--wedding-text)" }}>
                  {multipleGuests.length > 0 ? "Which one are you?" : "RSVP"}
                </h2>
              </div>
              {/* Large tap target for close — min 44×44px */}
              <button
                onClick={dismiss}
                className="flex items-center justify-center rounded-full transition-all active:scale-95"
                style={{
                  width: 44,
                  height: 44,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--wedding-border)",
                  color: "var(--wedding-muted)",
                }}
                aria-label="Close"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px mx-5 flex-shrink-0" style={{ background: "var(--wedding-border)" }} />

            {/* Scrollable content — extra bottom padding so last item clears keyboard */}
            <div className="overflow-y-auto flex-1 px-5 pt-5 pb-8">
              <AnimatePresence mode="wait">

                {/* ── Multiple results ── */}
                {multipleGuests.length > 0 && (
                  <motion.div
                    key="multi"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      We found a few people named{" "}
                      <span style={{ color: "var(--wedding-accent)", fontWeight: 600 }}>
                        "{nameInput.trim()}"
                      </span>. Tap your name below:
                    </p>

                    <div className="space-y-2.5 mb-5">
                      {multipleGuests.map((guest) => (
                        <motion.button
                          key={guest.id}
                          onClick={() => resolve(null, guest.name)}
                          className="w-full flex items-center gap-3 px-4 rounded-2xl text-left active:scale-[0.98]"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1.5px solid var(--wedding-border)",
                            // Min 56px height for comfortable tap target
                            minHeight: 56,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--wedding-border)" }}
                          >
                            <User size={15} style={{ color: "var(--wedding-accent)" }} />
                          </div>
                          <div className="flex-1 min-w-0 py-3.5">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--wedding-text)" }}>
                              {guest.name}
                            </p>
                            {guest.rsvpStatus && (
                              <p className="text-[11px] mt-0.5" style={{ color: "var(--wedding-muted)" }}>
                                {guest.rsvpStatus === "confirmed" ? "✓ RSVP confirmed" : "RSVP pending"}
                              </p>
                            )}
                          </div>
                          <ChevronRight size={14} style={{ color: "var(--wedding-accent)", opacity: 0.5, flexShrink: 0 }} />
                        </motion.button>
                      ))}
                    </div>

                    <button
                      onClick={() => resolve(null, nameInput.trim())}
                      className="w-full rounded-2xl text-sm transition-all active:opacity-70"
                      style={{
                        minHeight: 48,
                        background: "transparent",
                        color: "var(--wedding-muted)",
                        border: "1px solid var(--wedding-border)",
                        opacity: 0.7,
                      }}
                    >
                      None of these — continue to RSVP form
                    </button>
                  </motion.div>
                )}

                {/* ── Default: search ── */}
                {multipleGuests.length === 0 && (
                  <motion.div
                    key="search"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      Enter your name so we can find your invitation and personalise your RSVP.
                    </p>

                    <label className="text-[11px] tracking-[0.2em] uppercase font-semibold block mb-2"
                      style={{ color: "var(--wedding-accent)" }}>
                      Your Name
                    </label>

                    {/* Stacked layout on mobile — full-width input, full-width button */}
                    <div className="flex flex-col gap-2.5 mb-4">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => { setNameInput(e.target.value); setNameNotFound(false); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Enter your full name..."
                        autoFocus={!isTouch}
                        autoComplete="name"
                        autoCorrect="off"
                        autoCapitalize="words"
                        className="w-full px-4 rounded-xl"
                        style={{
                          background: "var(--wedding-card-bg)",
                          border: "1.5px solid var(--wedding-border)",
                          color: "var(--wedding-text)",
                          outline: "none",
                          // 16px prevents iOS auto-zoom on focus
                          fontSize: 16,
                          height: 52,
                        }}
                      />
                      <motion.button
                        onClick={handleSearch}
                        disabled={searching || nameInput.trim().length < 2}
                        className="w-full rounded-xl flex items-center justify-center gap-2 font-semibold disabled:opacity-40 active:scale-[0.97]"
                        style={{
                          background: "var(--wedding-accent)",
                          color: "var(--wedding-bg)",
                          border: "none",
                          boxShadow: "0 3px 14px rgba(0,0,0,0.3)",
                          height: 52,
                          fontSize: 15,
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {searching
                          ? <><Loader2 size={16} className="animate-spin" /> Searching…</>
                          : <><Search size={16} /> Find My Invitation</>}
                      </motion.button>
                    </div>

                    {/* Not-found message */}
                    <AnimatePresence>
                      {nameNotFound && (
                        <motion.div
                          key="not-found"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl mb-4"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid var(--wedding-border)",
                          }}
                        >
                          <span className="text-lg mt-0.5">🔍</span>
                          <div>
                            <p className="text-sm font-medium" style={{ color: "var(--wedding-text)" }}>
                              We couldn't find your invitation
                            </p>
                            <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                              Don't worry — taking you to the RSVP form now…
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Skip */}
                    {!nameNotFound && (
                      <button
                        onClick={() => resolve(null, nameInput.trim())}
                        className="w-full rounded-2xl text-sm flex items-center justify-center gap-1.5 transition-all active:opacity-70"
                        style={{
                          minHeight: 48,
                          background: "transparent",
                          color: "var(--wedding-muted)",
                          border: "1px solid var(--wedding-border)",
                          opacity: 0.7,
                          fontSize: 14,
                        }}
                      >
                        Skip — go straight to RSVP <ChevronRight size={13} />
                      </button>
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
