import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Heart, Check, X, MapPin, Calendar, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { z } from "zod";
import Header from "@/components/Header";
import FloatingContact from "@/components/FloatingContact";
import { useWeddingTheme } from "@/context/ThemeContext";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WeddingConfig, WeddingEvent } from "../../../shared/schema.js";

const rsvpFormSchema = z.object({
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20),
  childrenCount: z.number().int().min(0).max(20),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"]).optional(),
  eventsAttending: z.string(),
  dietaryRequirements: z.string().max(500),
  message: z.string().max(1000),
  accommodationRequired: z.boolean(),
}).refine(
  (data) => {
    if (data.rsvpStatus === "confirmed") {
      return data.eventsAttending && data.eventsAttending.length > 0;
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
type RsvpFormData = z.infer<typeof rsvpFormSchema>;

interface GuestData {
  id: string;
  name: string;
  rsvpStatus: string;
  adultsCount: number;
  childrenCount: number;
  foodPreference: string;
  eventsAttending: string;
  dietaryRequirements: string;
  message: string;
  side: string;
  accommodationRequired: boolean;
}

export default function Invite() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { side, setSide } = useWeddingTheme();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const { data: guest, isLoading: guestLoading, error: guestError } = useQuery<GuestData>({
    queryKey: ["/api/invite", slug],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!slug,
  });

  const { data: config } = useQuery<WeddingConfig>({
    queryKey: ["/api/config"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: events = [] } = useQuery<WeddingEvent[]>({
    queryKey: ["/api/events"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  useEffect(() => {
    if (guest?.side === "groom") setSide("groom");
    else if (guest?.side === "bride") setSide("bride");
  }, [guest?.side, setSide]);

  const form = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      rsvpStatus: "confirmed",
      adultsCount: 1,
      childrenCount: 0,
      foodPreference: "vegetarian",
      eventsAttending: "",
      dietaryRequirements: "",
      message: "",
      accommodationRequired: false,
    },
  });

  useEffect(() => {
    if (guest) {
      form.reset({
        rsvpStatus: guest.rsvpStatus === "declined" ? "declined" : "confirmed",
        adultsCount: guest.adultsCount || 1,
        childrenCount: guest.childrenCount || 0,
        foodPreference: (guest.foodPreference as "vegetarian" | "non-vegetarian") || "vegetarian",
        eventsAttending: guest.eventsAttending || "",
        dietaryRequirements: guest.dietaryRequirements || "",
        message: guest.message || "",
        accommodationRequired: guest.accommodationRequired || false,
      });
    }
  }, [guest, form]);

  const rsvpMutation = useMutation({
    mutationFn: async (data: RsvpFormData) => {
      const res = await apiRequest("POST", "/api/rsvp", { ...data, slug });
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/invite", slug] });
      toast({ title: "RSVP Submitted", description: "Thank you for your response!" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (guestLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--wedding-bg)" }}>
        <img 
          src="/ganesh.png" 
          alt="Lord Ganesh" 
          className="w-[80px] h-[80px] object-contain animate-pulse"
        />
      </div>
    );
  }

  if (guestError || !guest) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--wedding-bg)" }}>
        <div className="text-center p-8">
          <img 
            src="/ganesh.png" 
            alt="Lord Ganesh" 
            className="w-[80px] h-[80px] object-contain mx-auto mb-6 opacity-50"
          />
          <h1 className="font-serif text-2xl mb-2" style={{ color: "var(--wedding-text)" }}>
            Invite Not Found
          </h1>
          <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
            This invite link may be invalid or expired.
          </p>
        </div>
      </div>
    );
  }

  const alreadyRsvped = guest.rsvpStatus !== "pending";

  return (
    <>
      <Header />
      <main className="min-h-screen pt-14" style={{ background: "var(--wedding-bg)" }}>
        <section className="wedding-section">
          <div className="max-w-lg mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img 
                src="/ganesh.png" 
                alt="Lord Ganesh" 
                className="w-[80px] h-[80px] object-contain mx-auto mb-6"
              />
              <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: "var(--wedding-muted)" }}>
                You are cordially invited
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--wedding-text)" }}>
                Dear {guest.name}
              </h1>
              <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--wedding-muted)" }}>
                We would be honoured to have you celebrate the wedding of
              </p>
              
              {/* Two-column layout for Bride and Groom */}
              <div className="grid grid-cols-2 gap-6 mt-8 mb-6 relative">
                {/* Bride Column - LEFT */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img 
                    src="/bride.png" 
                    alt="Himasree" 
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full mx-auto mb-4 border-2"
                    style={{ borderColor: "var(--wedding-accent)" }}
                  />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--wedding-accent)" }}>
                    Himasree
                  </h3>
                  <div className="text-xs space-y-1" style={{ color: "var(--wedding-muted)" }}>
                    <p className="italic">Daughter of</p>
                    <p className="font-medium">Bandana Chakraborty</p>
                    <p className="font-medium">Tapan Chakraborty</p>
                  </div>
                </motion.div>

                {/* Stylish Vertical Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    {/* Top flourish */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mb-0.5">
                      <circle cx="12" cy="12" r="10" stroke="var(--wedding-accent)" strokeWidth="0.5" fill="none" opacity="0.6" />
                      <path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 Z" fill="var(--wedding-accent)" opacity="0.8" />
                    </svg>
                    
                    {/* Vertical line */}
                    <div 
                      className="w-[1.5px] h-20 sm:h-24 rounded-full"
                      style={{
                        background: `linear-gradient(180deg, var(--wedding-accent) 0%, transparent 50%, var(--wedding-accent) 100%)`,
                        opacity: 0.4
                      }}
                    />
                    
                    {/* Heart in middle */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: "var(--wedding-card-bg)",
                        border: "2px solid var(--wedding-accent)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      <span className="text-sm">💕</span>
                    </div>
                    
                    {/* Bottom flourish */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5">
                      <circle cx="12" cy="12" r="10" stroke="var(--wedding-accent)" strokeWidth="0.5" fill="none" opacity="0.6" />
                      <path d="M12 4 L13 10 L19 11 L13 12 L12 18 L11 12 L5 11 L11 10 Z" fill="var(--wedding-accent)" opacity="0.8" />
                    </svg>
                  </motion.div>
                </div>

                {/* Groom Column - RIGHT */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <img 
                    src="/groom.png" 
                    alt="Kaustav" 
                    className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full mx-auto mb-4 border-2"
                    style={{ borderColor: "var(--wedding-accent)" }}
                  />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2" style={{ color: "var(--wedding-accent)" }}>
                    Kaustav
                  </h3>
                  <div className="text-xs space-y-1" style={{ color: "var(--wedding-muted)" }}>
                    <p className="italic">Son of</p>
                    <p className="font-medium">Parbati Kumar</p>
                    <p className="font-medium">Debashis Kumar</p>
                  </div>
                </motion.div>
              </div>

              {config?.weddingDate && (
                <p className="font-serif text-base mt-3" style={{ color: "var(--wedding-text)" }}>
                  {new Date(config.weddingDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    timeZone: "Asia/Kolkata"
                  })}
                </p>
              )}
              <div className="gold-divider max-w-[200px] mx-auto mt-6" />
            </motion.div>

            {submitted || (alreadyRsvped && !form.formState.isDirty) ? (
              <motion.div
                className="rounded-xl p-8 text-center"
                style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                data-testid="rsvp-success"
              >
                {guest.rsvpStatus === "confirmed" ? (
                  <>
                    <Check size={48} className="mx-auto mb-4" style={{ color: "#22c55e" }} />
                    <h2 className="font-serif text-xl mb-2" style={{ color: "var(--wedding-text)" }}>
                      Thank You!
                    </h2>
                    <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                      We're thrilled you'll be joining us. We can't wait to celebrate with you!
                    </p>
                  </>
                ) : (
                  <>
                    <Heart size={48} className="mx-auto mb-4" style={{ color: "var(--wedding-accent)" }} />
                    <h2 className="font-serif text-xl mb-2" style={{ color: "var(--wedding-text)" }}>
                      We'll Miss You
                    </h2>
                    <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                      Thank you for letting us know. You'll be in our thoughts!
                    </p>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.form
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
                        onClick={() => {
                          form.setValue("rsvpStatus", status);
                          if (status === "declined") {
                            form.setValue("eventsAttending", "");
                            form.setValue("foodPreference", undefined);
                          }
                        }}
                        className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: form.watch("rsvpStatus") === status ? "var(--wedding-accent)" : "transparent",
                          color: form.watch("rsvpStatus") === status ? "#fff" : "var(--wedding-text)",
                          border: `1px solid ${form.watch("rsvpStatus") === status ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                        }}
                        data-testid={`rsvp-${status}`}
                      >
                        {status === "confirmed" ? "Joyfully Accept" : "Respectfully Decline"}
                      </button>
                    ))}
                  </div>
                </div>

                {form.watch("rsvpStatus") === "confirmed" && (
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
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs tracking-wide uppercase mb-2 block" style={{ color: "var(--wedding-accent)" }}>
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
                      </select>
                    </div>

                    <div className="p-4 rounded-lg" style={{ background: "var(--wedding-alt-bg)", border: "1px solid var(--wedding-border)" }}>
                      <label className="text-xs tracking-wide uppercase mb-3 block font-medium" style={{ color: "var(--wedding-accent)" }}>
                        🏨 Accommodation Required?
                      </label>
                      <div className="flex gap-3">
                        {([true, false] as const).map((value) => (
                          <button
                            key={String(value)}
                            type="button"
                            onClick={() => form.setValue("accommodationRequired", value)}
                            className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: form.watch("accommodationRequired") === value ? "var(--wedding-accent)" : "transparent",
                              color: form.watch("accommodationRequired") === value ? "#fff" : "var(--wedding-text)",
                              border: `1px solid ${form.watch("accommodationRequired") === value ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                            }}
                            data-testid={`accommodation-${value ? "yes" : "no"}`}
                          >
                            {value ? "Yes" : "No"}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs mt-2" style={{ color: "var(--wedding-muted)" }}>
                        Let us know if you need accommodation assistance during your stay.
                      </p>
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
                    placeholder="Share your wishes..."
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
              </motion.form>
            )}
          </div>
        </section>
      </main>
      <FloatingContact />
    </>
  );
}
