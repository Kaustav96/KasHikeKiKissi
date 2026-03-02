import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, ChevronDown, ChevronRight, Heart, ExternalLink,
  Loader2, Check, Search, User, Phone, Navigation, Plane, Train, Car,
  BedDouble, Info, BookOpen, Sparkles, Shirt, Sun, Music, Crown, Building,
  X as XIcon, Users,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { Countdown } from "@/components/Countdown";
import KHCrest from "@/components/KHCrest";
import CrestIntro from "@/components/CrestIntro";
import Header from "@/components/Header";
import SideSelectionLanding from "@/components/SideSelectionLanding";
import ViewingSideOverlay from "@/components/ViewingSideOverlay";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FloatingContact from "@/components/FloatingContact";
import { MandalaHalfOrnament, GoldMedallion, ThinGoldDivider, RoyalFrame } from "@/components/RoyalOrnaments";
import type { WeddingConfig, WeddingEvent, StoryMilestone, Venue, Faq } from "../../../shared/schema.js";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function SimpleDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2 my-1">
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="w-1 h-1 rounded-full" style={{ background: "var(--wedding-muted)", opacity: 0.5 }} />
      <div className="h-px w-16" style={{ background: "var(--wedding-border)" }} />
    </div>
  );
}

function HeroSection({ config, isDateConfirmed }: { config: WeddingConfig, isDateConfirmed: boolean }) {
  const { side } = useWeddingTheme();
  // Groom side: dark antique gold; Bride side: accent color (unchanged)
  const nameColor = side === "groom" ? "#8B6914" : "var(--wedding-accent)";
  const ampColor = side === "groom" ? "#A1122F" : "#C6A75E";
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative pt-14 overflow-hidden"
      style={{ background: "var(--wedding-hero-gradient)" }}
      data-testid="hero-section"
    >
      {/* Mandala ornaments on sides */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 opacity-15 pointer-events-none">
        <MandalaHalfOrnament side="left" />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 opacity-15 pointer-events-none">
        <MandalaHalfOrnament side="right" />
      </div>

      {/* Radial glow behind names */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(185,151,91,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Subtle circle pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="text-center z-10 px-4 relative max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        {/* Central medallion above names */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <GoldMedallion size={90} />
          </motion.div>
        </div>

        <motion.p
          className="text-[11px] sm:text-xs tracking-[0.45em] uppercase mb-6 font-medium"
          style={{ color: "var(--wedding-muted)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          The Wedding Celebration of
        </motion.p>

        <motion.h1
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-2"
          style={{ color: nameColor }}
          data-testid="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Himasree
        </motion.h1>

        {/* Animated thin gold divider */}
        <div className="flex items-center justify-center gap-5 my-4">
          <motion.div
            className="h-px flex-1 max-w-[100px]"
            style={{ background: "linear-gradient(to right, transparent, var(--wedding-accent))" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
          />
          <motion.span
            className="font-serif text-3xl sm:text-4xl italic"
            style={{ color: ampColor }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            &amp;
          </motion.span>
          <motion.div
            className="h-px flex-1 max-w-[100px]"
            style={{ background: "linear-gradient(to left, transparent, var(--wedding-accent))" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <motion.h1
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-10"
          style={{ color: nameColor }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Kaustav
        </motion.h1>

        {/* Glass-style date + countdown block */}
        <motion.div
          className="relative rounded-2xl px-6 py-6 sm:px-10 sm:py-8 mx-auto max-w-lg"
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(185,151,91,0.22)",
            boxShadow: "0 4px 24px rgba(46,43,39,0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Shimmer top line */}
          <div
            className="absolute top-0 left-8 right-8 h-px rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, rgba(185,151,91,0.5), transparent)" }}
          />

          {config.weddingDate ? (
            <>
              <p
                className="font-serif text-base sm:text-lg mb-5 tracking-wide"
                style={{ color: "var(--wedding-text)" }}
              >
                {new Date(config.weddingDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <Countdown targetDate={new Date(config.weddingDate)} />
            </>
          ) : (
            <p
              className="font-serif text-xl italic"
              style={{ color: "var(--wedding-accent)" }}
              data-testid="date-tbd"
            >
              Date TBD
            </p>
          )}

          {config.venueName && (
            <p
              className="mt-5 flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
              style={{ color: "var(--wedding-muted)" }}
            >
              <MapPin size={12} />
              {config.venueName}, Kolkata
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* Gentle float chevron — click to scroll down */}
      <motion.button
        className="absolute bottom-8 cursor-pointer flex items-center justify-center"
        style={{ color: "var(--wedding-accent)", opacity: 0.6, background: "none", border: "none", padding: 8 }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 0.6, y: [0, 6, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.65, behavior: "smooth" })}
        aria-label="Scroll down"
      >
        <ChevronDown size={22} />
      </motion.button>
    </section>
  );
}

function StorySection({ milestones }: { milestones: StoryMilestone[] }) {
  if (milestones.length === 0) return null;

  return (
    <section id="story" className="py-16 sm:py-20 px-4 sm:px-8 relative overflow-hidden" style={{ background: "var(--wedding-alt-bg)" }} data-testid="story-section">
      <div className="absolute top-0 left-0 w-32 md:w-48 opacity-8 pointer-events-none">
        <MandalaHalfOrnament side="left" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 md:w-48 opacity-8 pointer-events-none">
        <MandalaHalfOrnament side="right" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Section header with icon */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <BookOpen size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            How It All Began
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Our Story
          </h2>
          <SimpleDivider />
        </motion.div>

        {/* Compact 2-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.id}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: "var(--wedding-card-bg)",
                border: "1px solid var(--wedding-border)",
                boxShadow: "0 2px 16px rgba(46,43,39,0.05)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`story-milestone-${milestone.id}`}
            >
              {/* Gold accent top bar */}
              <div className="h-[3px]" style={{
                background: "linear-gradient(90deg, transparent, var(--wedding-accent) 40%, var(--wedding-accent) 60%, transparent)"
              }} />

              <div className="px-5 py-4">
                {/* Index + date row */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[9px] font-bold tabular-nums tracking-[0.2em]"
                    style={{ color: "var(--wedding-accent)", opacity: 0.55 }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] tracking-[0.18em] uppercase"
                    style={{
                      background: "rgba(176,132,72,0.09)",
                      border: "1px solid rgba(176,132,72,0.22)",
                      color: "var(--wedding-accent)",
                    }}
                  >
                    {milestone.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-base sm:text-lg font-semibold mb-1.5 leading-tight" style={{ color: "var(--wedding-text)" }}>
                  {milestone.title}
                </h3>

                {/* Thin divider */}
                <div className="h-px mb-2.5" style={{ background: "var(--wedding-border)" }} />

                {/* Description — 3 lines max */}
                <p
                  className="text-xs sm:text-sm leading-[1.75]"
                  style={{
                    color: "var(--wedding-muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



function getEventIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("haldi")) return Sun;
  if (t.includes("sangeet") || t.includes("music")) return Music;
  if (t.includes("reception")) return Sparkles;
  if (t.includes("engagement")) return Heart;
  return Crown;
}

function EventsSection({ events }: { events: WeddingEvent[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { side } = useWeddingTheme();

  // Show all events (no side filter) so nothing is hidden
  const filteredEvents = events;

  if (filteredEvents.length === 0) return null;

  const dateMap = new Map<string, WeddingEvent[]>();
  filteredEvents.forEach((ev) => {
    const dateStr = new Date(ev.startTime).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
    });
    if (!dateMap.has(dateStr)) dateMap.set(dateStr, []);
    dateMap.get(dateStr)!.push(ev);
  });

  const dates = Array.from(dateMap.keys());
  const active = selectedDate || dates[0] || null;
  const activeEvents = active ? dateMap.get(active) || [] : [];

  const sideName = side === "groom" ? "Kaustav's" : "Himasree's";

  return (
    <section id="events" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-bg)" }} data-testid="events-section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <Calendar size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Ceremony Schedule
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Wedding Events
          </h2>
          <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: "var(--wedding-accent)", opacity: 0.8 }}>
            Events for {sideName} side
          </p>
          <SimpleDivider />
        </motion.div>

        {/* Date tab pills */}
        {dates.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-center flex-wrap" data-testid="event-date-timeline">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className="px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 transition-all"
                style={{
                  background: active === date ? "var(--wedding-accent)" : "rgba(255,255,255,0.6)",
                  color: active === date ? "#fff" : "var(--wedding-text)",
                  border: `1px solid ${active === date ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                  boxShadow: active === date ? "0 2px 12px rgba(185,151,91,0.20)" : "none",
                }}
                data-testid={`event-date-${date}`}
              >
                <Calendar size={11} />
                {date}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {activeEvents.map((event, idx) => {
            const EventIcon = getEventIcon(event.title);
            return (
              <motion.div
                key={event.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--wedding-card-bg)",
                  border: event.isMainEvent ? "2px solid var(--wedding-accent)" : "1px solid var(--wedding-border)",
                  boxShadow: event.isMainEvent
                    ? "0 4px 24px rgba(176,132,72,0.14)"
                    : "0 2px 12px rgba(46,43,39,0.05)",
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                data-testid={`event-card-${event.id}`}
              >
                {/* Top accent bar */}
                {event.isMainEvent && (
                  <div className="h-[3px]" style={{
                    background: "linear-gradient(90deg, transparent, var(--wedding-accent) 40%, var(--wedding-accent) 60%, transparent)"
                  }} />
                )}

                <div className="p-5 sm:p-6">
                  {/* Icon + title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                    >
                      <EventIcon size={18} style={{ color: "var(--wedding-accent)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {event.isMainEvent && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] tracking-[0.2em] uppercase"
                            style={{ background: "var(--wedding-accent)", color: "#fff" }}
                          >
                            Main Event
                          </span>
                        )}
                        {event.side && event.side !== "both" && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] tracking-[0.2em] uppercase"
                            style={{
                              background: event.side === "bride" ? "rgba(139,0,0,0.12)" : "rgba(176,132,72,0.15)",
                              color: event.side === "bride" ? "#8B0000" : "var(--wedding-accent)",
                              border: `1px solid ${event.side === "bride" ? "rgba(139,0,0,0.25)" : "var(--wedding-border)"}`,
                            }}
                          >
                            {event.side === "bride" ? "Bride's" : "Groom's"} side
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-semibold leading-tight" style={{ color: "var(--wedding-text)" }}>
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  <ThinGoldDivider className="mb-4" />

                  {event.description && (
                    <p className="text-sm mb-4 leading-[1.7]" style={{ color: "var(--wedding-muted)" }}>
                      {event.description}
                    </p>
                  )}

                  {/* Info rows */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2.5">
                      <Clock size={13} style={{ color: "var(--wedding-accent)", flexShrink: 0 }} />
                      <span style={{ color: "var(--wedding-text)" }}>
                        {new Date(event.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        {event.endTime && ` — ${new Date(event.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                      </span>
                    </div>
                    {event.venueName && (
                      <div className="flex items-center gap-2.5">
                        <MapPin size={13} style={{ color: "var(--wedding-accent)", flexShrink: 0 }} />
                        <span style={{ color: "var(--wedding-text)" }}>{event.venueName}</span>
                      </div>
                    )}
                    {event.dressCode && (
                      <div className="flex items-center gap-2.5">
                        <Shirt size={13} style={{ color: "var(--wedding-accent)", flexShrink: 0 }} />
                        <span className="text-xs" style={{ color: "var(--wedding-muted)" }}>Dress Code: {event.dressCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={`/api/events/${event.id}/calendar`}
                      className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                      style={{ border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
                      data-testid={`download-ics-${event.id}`}
                    >
                      <Calendar size={11} />
                      Add to Calendar
                    </a>
                    {event.venueMapUrl && (
                      <a
                        href={event.venueMapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                        style={{ border: "1px solid var(--wedding-border)", color: "var(--wedding-accent)" }}
                        data-testid={`map-link-${event.id}`}
                      >
                        <ExternalLink size={11} />
                        View Map
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VenueSection({ venueList }: { venueList: Venue[] }) {
  const [activeVenueIdx, setActiveVenueIdx] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState<"map" | "stay" | "reach">("map");

  const venueLabels = ["Wedding", "Reception"];
  const venueCities = ["Siliguri", "Faridabad"];
  const activeVenue = venueList[activeVenueIdx] ?? null;

  const travelModes = [
    { icon: Plane, label: "By Air" },
    { icon: Train, label: "By Train" },
    { icon: Car, label: "By Road" },
    { icon: Navigation, label: "By Cab" },
  ];

  const subTabs: { id: "map" | "stay" | "reach"; label: string; icon: typeof MapPin }[] = [
    { id: "map", label: "Venue Map", icon: MapPin },
    { id: "stay", label: "Accommodation", icon: BedDouble },
    { id: "reach", label: "How to Reach", icon: Navigation },
  ];

  return (
    <section id="venue" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-alt-bg)" }} data-testid="venue-section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <Building size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Getting There
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Venue &amp; Travel
          </h2>
          <SimpleDivider />
        </motion.div>

        {/* ── Venue Tab Switcher (Wedding / Reception) ── */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => { setActiveVenueIdx(i); setActiveSubSection("map"); }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeVenueIdx === i ? "var(--wedding-accent)" : "var(--wedding-card-bg)",
                color: activeVenueIdx === i ? "#fff" : "var(--wedding-text)",
                border: `1px solid ${activeVenueIdx === i ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                boxShadow: activeVenueIdx === i ? "0 3px 16px rgba(176,132,72,0.22)" : "none",
              }}
              data-testid={`venue-tab-${i}`}
            >
              <MapPin size={14} />
              {venueLabels[i]}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeVenueIdx === i ? "rgba(255,255,255,0.2)" : "rgba(176,132,72,0.10)",
                  color: activeVenueIdx === i ? "#fff" : "var(--wedding-accent)",
                }}
              >
                {venueCities[i]}
              </span>
            </button>
          ))}
        </div>

        {/* ── Sub-Section Tab Buttons ── */}
        <div className="flex gap-2 justify-center mb-7 flex-wrap">
          {subTabs.map(({ id, label, icon: SubIcon }) => (
            <button
              key={id}
              onClick={() => setActiveSubSection(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeSubSection === id ? "rgba(176,132,72,0.15)" : "var(--wedding-card-bg)",
                color: activeSubSection === id ? "var(--wedding-accent)" : "var(--wedding-muted)",
                border: `1px solid ${activeSubSection === id ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                fontWeight: activeSubSection === id ? 600 : 400,
              }}
              data-testid={`venue-sub-${id}`}
            >
              <SubIcon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeVenueIdx}-${activeSubSection}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeVenue ? (
              <div
                className="rounded-2xl p-5 sm:p-6"
                style={{
                  background: "var(--wedding-card-bg)",
                  border: "1px solid var(--wedding-border)",
                  boxShadow: "0 4px 20px rgba(46,43,39,0.07)",
                }}
              >
                {/* Venue name + address header */}
                <div className="mb-4">
                  <p className="font-serif text-lg font-semibold mb-1" style={{ color: "var(--wedding-text)" }}>
                    {activeVenue.name}
                  </p>
                  <p className="text-sm flex items-start gap-2" style={{ color: "var(--wedding-muted)" }}>
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--wedding-accent)" }} />
                    {activeVenue.address}
                  </p>
                </div>

                <div className="h-px mb-4" style={{ background: "var(--wedding-border)" }} />

                {/* ── Venue Map tab ── */}
                {activeSubSection === "map" && (
                  <div>
                    {activeVenue.mapEmbedUrl && (
                      <div className="rounded-xl overflow-hidden mb-4 border" style={{ borderColor: "var(--wedding-border)" }}>
                        <iframe
                          src={activeVenue.mapEmbedUrl}
                          width="100%"
                          height="240"
                          style={{ border: 0, display: "block" }}
                          allowFullScreen
                          loading="lazy"
                          title={`Map - ${activeVenue.name}`}
                        />
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {activeVenue.mapUrl && (
                        <a
                          href={activeVenue.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-85"
                          style={{ background: "var(--wedding-accent)", color: "#fff" }}
                        >
                          <Navigation size={12} /> Get Directions
                        </a>
                      )}
                      {activeVenue.contactInfo && (
                        <a
                          href={`tel:${activeVenue.contactInfo.replace(/\D/g, "")}`}
                          className="inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-85"
                          style={{ background: "var(--wedding-card-bg)", color: "var(--wedding-text)", border: "1px solid var(--wedding-border)" }}
                        >
                          <Phone size={12} /> Call for Help
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Accommodation tab ── */}
                {activeSubSection === "stay" && (
                  <div>
                    {activeVenue.accommodation ? (
                      <div
                        className="rounded-xl p-4 text-sm leading-[1.8] whitespace-pre-line"
                        style={{ background: "rgba(176,132,72,0.05)", border: "1px solid var(--wedding-border)", color: "var(--wedding-muted)" }}
                      >
                        {activeVenue.accommodation}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                        Accommodation details will be shared soon. Please contact us for suggestions.
                      </p>
                    )}
                  </div>
                )}

                {/* ── How to Reach tab ── */}
                {activeSubSection === "reach" && (
                  <div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {travelModes.map(({ icon: ModeIcon, label }) => (
                        <div
                          key={label}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                          style={{ background: "rgba(176,132,72,0.08)", border: "1px solid var(--wedding-border)", color: "var(--wedding-muted)" }}
                        >
                          <ModeIcon size={12} style={{ color: "var(--wedding-accent)" }} />
                          {label}
                        </div>
                      ))}
                    </div>
                    {activeVenue.directions ? (
                      <div
                        className="rounded-xl p-4 text-sm leading-[1.85] whitespace-pre-line"
                        style={{ background: "rgba(176,132,72,0.05)", border: "1px solid var(--wedding-border)", color: "var(--wedding-muted)" }}
                      >
                        {activeVenue.directions}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                        Travel details coming soon. Feel free to reach out for directions.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Placeholder when venue data not yet added to DB */
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "var(--wedding-card-bg)", border: "1px dashed var(--wedding-border)" }}
              >
                <Building size={28} className="mx-auto mb-3" style={{ color: "var(--wedding-muted)", opacity: 0.5 }} />
                <p className="font-serif text-base mb-1" style={{ color: "var(--wedding-text)" }}>
                  {venueLabels[activeVenueIdx]} Venue
                </p>
                <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                  Details for the {venueCities[activeVenueIdx]} venue will be announced shortly.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

const publicRsvpFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20),
  childrenCount: z.number().int().min(0).max(20),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"], {
    errorMap: () => ({ message: "Please select your food preference" }),
  }).optional(),
  eventsAttending: z.array(z.string()).default([]),
  dietaryRequirements: z.string().max(500),
  message: z.string().max(1000),
  side: z.enum(["groom", "bride", "both"]),
}).refine(
  (data) => {
    if (data.rsvpStatus === "confirmed") {
      return data.eventsAttending.length > 0;
    }
    return true;
  },
  {
    message: "Please select at least one event to attend",
    path: ["eventsAttending"],
  }
).refine(
  (data) => {
    if (data.rsvpStatus === "confirmed") {
      return !!data.foodPreference;
    }
    return true;
  },
  {
    message: "Please select your food preference",
    path: ["foodPreference"],
  }
);
type PublicRsvpForm = z.infer<typeof publicRsvpFormSchema>;

function RsvpSection({ events }: { events: WeddingEvent[] }) {
  const { toast } = useToast();
  const { side, setSide } = useWeddingTheme();
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string>("");
  const [checkingName, setCheckingName] = useState(false);
  const [foundGuests, setFoundGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [showGuestSelectionPopup, setShowGuestSelectionPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<PublicRsvpForm>({
    resolver: zodResolver(publicRsvpFormSchema),
    defaultValues: {
      name: "",
      rsvpStatus: undefined as any,
      adultsCount: 1,
      childrenCount: 0,
      foodPreference: "" as any,
      eventsAttending: [],
      dietaryRequirements: "",
      message: "",
      side: side as "groom" | "bride" | "both",
    },
  });

  // Update side field when theme changes
  useEffect(() => {
    form.setValue("side", side as "groom" | "bride" | "both");
  }, [side, form]);

  // Check for existing guest by name
  const checkExistingGuest = async (name: string) => {
    if (!name || name.length < 3) return;

    setCheckingName(true);
    try {
      const res = await apiRequest("GET", `/api/guests/by-name?name=${encodeURIComponent(name)}`);
      if (res.ok) {
        const guestList = await res.json();
        // Show selection popup if any guests found (even if just 1)
        if (Array.isArray(guestList) && guestList.length > 0) {
          setFoundGuests(guestList);
          setShowGuestSelectionPopup(true);
        } else {
          // No guests found - continue with normal flow
          setFoundGuests([]);
        }
      } else {
        // Name not in database - continue with normal flow
        setFoundGuests([]);
      }
    } catch (err) {
      console.error("Error checking guest:", err);
      setFoundGuests([]);
    } finally {
      setCheckingName(false);
    }
  };

  const selectAndConfirmGuest = (guest: any) => {
    if (!guest) return;

    // Switch side if guest is on different side
    if (guest.side && guest.side !== side && guest.side !== "both") {
      setSide(guest.side);
    }

    // Pre-fill form with existing data
    setIsUpdating(true);
    setSelectedGuest(guest);
    form.setValue("name", guest.name);
    form.setValue("rsvpStatus", guest.rsvpStatus);
    form.setValue("adultsCount", guest.adultsCount || 1);
    form.setValue("childrenCount", guest.childrenCount || 0);
    form.setValue("foodPreference", guest.foodPreference || "");
    form.setValue(
      "eventsAttending",
      Array.isArray(guest.eventsAttending)
        ? guest.eventsAttending
        : []
    );
    form.setValue("dietaryRequirements", guest.dietaryRequirements || "");
    form.setValue("message", guest.message || "");

    setShowGuestSelectionPopup(false);

    toast({
      title: "Welcome back!",
      description: "You can update your name, events and food preferences below.",
    });
  };

  const continueAsNewGuest = () => {
    setFoundGuests([]);
    setSelectedGuest(null);
    setShowGuestSelectionPopup(false);
    // Keep the name but allow new RSVP
  };

  const rsvpMutation = useMutation({
    mutationFn: async (data: PublicRsvpForm) => {
      // If updating existing guest, use their ID
      if (isUpdating && selectedGuest) {
        const res = await apiRequest("POST", "/api/rsvp", { ...data, slug: selectedGuest.inviteSlug });
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/rsvp/public", data);
        return res.json();
      }
    },
    onSuccess: (result) => {
      // Show appropriate success message
      if (result.rsvpStatus === "confirmed") {
        toast({
          title: "RSVP Confirmed! 🎉",
          description: "We look forward to seeing you at the celebration!",
          duration: 5000,
        });
      } else {
        toast({
          title: "Thank You",
          description: "We appreciate you letting us know.",
          duration: 5000,
        });
      }

      // Reset all states
      setIsUpdating(false);
      setFoundGuests([]);
      setSelectedGuest(null);

      // Reset form to defaults - no pre-selected RSVP status
      form.reset({
        name: "",
        rsvpStatus: undefined as any,
        adultsCount: 1,
        childrenCount: 0,
        foodPreference: "" as any,
        eventsAttending: [],
        dietaryRequirements: "",
        message: "",
        side: side as "groom" | "bride" | "both",
      });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const rsvpStatus = form.watch("rsvpStatus");

  return (
    <section id="rsvp" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-bg)" }} data-testid="rsvp-section">
      <div className="max-w-lg mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            RSVP
          </h2>
          <SimpleDivider />
          <p className="text-sm mt-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            We would be honoured to have you celebrate with us. Please let us know if you can make it.
          </p>
        </motion.div>

        <motion.form
          className="rounded-xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6"
          style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={form.handleSubmit((data) => rsvpMutation.mutate(data))}
          data-testid="rsvp-form"
        >
          <div>
            <label className="text-xs tracking-[0.15em] uppercase mb-3 block" style={{ color: "var(--wedding-accent)" }}>
              Will you be attending?
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              {(["confirmed", "declined"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    form.setValue("rsvpStatus", status);
                    if (status === "declined") {
                      form.setValue("eventsAttending", []);
                      form.setValue("foodPreference", undefined);
                    }
                  }}
                  className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: rsvpStatus === status ? "var(--wedding-accent)" : "transparent",
                    color: rsvpStatus === status ? "#fff" : "var(--wedding-text)",
                    border: `1px solid ${rsvpStatus === status ? "var(--wedding-accent)" : "var(--wedding-border)"}`
                  }}
                  data-testid={`rsvp-${status}`}
                >
                  {status === "confirmed" ? "Joyfully Accept" : "Respectfully Decline"}
                </button>
              ))}
            </div>
          </div>

          {rsvpStatus && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...form.register("name")}
                    onBlur={(e) => checkExistingGuest(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                    style={{
                      background: "var(--wedding-bg)",
                      border: "1px solid var(--wedding-border)",
                      color: "var(--wedding-text)",
                    }}
                    data-testid="input-name"
                  />
                  {checkingName && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "var(--wedding-accent)" }}>
                      <Loader2 className="animate-spin" size={12} /> Checking details...
                    </p>
                  )}
                  {isUpdating && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#22c55e" }}>
                      <Check size={12} /> Updating existing RSVP
                    </p>
                  )}
                  {form.formState.errors.name && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.name.message}</p>
                  )}
                </div>
              </div>

              {rsvpStatus === "confirmed" && events.length > 0 && (
                <div>
                  <label className="text-xs tracking-wide uppercase mb-2 block" style={{ color: "var(--wedding-accent)" }}>
                    Events Attending *
                  </label>
                  <div className="space-y-2">
                    {events.map((ev) => {
                      const attending = form.watch("eventsAttending") || [];
                      const isSelected = attending.includes(ev.id);
                      return (
                        <label
                          key={ev.id}
                          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                          style={{
                            background: isSelected ? "var(--wedding-accent)" : "transparent",
                            color: isSelected ? "#fff" : "var(--wedding-text)",
                            border: `1px solid ${isSelected ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                          }}
                          data-testid={`event-select-${ev.id}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const current = form.getValues("eventsAttending") || [];

                              const next = isSelected
                                ? current.filter((id) => id !== ev.id)
                                : [...current, ev.id];

                              form.setValue("eventsAttending", next, { shouldValidate: true });
                            }}
                            className="sr-only"
                          />
                          <span className="text-sm">{ev.title}</span>
                          <span className="text-[10px] ml-auto opacity-70">
                            {new Date(ev.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {form.formState.errors.eventsAttending && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.eventsAttending.message}</p>
                  )}
                </div>
              )}

              {rsvpStatus === "confirmed" && (
                <>
                  <div>
                    <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                      Food Preference *
                    </label>
                    <select
                      {...form.register("foodPreference")}
                      className="w-full px-4 py-2.5 rounded-lg text-sm"
                      style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                      data-testid="select-food"
                    >
                      <option value="">Select your preference</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                    </select>
                    {form.formState.errors.foodPreference && (
                      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.foodPreference.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                      Dietary Requirements (optional)
                    </label>
                    <input
                      type="text"
                      {...form.register("dietaryRequirements")}
                      placeholder="Any allergies or special requirements"
                      className="w-full px-4 py-2.5 rounded-lg text-sm"
                      style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                      data-testid="input-dietary"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                  Personal Message (optional)
                </label>
                <textarea
                  {...form.register("message")}
                  rows={3}
                  placeholder="Share your wishes for the couple..."
                  className="w-full px-4 py-2.5 rounded-lg text-sm resize-none"
                  style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                  data-testid="input-message"
                />
              </div>

              <button
                type="submit"
                disabled={rsvpMutation.isPending}
                className="w-full py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--wedding-accent)", color: "#fff" }}
                data-testid="submit-rsvp"
              >
                {rsvpMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Submit RSVP"
                )}
              </button>
            </>
          )}
        </motion.form>

        {/* Guest Selection Popup */}
        <AnimatePresence>
          {showGuestSelectionPopup && foundGuests.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowGuestSelectionPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
                style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              >
                <div className="text-center mb-4">
                  <Heart className="mx-auto mb-3" size={40} style={{ color: "var(--wedding-accent)" }} />
                  <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: "var(--wedding-text)" }}>
                    Welcome Back!
                  </h3>
                  <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                    {foundGuests.length === 1
                      ? "We found an existing RSVP matching your name"
                      : `We found ${foundGuests.length} existing RSVPs matching your name`}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {foundGuests.map((guest) => {
                    // Get event names from IDs
                    const guestEventNames = Array.isArray(guest.eventsAttending)
                      ? guest.eventsAttending
                          .map((eventId: string) => events.find((ev) => ev.id === eventId)?.title)
                          .filter(Boolean)
                      : [];

                    return (
                      <button
                        key={guest.id}
                        onClick={() => selectAndConfirmGuest(guest)}
                        className="w-full text-left rounded-lg p-4 transition-all hover:scale-[1.02]"
                        style={{
                          background: "var(--wedding-bg)",
                          border: "1px solid var(--wedding-border)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm" style={{ color: "var(--wedding-text)" }}>
                              {guest.name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "var(--wedding-muted)" }}>
                              {guest.rsvpStatus === "confirmed" ? "✓ Confirmed" : "✗ Declined"}
                            </p>
                          </div>
                          <div
                            className="px-2 py-1 rounded text-[10px] uppercase tracking-wide flex-shrink-0"
                            style={{
                              background: guest.side === "groom"
                                ? "rgba(185, 151, 91, 0.2)"
                                : guest.side === "bride"
                                ? "rgba(198, 167, 94, 0.2)"
                                : "rgba(200, 200, 200, 0.2)",
                              color: "var(--wedding-accent)"
                            }}
                          >
                            {guest.side === "groom" ? "Groom" : guest.side === "bride" ? "Bride" : "Both"}
                          </div>
                        </div>

                        {guestEventNames.length > 0 && (
                          <div className="text-xs mt-2" style={{ color: "var(--wedding-muted)" }}>
                            <p className="font-medium mb-1" style={{ color: "var(--wedding-accent)" }}>Events Attending:</p>
                            <div className="flex flex-wrap gap-1">
                              {guestEventNames.map((eventName: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded font-medium"
                                  style={{
                                    background: "var(--wedding-accent)",
                                    color: "#ffffff",
                                    fontSize: "11px"
                                  }}
                                >
                                  {eventName}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs mb-4 text-center" style={{ color: "var(--wedding-muted)" }}>
                  Select your name to update your RSVP, or continue as a new guest
                </p>

                <button
                  onClick={continueAsNewGuest}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: "transparent",
                    color: "var(--wedding-text)",
                    border: "1px solid var(--wedding-border)",
                  }}
                >
                  Continue as New Guest
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function getWardrobeTip(title: string, dressCode: string | null | undefined): {
  style: string; desc: string; tip: string; footwear: string;
} {
  const t = title.toLowerCase();
  if (t.includes("haldi")) return {
    style: "Sunlit Traditional",
    desc: dressCode || "Bright yellows & greens — airy and full of life.",
    tip: "A light Anarkali or comfortable Kurta set is perfect. Choose breathable cotton or linen fabrics — you'll be seated for a while.",
    footwear: "Flats or Juttis — easy to remove for the rituals.",
  };
  if (t.includes("sangeet")) return {
    style: "Festive Evening Glam",
    desc: dressCode || "Bold, shimmery, and made for dancing all night.",
    tip: "A vibrant Lehenga, Indo-western fusion, or a sharply-cut Sherwani works beautifully. Make sure you can move freely!",
    footwear: "Block heels or Mojari — stylish yet stable on the dance floor.",
  };
  if (t.includes("engagement")) return {
    style: "Festive & Celebratory",
    desc: dressCode || "Bright, cheerful attire for a joyous occasion.",
    tip: "Opt for vibrant Indian formals. Semi-formal Indian wear works well — think Lehenga, co-ord sets, or a smart Kurta.",
    footwear: "Block heels, Juttis, or dress flats.",
  };
  if (t.includes("reception")) return {
    style: "Black-tie Indian Elegance",
    desc: dressCode || "Formal, richly embellished, and statement-worthy.",
    tip: "A designer saree, embellished Lehenga, or a formal Sherwani with accessories. This is the evening to truly shine.",
    footwear: "Embellished heels or Nagra shoes — polished and formal.",
  };
  if (t.includes("vidai")) return {
    style: "Elegant & Emotional",
    desc: dressCode || "Grace and tradition for a touching farewell.",
    tip: "Traditional attire befitting a meaningful ceremony. Subtle, elegant colours are preferred over very bright ones.",
    footwear: "Comfortable flats or traditional footwear.",
  };
  if (t.includes("wedding") || t.includes("ceremony") || t.includes("biye")) return {
    style: "Elegant Traditional Wear",
    desc: dressCode || "Modest and comfortable for the holy ceremony.",
    tip: "Traditional attire — silk saree with heavy border, or a dhoti-kurta. Expect long rituals while seated; comfort is key.",
    footwear: "Comfortable flats or Juttis — rituals require removing footwear.",
  };
  return {
    style: dressCode ?? "Smart Indian Formals",
    desc: dressCode ?? "Dress elegantly for the occasion.",
    tip: `Follow the dress code: ${dressCode ?? "Indian formals"}. When in doubt, err on the side of traditional.`,
    footwear: "Comfortable footwear appropriate for the event.",
  };
}

function WardrobePlannerSection({ events }: { events: WeddingEvent[] }) {
  const [activeTip, setActiveTip] = useState<number | null>(null);

  const wardrobeItems = events.map((ev) => {
    const { style, desc, tip, footwear } = getWardrobeTip(ev.title, ev.dressCode);
    const date = new Date(ev.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return {
      id: ev.id,
      event: ev.title,
      date,
      icon: getEventIcon(ev.title),
      style,
      desc,
      tip,
      footwear,
    };
  });

  return (
    <section id="wardrobe" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-bg)" }} data-testid="wardrobe-section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <Shirt size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Dress to Impress
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Wardrobe Planner
          </h2>
          <SimpleDivider />
          <p className="text-xs mt-4" style={{ color: "var(--wedding-muted)" }}>
            Tap the <Info size={11} className="inline mx-0.5" style={{ color: "var(--wedding-accent)" }} /> for squad style tips
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {wardrobeItems.map((item, idx) => {
            const ItemIcon = item.icon;
            const isOpen = activeTip === idx;
            return (
              <motion.div
                key={item.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--wedding-card-bg)",
                  border: "1px solid var(--wedding-border)",
                  boxShadow: isOpen ? "0 4px 20px rgba(46,43,39,0.08)" : "0 1px 6px rgba(46,43,39,0.04)",
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
              >
                {/* Card header row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  {/* Event icon */}
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                  >
                    <ItemIcon size={16} style={{ color: "var(--wedding-accent)" }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--wedding-accent)", opacity: 0.7 }}>
                      {item.event} · {item.date}
                    </p>
                    <p className="font-serif text-sm font-semibold truncate" style={{ color: "var(--wedding-text)" }}>
                      {item.style}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--wedding-muted)" }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Info button */}
                  <button
                    onClick={() => setActiveTip(isOpen ? null : idx)}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isOpen ? "var(--wedding-accent)" : "rgba(176,132,72,0.10)",
                      border: "1px solid var(--wedding-border)",
                      color: isOpen ? "#fff" : "var(--wedding-accent)",
                    }}
                    aria-label="Show style tip"
                  >
                    <Info size={13} />
                  </button>
                </div>

                {/* Expanded tip panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pt-0 pb-4 text-xs space-y-3"
                        style={{ borderTop: "1px solid var(--wedding-border)" }}
                      >
                        <div className="pt-3">
                          <p className="font-semibold mb-1 flex items-center gap-1.5" style={{ color: "var(--wedding-accent)" }}>
                            <Users size={11} /> Squad Style Tip
                          </p>
                          <p className="leading-[1.75]" style={{ color: "var(--wedding-muted)" }}>{item.tip}</p>
                        </div>
                        <div
                          className="rounded-lg px-3 py-2"
                          style={{ background: "rgba(176,132,72,0.06)", border: "1px solid rgba(176,132,72,0.15)" }}
                        >
                          <p className="font-semibold mb-0.5 flex items-center gap-1.5" style={{ color: "var(--wedding-accent)" }}>
                            <Navigation size={11} /> Recommended Footwear
                          </p>
                          <p style={{ color: "var(--wedding-muted)" }}>{item.footwear}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          className="text-center text-xs mt-6"
          style={{ color: "var(--wedding-muted)", opacity: 0.65 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.65 }}
          viewport={{ once: true }}
        >
          These are friendly suggestions — wear what makes you comfortable and confident!
        </motion.p>
      </div>
    </section>
  );
}

function FindByInviteSection() {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);

  const handleSearch = async () => {
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
  };

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
            Search your name to see your guest invite status
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
          <button
            onClick={handleSearch}
            disabled={searching || query.trim().length < 2}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            style={{ background: "var(--wedding-accent)", color: "#fff" }}
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
                We couldn't find your name in our guest list.
              </p>
              <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                Please contact us if you believe this is an error.
              </p>
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
                Found {results!.length} guest{results!.length > 1 ? "s" : ""} — tap to see your invite
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
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--wedding-card-bg)", border: "2px solid var(--wedding-accent)", boxShadow: "0 8px 40px rgba(176,132,72,0.18)" }}
            >
              {/* Gold top bar */}
              <div className="h-[4px]" style={{
                background: "linear-gradient(90deg, transparent, var(--wedding-accent) 40%, var(--wedding-accent) 60%, transparent)"
              }} />

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
                  onClick={() => { setSelectedGuest(null); setQuery(""); setResults(null); }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "transparent", color: "var(--wedding-accent)", border: "1px solid var(--wedding-border)" }}
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
          <button
            onClick={() => {
              const el = document.getElementById("rsvp");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", window.location.pathname);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "none", border: "none", color: "var(--wedding-accent)", borderBottom: "1px solid var(--wedding-accent)", cursor: "pointer" }}
          >
            Skip to RSVP <ChevronRight size={11} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function FaqsSection({ faqList }: { faqList: Faq[] }) {
  if (faqList.length === 0) return null;

  return (
    <section id="faqs" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-alt-bg)" }} data-testid="faqs-section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Frequently Asked Questions
          </h2>
          <SimpleDivider />
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqList.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="rounded-lg px-6 overflow-hidden"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              data-testid={`faq-item-${faq.id}`}
            >
              <AccordionTrigger className="text-left font-serif text-sm sm:text-base py-4" style={{ color: "var(--wedding-text)" }}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed pb-4" style={{ color: "var(--wedding-muted)" }}>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "var(--wedding-bg)" }}
      data-testid="footer"
    >
      {/* Top gold line */}
      <div className="h-px" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--wedding-accent) 50%, transparent 100%)",
        opacity: 0.35
      }} />

      <div className="max-w-md mx-auto px-4 py-12 text-center">
        {/* Golden heart icon */}
        <div className="flex justify-center mb-5">
          <Heart
            size={32}
            fill="var(--wedding-accent)"
            style={{ color: "var(--wedding-accent)", filter: "drop-shadow(0 2px 8px rgba(176,132,72,0.35))" }}
          />
        </div>

        {/* Names */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide mb-2" style={{ color: "var(--wedding-text)" }}>
          Himasree &amp; Kaustav
        </h3>

        <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--wedding-muted)", opacity: 0.7 }}>
          December 2026 &middot; Kolkata
        </p>

        <div className="h-px mx-auto max-w-[80px] mb-6" style={{ background: "linear-gradient(90deg, transparent, var(--wedding-accent), transparent)" }} />

        <p className="text-[11px] tracking-widest uppercase" style={{ color: "var(--wedding-muted)", opacity: 0.5 }}>
          Made with love &amp; blessings &middot; © 2026
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  const { setMusicUrl, fadeIn, stop, setOnTrackEnd } = useMusic();
  const { setSide, side } = useWeddingTheme();

  const [showCrest, setShowCrest] = useState(true);
  const [sideSelected, setSideSelected] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentPlaylistRef = useRef<string[]>([]);

  /* ================= CHECK SAVED SIDE PREFERENCE ================= */

  useEffect(() => {
    // Restore the theme so the crest/data loads with the right colours,
    // but never skip the crest — it always plays on every load / refresh.
    const savedSide = localStorage.getItem('wedding-side-preference');
    if (savedSide === 'groom' || savedSide === 'bride') {
      setSide(savedSide);
    }
  }, []);

  /* ================= SINGLE PUBLIC QUERY ================= */

  const { data, isLoading } = useQuery({
    queryKey: ["public-home", side],
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/public/home?side=${side}`
      );
      return res.json();
    },
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const config = data?.config;
  const isDateConfirmed = !!config?.weddingDate;
  const events = data?.events ?? [];
  const milestones = data?.stories ?? [];
  const venueList = data?.venues ?? [];
  const faqList = data?.faqs ?? [];

  /* ================= FETCH ALL EVENTS FOR RSVP FORM ================= */

  const { data: allEventsData } = useQuery({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/events");
      return res.json();
    },
    staleTime: 5 * 1000,
  });

  const allEvents = allEventsData ?? [];

  /* ================= MUSIC SETUP ================= */

  const playlist = useMemo(() => {
    if (!config) return [];

    if (side === "groom" && config.groomMusicUrls?.length) {
      return config.groomMusicUrls.filter(Boolean).map((track: any) =>
        typeof track === 'object' ? track.url : track
      ).filter(Boolean);
    }

    if (side === "bride" && config.brideMusicUrls?.length) {
      return config.brideMusicUrls.filter(Boolean).map((track: any) =>
        typeof track === 'object' ? track.url : track
      ).filter(Boolean);
    }

    if (config.backgroundMusicUrl) {
      return [config.backgroundMusicUrl];
    }

    return [];
    // if (!config) return;

    // let playlist: string[] = [];

    // if (side === "groom" && config.groomMusicUrls?.length) {
    //   playlist = config.groomMusicUrls.filter(Boolean);
    // } else if (side === "bride" && config.brideMusicUrls?.length) {
    //   playlist = config.brideMusicUrls.filter(Boolean);
    // } else if (config.backgroundMusicUrl) {
    //   playlist = [config.backgroundMusicUrl];
    // }

    // currentPlaylistRef.current = playlist;
    // setCurrentTrackIndex(0);

    // if (playlist.length > 0) {
    //   stop();
    //   setMusicUrl(playlist[0]);

    //   if (sealOpened) {
    //     setTimeout(() => fadeIn(), 300);
    //   }
    // }
  }, [config, side]);
  /* ================= APPLY PLAYLIST WHEN IT CHANGES ================= */

  useEffect(() => {
    if (!playlist.length || !sideSelected) return;

    currentPlaylistRef.current = playlist;
    setCurrentTrackIndex(0);

    stop();
    setMusicUrl(playlist[0]);

    // Fade in music 1 second after side selection
    setTimeout(() => {
      fadeIn();
    }, 1000);
  }, [playlist, sideSelected, stop, setMusicUrl, fadeIn]);

  /* ================= AUTO NEXT TRACK ================= */

  useEffect(() => {
    const handleEnded = () => {
      const playlist = currentPlaylistRef.current;
      if (playlist.length <= 1) return;

    //   const nextIndex = (currentTrackIndex + 1) % playlist.length;
    //   setCurrentTrackIndex(nextIndex);
    //   setMusicUrl(playlist[nextIndex]);

    //   setTimeout(() => fadeIn(), 100);
    // };

    // setOnTrackEnd(handleEnded);
    // return () => setOnTrackEnd(null);
    setCurrentTrackIndex((prev) => {
        const next = (prev + 1) % playlist.length;
        setMusicUrl(playlist[next]);
        fadeIn();
        return next;
      });
    };

    setOnTrackEnd(handleEnded);
    return () => setOnTrackEnd(null);
  }, [ setMusicUrl, fadeIn, setOnTrackEnd]);

  /* ================= VIEW COUNT ================= */

  useEffect(() => {
    const hasIncremented = sessionStorage.getItem("view_counted");
    if (!hasIncremented) {
      apiRequest("POST", "/api/increment-view").catch(() => {});
      sessionStorage.setItem("view_counted", "true");
    }
  }, []);

  /* ================= MUSIC STARTS ON SIDE SELECTION ================= */

  /* ================= CONDITIONAL RENDERS ================= */

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--wedding-bg)" }}
      >
        <KHCrest size={80} className="animate-pulse" />
      </div>
    );
  }

  if (!config) return null;

  /* ================= ENTRANCE SEQUENCE + MAIN (AnimatePresence fade transitions) ================= */

  const handleCrestFinish = () => {
    setShowCrest(false);
    const savedSide = localStorage.getItem('wedding-side-preference');
    if (savedSide === 'groom' || savedSide === 'bride') {
      setSideSelected(true);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showCrest ? (
        <CrestIntro key="crest" onFinish={handleCrestFinish} />
      ) : !sideSelected ? (
        <SideSelectionLanding
          key="selection"
          onSelectSide={(selectedSide) => {
            setSide(selectedSide);
            localStorage.setItem('wedding-side-preference', selectedSide);
            setSideSelected(true);
          }}
        />
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <Header />

          <ViewingSideOverlay
            onBackToSelection={() => {
              stop();
              localStorage.removeItem('wedding-side-preference');
              setShowCrest(false);
              setSideSelected(false);
            }}
            onSideChange={(newSide) => {
              setSide(newSide);
              localStorage.setItem('wedding-side-preference', newSide);
            }}
          />

          <main>
            <HeroSection config={config} isDateConfirmed={isDateConfirmed} />
            <FindByInviteSection />
            <EventsSection events={events} />
            <VenueSection venueList={venueList} />
            <WardrobePlannerSection events={allEvents} />
            <StorySection milestones={milestones} />
            <RsvpSection events={allEvents} />
            <FaqsSection faqList={faqList} />
            <FooterSection />
          </main>

          <FloatingContact />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
