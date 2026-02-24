import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, ChevronDown, ChevronRight, Heart, Gift, ExternalLink, Loader2, Check, MessageCircle, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { z } from "zod";
import { Countdown } from "@/components/Countdown";
import KHCrest from "@/components/KHCrest";
import WaxSealIntro from "@/components/WaxSealIntro";
import Header from "@/components/Header";
import { useSeal } from "@/context/SealContext";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FloatingContact from "@/components/FloatingContact";
import type { WeddingConfig, WeddingEvent, StoryMilestone, Venue, Faq } from "@shared/schema";
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
      className="min-h-screen flex flex-col items-center justify-center relative pt-14"
      style={{ background: "var(--wedding-hero-gradient)" }}
      data-testid="hero-section"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="text-center z-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
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
          Kaustav
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
          Himasree
        </h1>

        <GoldDivider />

        <div className="mt-8">
          {config.weddingDate ? (
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
              data-testid="date-tba"
            >
              Date To Be Announced
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
    <section id="story" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="story-section">
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
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden sm:block" style={{ background: "var(--wedding-border)" }} />

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
                  {milestone.imageUrl && (
                    <img
                      src={milestone.imageUrl}
                      alt={milestone.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                  )}
                  <h3 className="font-serif text-xl font-semibold mb-1" style={{ color: "var(--wedding-text)" }}>
                    {milestone.title}
                  </h3>
                  <p className="text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--wedding-accent)" }}>
                    {milestone.date}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                    {milestone.description}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: "var(--wedding-accent)", background: "var(--wedding-bg)" }}
                  />
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

  if (events.length === 0) return null;

  const dateMap = new Map<string, WeddingEvent[]>();
  events.forEach((ev) => {
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
              className="rounded-xl p-6 sm:p-8"
              style={{
                background: "var(--wedding-card-bg)",
                border: event.isMainEvent
                  ? "2px solid var(--wedding-accent)"
                  : "1px solid var(--wedding-border)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-testid={`event-card-${event.id}`}
            >
              {event.isMainEvent && (
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ background: "var(--wedding-accent)", color: "#fff" }}
                >
                  Main Event
                </span>
              )}
              <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: "var(--wedding-text)" }}>
                {event.title}
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
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
  phone: z.string().min(5, "Phone number is required").max(20),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20),
  childrenCount: z.number().int().min(0).max(20),
  foodPreference: z.enum(["vegetarian", "non-vegetarian", "vegan"]),
  eventsAttending: z.string(),
  dietaryRequirements: z.string().max(500),
  message: z.string().max(1000),
  whatsappOptIn: z.boolean(),
});
type PublicRsvpForm = z.infer<typeof publicRsvpFormSchema>;

