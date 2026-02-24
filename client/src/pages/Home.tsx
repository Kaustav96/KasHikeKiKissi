import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Calendar, MapPin, Heart, ChevronDown, Download, ExternalLink, Check, X, Clock, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Countdown } from "@/components/Countdown";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThemeToggle } from "@/components/ThemeToggle";
// ─── Types ────────────────────────────────────────────────────────────────────
interface WeddingConfig {
  weddingDate: string;
  dateConfirmed: boolean;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  coupleStory: string;
}

interface WeddingEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string | null;
  venueName: string;
  venueAddress: string;
  venueMapUrl: string;
  isMainEvent: boolean;
  dressCode: string;
}


// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Story Timeline ───────────────────────────────────────────────────────────
const storyMilestones = [
  { year: "2018", title: "First Meeting", text: "A shared umbrella on a rainy Kolkata evening became the start of something beautiful." },
  { year: "2019", title: "Inseparable", text: "Evening walks along the Ganges, endless cups of chai, and conversations that stretched into the night." },
  { year: "2021", title: "Through the Storm", text: "Miles apart during uncertain times only deepened their bond — love letters and late-night calls." },
  { year: "2023", title: "The Proposal", text: "Under the stars at Kaustav's family home, a question, a tearful yes, and a forever sealed with a ring." },
  { year: "2025", title: "Forever Begins", text: "They invite you to witness their love story take its most beautiful turn yet." },
];

// ─── Components ───────────────────────────────────────────────────────────────

