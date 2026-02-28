import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, ChevronDown, ChevronRight, Heart, ExternalLink, Loader2, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { Countdown } from "@/components/Countdown";
import KHCrest from "@/components/KHCrest";
import WaxSealIntro from "@/components/WaxSealIntro";
import Header from "@/components/Header";
import SideSelectionLanding from "@/components/SideSelectionLanding";
import ViewingSideOverlay from "@/components/ViewingSideOverlay";
import { useSeal } from "@/context/SealContext";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FloatingContact from "@/components/FloatingContact";
import { MandalaHalfOrnament, GoldMedallion, ThinGoldDivider, RoyalFrame } from "@/components/RoyalOrnaments";
import type { WeddingConfig, WeddingEvent, StoryMilestone, Venue, Faq } from "../../../shared/schema.js";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <div className="gold-divider flex-1 max-w-[80px]" />
      <KHCrest size={40} />
      <div className="gold-divider flex-1 max-w-[80px]" />
    </div>
  );
}

function HeroSection({ config }: { config: WeddingConfig }) {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative pt-14 overflow-hidden"
      style={{ background: "var(--wedding-hero-gradient)" }}
      data-testid="hero-section"
    >
      {/* Mandala ornaments on sides */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 opacity-20 pointer-events-none">
        <MandalaHalfOrnament side="left" />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-48 md:w-64 opacity-20 pointer-events-none">
        <MandalaHalfOrnament side="right" />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="text-center z-10 px-4 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* Central medallion above names */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
          >
            <GoldMedallion size={100} />
          </motion.div>
        </div>

        <p
          className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
          style={{ color: "var(--wedding-muted)" }}
        >
          The Wedding Celebration of
        </p>

        <h1
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold mb-2"
          style={{ color: "var(--wedding-text)" }}
          data-testid="hero-title"
        >
          Himasree
        </h1>
        <div className="flex items-center justify-center gap-4 my-3">
          <div className="gold-divider w-16" />
          <span
            className="font-serif text-2xl italic"
            style={{ color: "var(--wedding-accent)" }}
          >
            &amp;
          </span>
          <div className="gold-divider w-16" />
        </div>
        <h1
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold mb-8"
          style={{ color: "var(--wedding-text)" }}
        >
          Kaustav
        </h1>

        <GoldDivider />

        <div className="mt-8">
          {config.weddingDate && config.dateConfirmed ? (
            <>
              <p
                className="font-serif text-lg sm:text-xl mb-6"
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
        </div>

        {config.venueName && (
          <motion.p
            className="mt-8 flex items-center justify-center gap-2 text-sm"
            style={{ color: "var(--wedding-muted)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <MapPin size={14} />
            {config.venueName}, Kolkata
          </motion.p>
        )}
      </motion.div>

      <motion.div
        className="absolute bottom-8 animate-bounce"
        style={{ color: "var(--wedding-accent)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

function StorySection({ milestones }: { milestones: StoryMilestone[] }) {
  if (milestones.length === 0) return null;

  return (
    <section id="story" className="wedding-section relative overflow-hidden" style={{ background: "var(--wedding-bg)" }} data-testid="story-section">
      {/* Decorative mandala ornaments */}
      <div className="absolute top-20 left-0 w-48 md:w-64 opacity-10 pointer-events-none">
        <MandalaHalfOrnament side="left" />
      </div>
      <div className="absolute bottom-20 right-0 w-48 md:w-64 opacity-10 pointer-events-none">
        <MandalaHalfOrnament side="right" />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Our Story
          </h2>
          <GoldDivider />
        </motion.div>

        <div className="relative">
          {/* Central ornate timeline */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block ornate-divider" />

          {milestones.map((milestone, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <motion.div
                key={milestone.id}
                className={`flex items-start gap-8 mb-12 sm:mb-16 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"} flex-col sm:flex-row`}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                data-testid={`story-milestone-${milestone.id}`}
              >
                <div className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}>
                  <div className="royal-panel rounded-lg p-6">
                    {milestone.imageUrl && (
                      <img
                        src={milestone.imageUrl}
                        alt={milestone.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 border border-[var(--wedding-border)]"
                        loading="lazy"
                      />
                    )}
                    <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: "var(--wedding-text)" }}>
                      {milestone.title}
                    </h3>
                    <p className="text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--wedding-accent)" }}>
                      {milestone.date}
                    </p>
                    <ThinGoldDivider className="my-3" />
                    <p className="text-sm leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-center z-10">
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: "var(--wedding-accent)",
                      background: "var(--wedding-bg)",
                      boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)"
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--wedding-accent)]" />
                  </div>
                </div>
                <div className="flex-1 hidden sm:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function EventsSection({ events }: { events: WeddingEvent[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { side } = useWeddingTheme();

  // Filter events based on current theme side
  const filteredEvents = events.filter(event => {
    if (!event.side || event.side === 'both') return true;
    return event.side === side;
  });

  if (filteredEvents.length === 0) return null;

  const dateMap = new Map<string, WeddingEvent[]>();
  filteredEvents.forEach((ev) => {
    const dateStr = new Date(ev.startTime).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    if (!dateMap.has(dateStr)) dateMap.set(dateStr, []);
    dateMap.get(dateStr)!.push(ev);
  });

  const dates = Array.from(dateMap.keys());
  const active = selectedDate || dates[0] || null;
  const activeEvents = active ? dateMap.get(active) || [] : [];

  return (
    <section id="events" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="events-section">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Wedding Events
          </h2>
          <GoldDivider />
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 justify-center flex-wrap" data-testid="event-date-timeline">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="px-5 py-3 rounded-lg font-serif text-sm whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: active === date ? "var(--wedding-accent)" : "var(--wedding-card-bg)",
                color: active === date ? "#fff" : "var(--wedding-text)",
                border: `1px solid ${active === date ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
              }}
              data-testid={`event-date-${date}`}
            >
              <Calendar size={14} className="inline mr-2" />
              {date}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {activeEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              className="royal-card rounded-xl p-6 sm:p-8 relative"
              style={{
                border: event.isMainEvent
                  ? "2px solid var(--wedding-accent)"
                  : "1px solid var(--wedding-border)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-testid={`event-card-${event.id}`}
            >
              <RoyalFrame>
                {event.isMainEvent && (
                  <div className="flex justify-center mb-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase"
                      style={{ background: "var(--wedding-accent)", color: "#fff" }}
                    >
                      Main Event
                    </span>
                  </div>
                )}
                <h3 className="font-serif text-xl font-semibold mb-3 text-center" style={{ color: "var(--wedding-text)" }}>
                  {event.title}
                </h3>
                <ThinGoldDivider className="mb-4" />
                <p className="text-sm mb-4 leading-relaxed text-center" style={{ color: "var(--wedding-muted)" }}>
                  {event.description}
                </p>
                <div className="space-y-2 text-sm" style={{ color: "var(--wedding-text)" }}>
                  <p className="flex items-center gap-2">
                    <Clock size={14} style={{ color: "var(--wedding-accent)" }} />
                    {new Date(event.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    {event.endTime && ` — ${new Date(event.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} style={{ color: "var(--wedding-accent)" }} />
                    {event.venueName}
                  </p>
                  {event.dressCode && (
                    <p className="text-xs mt-2" style={{ color: "var(--wedding-muted)" }}>
                      Dress Code: {event.dressCode}
                    </p>
                  )}
                </div>

                {(event.howToReach || event.accommodation || event.distanceInfo || event.contactPerson) && (
                  <details className="mt-4">
                    <summary
                      className="text-xs tracking-wide uppercase cursor-pointer flex items-center gap-1"
                      style={{ color: "var(--wedding-accent)" }}
                    >
                      <ChevronRight size={12} />
                      More Details
                    </summary>
                    <div className="mt-3 space-y-2 text-xs" style={{ color: "var(--wedding-muted)" }}>
                      {event.howToReach && <p><strong>How to Reach:</strong> {event.howToReach}</p>}
                      {event.accommodation && <p><strong>Accommodation:</strong> {event.accommodation}</p>}
                      {event.distanceInfo && <p><strong>Distance:</strong> {event.distanceInfo}</p>}
                      {event.contactPerson && <p><strong>Contact:</strong> {event.contactPerson}</p>}
                    </div>
                  </details>
                )}

                <div className="mt-4 flex gap-2">
                  <a
                    href={`/api/events/${event.id}/calendar`}
                    className="text-xs px-3 py-1.5 rounded transition-colors"
                    style={{
                      border: "1px solid var(--wedding-border)",
                      color: "var(--wedding-accent)",
                    }}
                    data-testid={`download-ics-${event.id}`}
                  >
                    <Calendar size={12} className="inline mr-1" />
                    Add to Calendar
                  </a>
                  {event.venueMapUrl && (
                    <a
                      href={event.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded transition-colors"
                      style={{
                        border: "1px solid var(--wedding-border)",
                        color: "var(--wedding-accent)",
                      }}
                      data-testid={`map-link-${event.id}`}
                    >
                      <ExternalLink size={12} className="inline mr-1" />
                      View Map
                    </a>
                  )}
                </div>
              </RoyalFrame>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VenueSection({ venueList }: { venueList: Venue[] }) {
  if (venueList.length === 0) return null;

  return (
    <section id="venue" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="venue-section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Venue & Travel
          </h2>
          <GoldDivider />
        </motion.div>

        {venueList.map((venue) => (
          <motion.div
            key={venue.id}
            className="rounded-xl p-6 sm:p-8 mb-8"
            style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            data-testid={`venue-card-${venue.id}`}
          >
            <h3 className="font-serif text-2xl font-semibold mb-2" style={{ color: "var(--wedding-text)" }}>
              {venue.name}
            </h3>
            <p className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--wedding-muted)" }}>
              <MapPin size={14} /> {venue.address}
            </p>
            {venue.description && (
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--wedding-text)" }}>{venue.description}</p>
            )}

            {venue.mapEmbedUrl && (
              <div className="rounded-lg overflow-hidden mb-6 aspect-video">
                <iframe
                  src={venue.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title={`Map - ${venue.name}`}
                />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
              {venue.directions && (
                <div>
                  <h4 className="font-semibold mb-2 text-xs tracking-[0.15em] uppercase" style={{ color: "var(--wedding-accent)" }}>
                    Travel Directions
                  </h4>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--wedding-muted)" }}>{venue.directions}</p>
                </div>
              )}
              {venue.accommodation && (
                <div>
                  <h4 className="font-semibold mb-2 text-xs tracking-[0.15em] uppercase" style={{ color: "var(--wedding-accent)" }}>
                    Accommodation
                  </h4>
                  <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--wedding-muted)" }}>{venue.accommodation}</p>
                </div>
              )}
            </div>

            {venue.contactInfo && (
              <p className="mt-4 text-xs" style={{ color: "var(--wedding-muted)" }}>
                <strong>Contact:</strong> {venue.contactInfo}
              </p>
            )}

            {venue.mapUrl && (
              <a
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-xs px-4 py-2 rounded"
                style={{ background: "var(--wedding-accent)", color: "#fff" }}
                data-testid={`venue-map-${venue.id}`}
              >
                <MapPin size={12} /> Open in Google Maps
              </a>
            )}
          </motion.div>
        ))}
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
  const [foundGuest, setFoundGuest] = useState<any>(null);
  const [showGuestConfirmPopup, setShowGuestConfirmPopup] = useState(false);
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
        const guest = await res.json();
        // Found existing guest - show confirmation popup
        setFoundGuest(guest);
        setShowGuestConfirmPopup(true);
      } else {
        // Name not in database - continue with normal flow
        setFoundGuest(null);
      }
    } catch (err) {
      console.error("Error checking guest:", err);
      setFoundGuest(null);
    } finally {
      setCheckingName(false);
    }
  };

  const confirmExistingGuest = () => {
    if (!foundGuest) return;

    // Switch side if guest is on different side
    if (foundGuest.side && foundGuest.side !== side && foundGuest.side !== "both") {
      setSide(foundGuest.side);
    }

    // Pre-fill form with existing data
    setIsUpdating(true);
    form.setValue("name", foundGuest.name);
    form.setValue("rsvpStatus", foundGuest.rsvpStatus);
    form.setValue("adultsCount", foundGuest.adultsCount || 1);
    form.setValue("childrenCount", foundGuest.childrenCount || 0);
    form.setValue("foodPreference", foundGuest.foodPreference || "");
    form.setValue(
      "eventsAttending",
      Array.isArray(foundGuest.eventsAttending)
        ? foundGuest.eventsAttending
        : []
    );
    form.setValue("dietaryRequirements", foundGuest.dietaryRequirements || "");
    form.setValue("message", foundGuest.message || "");

    setShowGuestConfirmPopup(false);

    toast({
      title: "Welcome back!",
      description: "You can update your events and food preferences below.",
    });
  };

  const continueAsNewGuest = () => {
    setFoundGuest(null);
    setShowGuestConfirmPopup(false);
    // Keep the name but allow new RSVP
  };

  const rsvpMutation = useMutation({
    mutationFn: async (data: PublicRsvpForm) => {
      // If updating existing guest, use their ID
      if (isUpdating && foundGuest) {
        const res = await apiRequest("POST", "/api/rsvp", { ...data, slug: foundGuest.inviteSlug });
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
      setFoundGuest(null);

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
    <section id="rsvp" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="rsvp-section">
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
          <GoldDivider />
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
                    disabled={isUpdating}
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
                      <Check size={12} /> Updating your existing RSVP
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

        {/* Guest Confirmation Popup */}
        <AnimatePresence>
          {showGuestConfirmPopup && foundGuest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowGuestConfirmPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-md w-full rounded-xl p-6 shadow-2xl"
                style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              >
                <div className="text-center mb-4">
                  <Heart className="mx-auto mb-3" size={40} style={{ color: "var(--wedding-accent)" }} />
                  <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: "var(--wedding-text)" }}>
                    Welcome Back!
                  </h3>
                  <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                    We found an existing RSVP for <strong>{foundGuest.name}</strong>
                  </p>
                </div>

                <div className="bg-background/50 rounded-lg p-4 mb-4 space-y-2 text-sm" style={{ color: "var(--wedding-text)" }}>
                  <p><strong>Current Status:</strong> {foundGuest.rsvpStatus === "confirmed" ? "✓ Confirmed" : "✗ Declined"}</p>
                  {foundGuest.foodPreference && (
                    <p><strong>Food Preference:</strong> {foundGuest.foodPreference}</p>
                  )}
                  {Array.isArray(foundGuest.eventsAttending) && (
                    <p>
                      <strong>Events:</strong>{" "}
                      {foundGuest.eventsAttending.length} selected
                    </p>
                  )}
                  {/* {foundGuest.eventsAttending && (
                        <p><strong>Events:</strong> {foundGuest.eventsAttending.split(",").length} selected</p>
                      )} */}
                </div>

                <p className="text-xs mb-4 text-center" style={{ color: "var(--wedding-muted)" }}>
                  Would you like to update your events and food preferences?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={continueAsNewGuest}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: "transparent",
                      color: "var(--wedding-text)",
                      border: "1px solid var(--wedding-border)",
                    }}
                  >
                    Continue as New
                  </button>
                  <button
                    onClick={confirmExistingGuest}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: "var(--wedding-accent)",
                      color: "#fff",
                    }}
                  >
                    Update RSVP
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function WardrobePlannerSection() {
  const events = [
    {
      name: "Haldi",
      date: "Dec 12",
      suggestions: {
        men: ["Yellow kurta-pajama", "Light cotton fabrics", "Avoid heavy embellishments"],
        women: ["Yellow or green saree/suit", "Traditional jewelry", "Comfortable footwear"]
      }
    },
    {
      name: "Engagement & Sangeet",
      date: "Dec 12 Evening",
      suggestions: {
        men: ["Sherwani or Indo-western", "Bright colors welcome", "Statement accessories"],
        women: ["Lehenga, Anarkali, or Saree", "Bold colors and designs", "Dance-friendly outfit"]
      }
    },
    {
      name: "Wedding Ceremony",
      date: "Dec 13",
      suggestions: {
        men: ["Traditional dhoti-kurta or sherwani", "Cream, gold, or maroon", "Traditional jewelry"],
        women: ["Traditional Bengali saree", "Red, maroon, or gold tones", "Heavy jewelry"]
      }
    },
    {
      name: "Wedding Reception",
      date: "Dec 15",
      suggestions: {
        men: ["Formal sherwani or suit", "Elegant accessories", "Polished shoes"],
        women: ["Designer saree or lehenga", "Statement jewelry", "Elegant clutch"]
      }
    }
  ];

  return (
    <section id="wardrobe" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="wardrobe-section">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Wardrobe Planner
          </h2>
          <GoldDivider />
          <p className="text-sm mt-4" style={{ color: "var(--wedding-muted)" }}>
            Dress code suggestions for each event to help you plan your wardrobe
          </p>
        </motion.div>

        <div className="grid gap-6">
          {events.map((event, idx) => (
            <motion.div
              key={event.name}
              className="p-6 rounded-xl"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-xl font-semibold" style={{ color: "var(--wedding-text)" }}>
                    {event.name}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>{event.date}</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--wedding-accent)", opacity: 0.2 }}>
                  <span className="text-lg" style={{ color: "var(--wedding-accent)" }}>👔</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--wedding-accent)" }}>For Men</h4>
                  <ul className="space-y-1">
                    {event.suggestions.men.map((item, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--wedding-muted)" }}>
                        <span style={{ color: "var(--wedding-accent)" }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--wedding-accent)" }}>For Women</h4>
                  <ul className="space-y-1">
                    {event.suggestions.women.map((item, i) => (
                      <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--wedding-muted)" }}>
                        <span style={{ color: "var(--wedding-accent)" }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 p-4 rounded-lg text-center"
          style={{ background: "rgba(212, 175, 55, 0.1)", border: "1px solid var(--wedding-border)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
            💡 These are suggestions to help you prepare. Feel free to wear what makes you comfortable and confident!
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FaqsSection({ faqList }: { faqList: Faq[] }) {
  if (faqList.length === 0) return null;

  return (
    <section id="faqs" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="faqs-section">
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
          <GoldDivider />
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
      style={{
        background: "linear-gradient(135deg, var(--wedding-bg) 0%, var(--wedding-card-bg) 100%)",
      }}
      data-testid="footer"
    >
      {/* Ornamental top border */}
      <div className="h-px" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--wedding-accent) 50%, transparent 100%)",
        opacity: 0.3
      }} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Crest & Divider */}
        <div className="text-center mb-8">
          <div className="opacity-70">
            <KHCrest size={80} className="mx-auto mb-6" />
          </div>
          <ThinGoldDivider className="mb-6" />
        </div>

        {/* Main Content */}
        <div className="text-center space-y-3 mb-8">
          <h3 className="font-serif text-2xl tracking-wide" style={{ color: "var(--wedding-text)" }}>
            Kaustav & Himasree
          </h3>
          <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
            December 13, 2026 • Kolkata, West Bengal
          </p>
        </div>

        {/* Decorative Separator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-20 h-px" style={{ background: "var(--wedding-accent)", opacity: 0.3 }} />
          <Heart size={16} style={{ color: "var(--wedding-accent)", opacity: 0.5 }} />
          <div className="w-20 h-px" style={{ background: "var(--wedding-accent)", opacity: 0.3 }} />
        </div>

        {/* Color Palette Display */}
        <div className="flex justify-center gap-3 mb-8">
          <div
            className="w-12 h-12 rounded-full border-2 shadow-sm"
            style={{
              background: "var(--wedding-bg)",
              borderColor: "var(--wedding-border)"
            }}
            title="Background"
          />
          <div
            className="w-12 h-12 rounded-full border-2 shadow-sm"
            style={{
              background: "var(--wedding-accent)",
              borderColor: "var(--wedding-accent)"
            }}
            title="Accent"
          />
          <div
            className="w-12 h-12 rounded-full border-2 shadow-sm"
            style={{
              background: "var(--wedding-text)",
              borderColor: "var(--wedding-text)"
            }}
            title="Text"
          />
        </div>

        {/* Footer Text */}
        <div className="text-center space-y-2">
          <p className="text-xs tracking-widest uppercase" style={{ color: "var(--wedding-muted)", opacity: 0.7 }}>
            Made with love and blessings
          </p>
          <p className="text-xs" style={{ color: "var(--wedding-muted)", opacity: 0.5 }}>
            © 2026 — All rights reserved
          </p>
        </div>
      </div>

      {/* Bottom Ornamental Border */}
      <div className="h-1" style={{
        background: "linear-gradient(90deg, transparent 0%, var(--wedding-accent) 50%, transparent 100%)",
        opacity: 0.2
      }} />
    </footer>
  );
}

export default function Home() {
  const { sealOpened, setSealOpened } = useSeal();
  const { setMusicUrl, fadeIn, play, stop, setOnTrackEnd } = useMusic();
  const { setSide, side } = useWeddingTheme();
  const [sideSelected, setSideSelected] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentPlaylistRef = useRef<string[]>([]);

  const { data: config, isLoading: configLoading } = useQuery<WeddingConfig>({
    queryKey: ["/api/config"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/events"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: milestones = [] } = useQuery<StoryMilestone[]>({
    queryKey: ["/api/stories"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: venueList = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: faqList = [] } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Set music URL based on current theme side and switch when theme changes
  useEffect(() => {
    if (!config) return;

    let playlist: string[] = [];

    // Build playlist based on current side
    if (side === 'groom' && config.groomMusicUrls && Array.isArray(config.groomMusicUrls) && config.groomMusicUrls.length > 0) {
      playlist = config.groomMusicUrls.filter(Boolean); // Filter out empty strings
    } else if (side === 'bride' && config.brideMusicUrls && Array.isArray(config.brideMusicUrls) && config.brideMusicUrls.length > 0) {
      playlist = config.brideMusicUrls.filter(Boolean);
    } else if (config.backgroundMusicUrl) {
      playlist = [config.backgroundMusicUrl];
    }

    // Update playlist reference and reset to first track
    currentPlaylistRef.current = playlist;
    setCurrentTrackIndex(0);

    if (playlist.length > 0) {
      stop(); // Stop current music to switch tracks
      setMusicUrl(playlist[0]);
      // Auto-play the new track if seal is already opened
      if (sealOpened) {
        setTimeout(() => fadeIn(), 300); // Small delay for smooth transition
      }
    }
  }, [config, side, setMusicUrl, stop, fadeIn, sealOpened]);

  // Setup audio ended event to play next track in playlist
  useEffect(() => {
    const handleEnded = () => {
      const playlist = currentPlaylistRef.current;
      if (playlist.length <= 1) return; // Don't advance if single track or empty

      // Move to next track
      const nextIndex = (currentTrackIndex + 1) % playlist.length;
      setCurrentTrackIndex(nextIndex);
      setMusicUrl(playlist[nextIndex]);

      // Continue playing
      setTimeout(() => fadeIn(), 100);
    };

    setOnTrackEnd(handleEnded);
    return () => setOnTrackEnd(null);
  }, [currentTrackIndex, setMusicUrl, fadeIn, setOnTrackEnd]);

  // Increment view count once on mount
  useEffect(() => {
    const hasIncremented = sessionStorage.getItem('view_counted');
    if (!hasIncremented) {
      apiRequest('POST', '/api/increment-view')
        .catch(err => console.error('Failed to increment view count:', err));
      sessionStorage.setItem('view_counted', 'true');
    }
  }, []);

  // Start music when seal opens
  useEffect(() => {
    if (sealOpened && config?.backgroundMusicUrl) {
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        fadeIn();
      }, 500);
    }
  }, [sealOpened, config?.backgroundMusicUrl, fadeIn]);

  if (configLoading) {
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

  // Show side selection landing first
  if (!sideSelected) {
    return (
      <SideSelectionLanding
        onSelectSide={(side) => {
          setSide(side);
          setSideSelected(true);
        }}
      />
    );
  }

  return (
    <>
      {!sealOpened && (
        <WaxSealIntro onSealOpen={() => setSealOpened(true)} />
      )}
      <Header />
      <ViewingSideOverlay
        onBackToSelection={() => {
          stop();
          setSideSelected(false);
          setSealOpened(false);
        }}
        onSideChange={(newSide) => {
          setSide(newSide);
        }}
      />
      <main>
        <HeroSection config={config} />
        <StorySection milestones={milestones} />
        <EventsSection events={events} />
        <VenueSection venueList={venueList} />
        <RsvpSection events={events} />
        <WardrobePlannerSection />
        <FaqsSection faqList={faqList} />
        <FooterSection />
      </main>
      <FloatingContact />
    </>
  );
}