function RsvpSection({ events }: { events: WeddingEvent[] }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string>("");

  const form = useForm<PublicRsvpForm>({
    resolver: zodResolver(publicRsvpFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      rsvpStatus: "confirmed",
      adultsCount: 1,
      childrenCount: 0,
      foodPreference: "vegetarian",
      eventsAttending: "",
      dietaryRequirements: "",
      message: "",
      whatsappOptIn: false,
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async (data: PublicRsvpForm) => {
      const res = await apiRequest("POST", "/api/rsvp/public", data);
      return res.json();
    },
    onSuccess: (result) => {
      setSubmitted(true);
      setSubmittedStatus(result.rsvpStatus);
      toast({ title: "RSVP Submitted", description: "Thank you for your response!" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const rsvpStatus = form.watch("rsvpStatus");
  const whatsappOptIn = form.watch("whatsappOptIn");

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

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="rounded-xl p-8 text-center"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              data-testid="rsvp-success"
            >
              {submittedStatus === "confirmed" ? (
                <>
                  <Check size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
                  <h3 className="font-serif text-xl mb-2" style={{ color: "var(--wedding-text)" }}>
                    Thank You!
                  </h3>
                  <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                    We're thrilled you'll be joining us. We can't wait to celebrate with you!
                  </p>
                  {whatsappOptIn && (
                    <div className="mt-6 p-4 rounded-lg" style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)" }}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Bot size={16} style={{ color: "#25D366" }} />
                        <span className="text-xs font-medium" style={{ color: "#25D366" }}>AI Chatbot Enabled</span>
                      </div>
                      <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                        You'll receive wedding updates and can ask questions anytime via our WhatsApp AI assistant.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Heart size={48} className="mx-auto mb-4" style={{ color: "var(--wedding-accent)" }} />
                  <h3 className="font-serif text-xl mb-2" style={{ color: "var(--wedding-text)" }}>
                    We'll Miss You
                  </h3>
                  <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                    Thank you for letting us know. You'll be in our thoughts!
                  </p>
                </>
              )}

              <button
                onClick={() => { setSubmitted(false); form.reset(); }}
                className="mt-6 text-xs underline"
                style={{ color: "var(--wedding-accent)" }}
                data-testid="rsvp-submit-another"
              >
                Submit another RSVP
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="rounded-xl p-6 sm:p-8 space-y-6"
              style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={form.handleSubmit((data) => rsvpMutation.mutate(data))}
              data-testid="rsvp-form"
            >
              <div>
                <label className="text-xs tracking-[0.15em] uppercase mb-3 block" style={{ color: "var(--wedding-accent)" }}>
                  Will you be attending?
                </label>
                <div className="flex gap-3">
                  {(["confirmed", "declined"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => form.setValue("rsvpStatus", status)}
                      className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                      style={{
                        background: rsvpStatus === status ? "var(--wedding-accent)" : "transparent",
                        color: rsvpStatus === status ? "#fff" : "var(--wedding-text)",
                        border: `1px solid ${rsvpStatus === status ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                      }}
                      data-testid={`rsvp-${status}`}
                    >
                      {status === "confirmed" ? "Joyfully Accept" : "Respectfully Decline"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...form.register("name")}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                    style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                    data-testid="input-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...form.register("phone")}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-lg text-sm"
                    style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                    data-testid="input-phone"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                  Email (optional)
                </label>
                <input
                  type="email"
                  {...form.register("email")}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                  data-testid="input-email"
                />
              </div>

              {rsvpStatus === "confirmed" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                        Number of Adults
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        {...form.register("adultsCount", { valueAsNumber: true })}
                        className="w-full px-4 py-2.5 rounded-lg text-sm"
                        style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                        data-testid="input-adults"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                        Number of Children
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        {...form.register("childrenCount", { valueAsNumber: true })}
                        className="w-full px-4 py-2.5 rounded-lg text-sm"
                        style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                        data-testid="input-children"
                      />
                    </div>
                  </div>

                  {events.length > 0 && (
                    <div>
                      <label className="text-xs tracking-wide uppercase mb-2 block" style={{ color: "var(--wedding-accent)" }}>
                        Events Attending
                      </label>
                      <div className="space-y-2">
                        {events.map((ev) => {
                          const attending = form.watch("eventsAttending").split(",").filter(Boolean);
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
                                  const current = form.getValues("eventsAttending").split(",").filter(Boolean);
                                  const next = isSelected
                                    ? current.filter((id) => id !== ev.id)
                                    : [...current, ev.id];
                                  form.setValue("eventsAttending", next.join(","));
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
                    </div>
                  )}

                  <div>
                    <label className="text-xs tracking-wide uppercase mb-1 block" style={{ color: "var(--wedding-accent)" }}>
                      Food Preference
                    </label>
                    <select
                      {...form.register("foodPreference")}
                      className="w-full px-4 py-2.5 rounded-lg text-sm"
                      style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                      data-testid="select-food"
                    >
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                    </select>
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

              <div
                className="rounded-xl p-4 space-y-3"
                style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)" }}
              >
                <label className="flex items-start gap-3 cursor-pointer" data-testid="whatsapp-optin">
                  <input
                    type="checkbox"
                    {...form.register("whatsappOptIn")}
                    className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                    style={{ accentColor: "#25D366" }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle size={14} style={{ color: "#25D366" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--wedding-text)" }}>
                        Get WhatsApp AI Updates
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                      Opt in to receive wedding updates via our AI-powered WhatsApp chatbot.
                      Get instant answers about venue, schedule, dress code, and more — anytime you need them.
                    </p>
                  </div>
                </label>

                <AnimatePresence>
                  {whatsappOptIn && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="rounded-lg p-3 mt-1"
                        style={{ background: "var(--wedding-card-bg)", border: "1px dashed var(--wedding-border)" }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Bot size={14} style={{ color: "#25D366" }} />
                          <span className="text-[10px] tracking-wider uppercase font-medium" style={{ color: "#25D366" }}>
                            AI Wedding Assistant
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Bot size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#25D366" }} />
                            <div className="rounded-lg px-3 py-1.5 text-xs" style={{ background: "var(--wedding-bg)", color: "var(--wedding-text)" }}>
                              "Hi! I'm your wedding AI assistant. Ask me anything about the event!"
                            </div>
                          </div>
                          <div className="flex items-start gap-2 justify-end">
                            <div className="rounded-lg px-3 py-1.5 text-xs" style={{ background: "var(--wedding-accent)", color: "#fff" }}>
                              "What's the dress code for the reception?"
                            </div>
                            <User size={12} className="mt-0.5 flex-shrink-0" style={{ color: "var(--wedding-muted)" }} />
                          </div>
                          <div className="flex items-start gap-2">
                            <Bot size={12} className="mt-0.5 flex-shrink-0" style={{ color: "#25D366" }} />
                            <div className="rounded-lg px-3 py-1.5 text-xs" style={{ background: "var(--wedding-bg)", color: "var(--wedding-text)" }}>
                              "Indian Formal — Sarees & Sherwanis are suggested for the Reception on Dec 14."
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] mt-2 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                          Real-time updates, schedule reminders, venue directions, and travel info — all at your fingertips.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ShagunSection({ config }: { config: WeddingConfig }) {
  return (
    <section id="shagun" className="wedding-section" style={{ background: "var(--wedding-bg)" }} data-testid="shagun-section">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--wedding-text)" }}>
            Digital Shagun
          </h2>
          <GoldDivider />

          <div
            className="p-8 rounded-xl mt-8"
            style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
          >
            <Gift size={40} className="mx-auto mb-4" style={{ color: "var(--wedding-accent)" }} />
            <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
              Your blessings mean the world to us. If you wish to send a gift digitally, you can scan the QR code below.
            </p>

            {config.upiId ? (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-white rounded-lg" data-testid="upi-qr-code">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${encodeURIComponent(config.upiId)}&pn=Kaustav%20%26%20Himasree&cu=INR`}
                    alt="UPI QR Code"
                    width={200}
                    height={200}
                  />
                </div>
                <p className="text-xs" style={{ color: "var(--wedding-accent)" }}>
                  Scan to Bless the Couple
                </p>
                <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                  UPI: {config.upiId}
                </p>
              </div>
            ) : (
              <p className="text-sm italic" style={{ color: "var(--wedding-muted)" }}>
                UPI details will be updated soon.
              </p>
            )}

            <p className="text-[10px] mt-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
              Your presence at our wedding is the greatest gift. Digital shagun is entirely optional and appreciated but never expected.
            </p>
          </div>
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
      className="py-12 text-center"
      style={{ background: "var(--wedding-bg)" }}
      data-testid="footer"
    >
      <KHCrest size={60} className="mx-auto mb-4 opacity-50" />
      <p className="font-serif text-sm" style={{ color: "var(--wedding-muted)" }}>
        Made with love for Kaustav & Himasree
      </p>
      <p className="text-xs mt-2" style={{ color: "var(--wedding-muted)", opacity: 0.5 }}>
        © 2026 — All rights reserved
      </p>
    </footer>
  );
}

export default function Home() {
  const { sealOpened, setSealOpened } = useSeal();
  const { setMusicUrl, hasStarted, fadeIn } = useMusic();

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

  useEffect(() => {
    if (config?.backgroundMusicUrl) {
      setMusicUrl(config.backgroundMusicUrl);
    }
  }, [config?.backgroundMusicUrl, setMusicUrl]);

  useEffect(() => {
    if (!sealOpened || hasStarted || !config?.backgroundMusicUrl) return;
    const startOnInteraction = () => {
      fadeIn();
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("touchstart", startOnInteraction);
      document.removeEventListener("scroll", startOnInteraction);
    };
    document.addEventListener("click", startOnInteraction, { once: true });
    document.addEventListener("touchstart", startOnInteraction, { once: true });
    document.addEventListener("scroll", startOnInteraction, { once: true });
    return () => {
      document.removeEventListener("click", startOnInteraction);
      document.removeEventListener("touchstart", startOnInteraction);
      document.removeEventListener("scroll", startOnInteraction);
    };
  }, [sealOpened, hasStarted, config?.backgroundMusicUrl, fadeIn]);

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

  return (
    <>
      {!sealOpened && (
        <WaxSealIntro onSealOpen={() => setSealOpened(true)} />
      )}
      <Header />
      <main>
        <HeroSection config={config} />
        <StorySection milestones={milestones} />
        <EventsSection events={events} />
        <VenueSection venueList={venueList} />
        <RsvpSection events={events} />
        <ShagunSection config={config} />
        <FaqsSection faqList={faqList} />
        <FooterSection />
      </main>
      <FloatingContact config={config} />
    </>
  );
}