function HeroSection({ config }: { config: WeddingConfig }) {
  const weddingDate = new Date(config.weddingDate);
  const formattedDate = weddingDate.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      data-testid="section-hero"
    >
      {/* Background gradient — elegant deep rose */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-rose-800 to-stone-900 dark:from-rose-950 dark:via-rose-900 dark:to-stone-950" />
      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

      {/* Nav */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
        <span className="text-white/60 text-sm font-sans tracking-widest uppercase">K & H</span>
        <ThemeToggle />
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 text-center px-6 flex flex-col items-center gap-6"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p variants={fadeUp} className="text-white/70 text-sm tracking-[0.3em] uppercase font-sans">
          Together with their families
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-2">
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-bold text-white leading-none" data-testid="hero-title">
            Kaustav
          </h1>
          <div className="flex items-center gap-4 text-white/50">
            <div className="h-px w-16 bg-white/30" />
            <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
            <div className="h-px w-16 bg-white/30" />
          </div>
          <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-bold text-white leading-none">
            Himasree
          </h1>
        </motion.div>

        <motion.p variants={fadeUp} className="font-serif text-xl sm:text-2xl text-white/80 italic">
          {config.dateConfirmed ? formattedDate : "Date To Be Announced"}
        </motion.p>

        <motion.p variants={fadeUp} className="text-white/60 font-sans text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {config.venueName}, {config.venueAddress.split(",").slice(-2).join(",")}
        </motion.p>

        {config.dateConfirmed && (
          <motion.div variants={fadeUp} className="mt-4">
            <Countdown targetDate={weddingDate} />
          </motion.div>
        )}

        <motion.a
          variants={fadeUp}
          href="#story"
          className="mt-8 flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase font-sans">Our Story</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.a>
      </motion.div>
    </section>
  );
}

function StorySection({ story }: { story: string }) {
  const paragraphs = story.split("\n\n").filter(Boolean);

  return (
    <section id="story" className="py-24 px-6" data-testid="section-story">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-sans mb-3">
            Our Love Story
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            How It All Began
          </motion.h2>
        </motion.div>

        {/* Story text */}
        {paragraphs.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-20 space-y-4"
          >
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className="text-muted-foreground text-lg leading-relaxed font-sans text-center max-w-2xl mx-auto"
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden sm:block" />

          <div className="space-y-12">
            {storyMilestones.map((milestone, i) => (
              <motion.div
                key={milestone.year}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className={`relative flex flex-col sm:flex-row items-center gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                {/* Content side */}
                <div className={`flex-1 ${i % 2 === 0 ? "sm:text-right sm:pr-10" : "sm:text-left sm:pl-10"}`}>
                  <Card className="border-card-border">
                    <CardContent className="p-6">
                      <span className="text-primary text-sm font-bold tracking-widest font-sans">{milestone.year}</span>
                      <h3 className="font-serif text-xl font-bold text-foreground mt-1">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{milestone.text}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Center dot */}
                <div className="hidden sm:flex w-10 h-10 rounded-full bg-primary items-center justify-center flex-shrink-0 z-10 border-4 border-background">
                  <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden sm:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EventCard({ event }: { event: WeddingEvent }) {
  const start = new Date(event.startTime);
  const end = event.endTime ? new Date(event.endTime) : null;

  const dateStr = start.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  const timeStr = start.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) +
    (end ? ` – ${end.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeUp}
      data-testid={`card-event-${event.id}`}
    >
      <Card className="border-card-border hover-elevate">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">{event.title}</h3>
              {event.isMainEvent && (
                <Badge variant="default" data-testid={`badge-main-event-${event.id}`}>Main Ceremony</Badge>
              )}
            </div>
            {event.dressCode && (
              <Badge variant="secondary" data-testid={`badge-dresscode-${event.id}`}>
                {event.dressCode}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">{event.description}</p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{timeStr}</span>
            </div>
            {event.venueName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{event.venueName}{event.venueAddress ? `, ${event.venueAddress}` : ""}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={`/api/events/${event.id}/calendar`} download>
              <Button variant="outline" size="sm" data-testid={`button-download-ics-${event.id}`}>
                <Download className="w-4 h-4 mr-1" />
                Add to Calendar
              </Button>
            </a>
            {event.venueMapUrl && (
              <a href={event.venueMapUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" data-testid={`button-map-${event.id}`}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Map
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EventsSection({ events }: { events: WeddingEvent[] }) {
  return (
    <section id="events" className="py-24 px-6 bg-muted/30" data-testid="section-events">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-sans mb-3">
            Celebrations
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
            Wedding Events
          </motion.h2>
        </motion.div>

        {events.length === 0 ? (
          <motion.div variants={fadeUp} className="text-center text-muted-foreground py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-serif text-lg">Events will be announced soon.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RsvpSection() {
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rsvpStatus: "confirmed" as "confirmed" | "declined",
      plusOne: false,
      plusOneName: "",
      dietaryRequirements: "",
      message: "",
      whatsappOptIn: false,
    },
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;
  const rsvpStatus = watch("rsvpStatus");
  const plusOne = watch("plusOne");
  const whatsappOptIn = watch("whatsappOptIn");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/rsvp", { ...data, slug: "public" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit RSVP");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "RSVP received!", description: "Thank you for your response." });
      reset();
    },
    onError: (err) => {
      toast({ title: "Something went wrong", description: (err as Error).message, variant: "destructive" });
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="py-24 px-6" data-testid="section-rsvp">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p variants={fadeUp} className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-sans mb-3">
            Join Us
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            RSVP
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-sm">
            Kindly respond by 30th November 2025. For personalized invitations, contact the couple directly.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <Card className="border-card-border">
            <CardContent className="p-6 sm:p-8">
              <p className="text-center text-muted-foreground text-sm mb-6 p-3 bg-muted/50 rounded-md">
                For a personalized RSVP experience with your details pre-filled, please use the invite link sent to you directly.
              </p>

              {/* Attending toggle */}
              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setValue("rsvpStatus", "confirmed")}
                  className={`flex-1 py-3 rounded-md border font-sans text-sm font-medium transition-all flex items-center justify-center gap-2 ${rsvpStatus === "confirmed" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                  data-testid="button-attending-yes"
                >
                  <Check className="w-4 h-4" />
                  Joyfully Accepts
                </button>
                <button
                  type="button"
                  onClick={() => setValue("rsvpStatus", "declined")}
                  className={`flex-1 py-3 rounded-md border font-sans text-sm font-medium transition-all flex items-center justify-center gap-2 ${rsvpStatus === "declined" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground"}`}
                  data-testid="button-attending-no"
                >
                  <X className="w-4 h-4" />
                  Regretfully Declines
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your full name"
                    className="mt-1"
                    data-testid="input-name"
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...register("email")} placeholder="your@email.com" className="mt-1" type="email" data-testid="input-email" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} placeholder="+91 98765 43210" className="mt-1" type="tel" data-testid="input-phone" />
                  </div>
                </div>

                {rsvpStatus === "confirmed" && (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="text-sm font-medium">Bringing a plus one?</Label>
                        <p className="text-muted-foreground text-xs">An additional guest</p>
                      </div>
                      <Switch
                        checked={plusOne}
                        onCheckedChange={(v) => setValue("plusOne", v)}
                        data-testid="switch-plus-one"
                      />
                    </div>

                    {plusOne && (
                      <div>
                        <Label htmlFor="plusOneName">Plus One's Name</Label>
                        <Input id="plusOneName" {...register("plusOneName")} placeholder="Guest name" className="mt-1" data-testid="input-plus-one-name" />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="dietary">Dietary Requirements</Label>
                      <Textarea
                        id="dietary"
                        {...register("dietaryRequirements")}
                        placeholder="Any allergies or dietary needs..."
                        className="mt-1"
                        rows={2}
                        data-testid="input-dietary"
                      />
                    </div>

                    {/* WhatsApp opt-in */}
                    <div className="border border-border rounded-md p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-green-600" />
                          <div>
                            <Label className="text-sm font-medium">WhatsApp Reminders</Label>
                            <p className="text-muted-foreground text-xs">Receive gentle reminders & updates</p>
                          </div>
                        </div>
                        <Switch
                          checked={whatsappOptIn}
                          onCheckedChange={(v) => setValue("whatsappOptIn", v)}
                          data-testid="switch-whatsapp-optin"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="message">Message for the Couple</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Share your wishes..."
                    className="mt-1"
                    rows={3}
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit((data) => {
                    toast({
                      title: "Please use your personal invite link",
                      description: "Contact Kaustav or Himasree for your personalised RSVP link.",
                    });
                  })}
                  data-testid="button-submit-rsvp"
                >
                  Submit RSVP
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function Footer({ config }: { config: WeddingConfig }) {
  return (
    <footer className="py-12 px-6 border-t border-border" data-testid="section-footer">
      <div className="max-w-4xl mx-auto text-center space-y-3">
        <div className="font-serif text-2xl text-foreground">Kaustav & Himasree</div>
        {config.dateConfirmed && (
          <p className="text-muted-foreground text-sm">
            {new Date(config.weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        <p className="text-muted-foreground text-sm">{config.venueName}</p>
        <Separator className="my-6 max-w-xs mx-auto" />
        <p className="text-muted-foreground text-xs">
          Made with love for Kaustav & Himasree's wedding
        </p>
      </div>
    </footer>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function StickyNav() {
  const links = [
    { href: "#story", label: "Our Story" },
    { href: "#events", label: "Events" },
    { href: "#rsvp", label: "RSVP" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" data-testid="nav-sticky">
      <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between gap-4">
        <span className="font-serif text-foreground font-bold text-sm">K & H</span>
        <div className="flex items-center gap-1 sm:gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-sans px-2 py-1"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: config, isLoading: configLoading } = useQuery<WeddingConfig>({
    queryKey: ["/api/config"],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/events"],
  });

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 to-stone-900">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-serif text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 to-stone-900">
        <p className="text-white/60 font-serif text-lg">Wedding details coming soon.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection config={config} />
      <StickyNav />
      <StorySection story={config.coupleStory} />
      <EventsSection events={events} />
      <RsvpSection />
      <Footer config={config} />
    </div>
  );
}
