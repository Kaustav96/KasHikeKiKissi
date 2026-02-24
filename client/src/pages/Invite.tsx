/**
 * Personalized Invite Page — /invite/:slug
 *
 * Pre-fills the RSVP form with the guest's information.
 * Secure: slugs are random UUIDs, not enumerable.
 * Shows a 404 experience if the slug is invalid.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Heart, Check, X, MapPin, Calendar, MessageSquare, ChevronDown, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Countdown } from "@/components/Countdown";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface InviteData {
  id: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: string;
  plusOne: boolean;
  plusOneName: string;
  dietaryRequirements: string;
  message: string;
  whatsappOptIn: boolean;
  side: string;
}

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
  startTime: string;
  endTime: string | null;
  venueName: string;
  venueAddress: string;
  isMainEvent: boolean;
}

// ─── RSVP Schema ──────────────────────────────────────────────────────────────
const rsvpSchema = z.object({
  rsvpStatus: z.enum(["confirmed", "declined"]),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  plusOne: z.boolean().default(false),
  plusOneName: z.string().max(100).optional(),
  dietaryRequirements: z.string().max(500).optional(),
  message: z.string().max(1000).optional(),
  whatsappOptIn: z.boolean().default(false),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ─── Success State ────────────────────────────────────────────────────────────
function RsvpSuccess({ status, guestName }: { status: string; guestName: string }) {
  const isConfirmed = status === "confirmed";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 space-y-4"
      data-testid="rsvp-success"
    >
      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${isConfirmed ? "bg-primary/10" : "bg-muted"}`}>
        {isConfirmed
          ? <Heart className="w-8 h-8 text-primary fill-primary" />
          : <X className="w-8 h-8 text-muted-foreground" />}
      </div>
      <div>
        <h3 className="font-serif text-2xl font-bold text-foreground">
          {isConfirmed ? "We'll see you there!" : "We'll miss you!"}
        </h3>
        <p className="text-muted-foreground text-sm mt-2">
          {isConfirmed
            ? `Thank you, ${guestName}! Your RSVP has been confirmed. We can't wait to celebrate with you.`
            : `Thank you, ${guestName}. We understand and hope you'll be with us in spirit.`}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────
function InviteNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 to-stone-900 px-6">
      <div className="text-center">
        <Heart className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <h1 className="font-serif text-3xl text-white font-bold mb-2">Invitation Not Found</h1>
        <p className="text-white/60 font-sans text-sm">
          This invite link may be invalid or expired. Please contact the couple directly.
        </p>
        <a href="/" className="inline-block mt-6 text-white/70 text-sm underline underline-offset-4">
          Visit Wedding Website
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Invite() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [finalStatus, setFinalStatus] = useState("");

  const { data: invite, isLoading: inviteLoading, isError } = useQuery<InviteData>({
    queryKey: ["/api/invite", slug],
    queryFn: async () => {
      const res = await fetch(`/api/invite/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    retry: false,
  });

  const { data: config } = useQuery<WeddingConfig>({ queryKey: ["/api/config"] });
  const { data: events = [] } = useQuery<WeddingEvent[]>({ queryKey: ["/api/events"] });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      rsvpStatus: "confirmed",
      email: "",
      phone: "",
      plusOne: false,
      plusOneName: "",
      dietaryRequirements: "",
      message: "",
      whatsappOptIn: false,
    },
  });

  // Pre-fill form with invite data when loaded
  useEffect(() => {
    if (invite) {
      reset({
        rsvpStatus: (invite.rsvpStatus === "confirmed" || invite.rsvpStatus === "declined")
          ? invite.rsvpStatus
          : "confirmed",
        email: invite.email || "",
        phone: invite.phone || "",
        plusOne: invite.plusOne || false,
        plusOneName: invite.plusOneName || "",
        dietaryRequirements: invite.dietaryRequirements || "",
        message: invite.message || "",
        whatsappOptIn: invite.whatsappOptIn || false,
      });
    }
  }, [invite, reset]);

  const rsvpStatus = watch("rsvpStatus");
  const plusOne = watch("plusOne");
  const whatsappOptIn = watch("whatsappOptIn");
  const phone = watch("phone");

  const mutation = useMutation({
    mutationFn: async (data: RsvpFormData) => {
      const res = await apiRequest("POST", "/api/rsvp", {
        slug,
        ...data,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit RSVP");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setFinalStatus(data.rsvpStatus);
      setSubmitted(true);
    },
    onError: (err) => {
      toast({
        title: "Something went wrong",
        description: (err as Error).message,
        variant: "destructive",
      });
    },
  });

  if (inviteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 to-stone-900">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (isError || !invite) {
    return <InviteNotFound />;
  }

  const weddingDate = config ? new Date(config.weddingDate) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-rose-900 via-rose-800 to-stone-900 py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} />
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="relative z-10 space-y-4"
        >
          <motion.p variants={fadeUp} className="text-white/60 text-xs tracking-[0.3em] uppercase font-sans">
            You're Invited
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-5xl sm:text-7xl font-bold text-white">
            Kaustav & Himasree
          </motion.h1>
          <motion.p variants={fadeUp} className="text-rose-200/80 font-serif text-lg italic">
            {config?.dateConfirmed
              ? new Date(config.weddingDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
              : "Date To Be Announced"}
          </motion.p>
          {config?.venueName && (
            <motion.p variants={fadeUp} className="text-white/50 flex items-center justify-center gap-1 text-sm font-sans">
              <MapPin className="w-3 h-3" />
              {config.venueName}
            </motion.p>
          )}
          {weddingDate && config?.dateConfirmed && (
            <motion.div variants={fadeUp} className="mt-6">
              <Countdown targetDate={weddingDate} />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
        {/* Personal greeting */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center"
          data-testid="invite-greeting"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-sans px-4 py-2 rounded-full mb-4">
            <Heart className="w-3 h-3 fill-primary" />
            Personal Invitation
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Dear {invite.name},
          </h2>
          <p className="text-muted-foreground font-sans text-sm leading-relaxed">
            We joyfully invite you to share in the celebration of our wedding. Your presence would make our special day even more memorable.
          </p>
        </motion.div>

        {/* Upcoming events */}
        {events.length > 0 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-foreground">Wedding Events</h3>
            {events.map((ev) => (
              <Card key={ev.id} className="border-card-border" data-testid={`invite-event-${ev.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm font-sans">{ev.title}</p>
                        {ev.isMainEvent && <Badge variant="default" className="text-xs">Main</Badge>}
                      </div>
                      <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(ev.startTime).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        {new Date(ev.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {ev.venueName && (
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {ev.venueName}
                        </p>
                      )}
                    </div>
                    <a href={`/api/events/${ev.id}/calendar`} download>
                      <Button variant="ghost" size="sm" className="text-xs" data-testid={`invite-cal-${ev.id}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* RSVP Form */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <Card className="border-card-border" data-testid="rsvp-form-card">
            <CardHeader className="pb-2">
              <h3 className="font-serif text-2xl font-bold text-foreground">Your RSVP</h3>
              <p className="text-muted-foreground text-sm">Please let us know if you'll be joining us.</p>
            </CardHeader>
            <CardContent className="pt-4">
              {submitted ? (
                <RsvpSuccess status={finalStatus} guestName={invite.name} />
              ) : (
                <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                  {/* Attending choice */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setValue("rsvpStatus", "confirmed")}
                      className={`flex-1 py-3 rounded-md border font-sans text-sm font-medium transition-all flex items-center justify-center gap-2 ${rsvpStatus === "confirmed" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
                      data-testid="button-rsvp-yes"
                    >
                      <Check className="w-4 h-4" />
                      Joyfully Accepts
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue("rsvpStatus", "declined")}
                      className={`flex-1 py-3 rounded-md border font-sans text-sm font-medium transition-all flex items-center justify-center gap-2 ${rsvpStatus === "declined" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground"}`}
                      data-testid="button-rsvp-no"
                    >
                      <X className="w-4 h-4" />
                      Regretfully Declines
                    </button>
                  </div>

                  {/* Contact details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="inv-email" className="text-xs">Email</Label>
                      <Input
                        id="inv-email"
                        {...register("email")}
                        type="email"
                        placeholder="email@example.com"
                        className="mt-1"
                        data-testid="input-inv-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inv-phone" className="text-xs">Phone / WhatsApp</Label>
                      <Input
                        id="inv-phone"
                        {...register("phone")}
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="mt-1"
                        data-testid="input-inv-phone"
                      />
                    </div>
                  </div>

                  {rsvpStatus === "confirmed" && (
                    <>
                      {/* Plus one */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground font-sans">Bringing a plus one?</p>
                          <p className="text-muted-foreground text-xs">Subject to availability</p>
                        </div>
                        <Switch
                          checked={plusOne}
                          onCheckedChange={(v) => setValue("plusOne", v)}
                          data-testid="switch-inv-plus-one"
                        />
                      </div>

                      {plusOne && (
                        <div>
                          <Label htmlFor="inv-plusone" className="text-xs">Plus One's Name</Label>
                          <Input
                            id="inv-plusone"
                            {...register("plusOneName")}
                            placeholder="Their name"
                            className="mt-1"
                            data-testid="input-inv-plus-one-name"
                          />
                        </div>
                      )}

                      {/* Dietary */}
                      <div>
                        <Label htmlFor="inv-dietary" className="text-xs">Dietary Requirements</Label>
                        <Textarea
                          id="inv-dietary"
                          {...register("dietaryRequirements")}
                          placeholder="Allergies or special diet needs..."
                          rows={2}
                          className="mt-1"
                          data-testid="input-inv-dietary"
                        />
                      </div>

                      {/* WhatsApp opt-in */}
                      <div className="border border-green-200 dark:border-green-900 rounded-md p-4 bg-green-50/50 dark:bg-green-950/20 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-foreground font-sans">WhatsApp Reminders</p>
                              <p className="text-muted-foreground text-xs">Receive reminders & day-of updates</p>
                            </div>
                          </div>
                          <Switch
                            checked={whatsappOptIn}
                            onCheckedChange={(v) => setValue("whatsappOptIn", v)}
                            data-testid="switch-inv-whatsapp"
                          />
                        </div>
                        {whatsappOptIn && !phone && (
                          <p className="text-amber-600 dark:text-amber-400 text-xs">
                            Please enter your phone number above to receive WhatsApp messages.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Message */}
                  <div>
                    <Label htmlFor="inv-message" className="text-xs">A message for Kaustav & Himasree</Label>
                    <Textarea
                      id="inv-message"
                      {...register("message")}
                      placeholder="Share your wishes, memories, or excitement..."
                      rows={3}
                      className="mt-1"
                      data-testid="input-inv-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={mutation.isPending}
                    data-testid="button-submit-invite-rsvp"
                  >
                    {mutation.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
                    ) : (
                      rsvpStatus === "confirmed" ? "Confirm Attendance" : "Send Response"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-xs pb-8">
          <p>With love, Kaustav & Himasree</p>
          <a href="/" className="underline underline-offset-4 mt-1 inline-block">Visit Wedding Website</a>
        </div>
      </div>
    </div>
  );
}
