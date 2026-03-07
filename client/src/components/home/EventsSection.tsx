import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, ExternalLink, Shirt
} from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { ThinGoldDivider } from "../RoyalOrnaments";
import { useWeddingTheme } from "@/context/ThemeContext";
import { getEventIcon } from "@/lib/weddingUtils";
import type { WeddingEvent } from "../../../../shared/schema.js";

const EventsSection = React.memo(({ events }: { events: WeddingEvent[] }) => {
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
            Celebrate With Us
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
                  background: active === date ? "var(--wedding-accent)" : "var(--wedding-card-bg)",
                  color: active === date ? "var(--wedding-bg)" : "var(--wedding-text)",
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
                            style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
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
});

export default EventsSection;
