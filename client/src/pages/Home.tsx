import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ChevronDown, Heart,
  Loader2, Check, Phone, Navigation, Plane, Train, Car,
  BedDouble, Info, Shirt, Building,
  Users,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { z } from "zod";
import { Countdown } from "@/components/Countdown";
import KHCrest from "@/components/KHCrest";
import SplitSideSelection from "@/components/SplitSideSelection";
import WelcomeGreeting from "@/components/WelcomeGreeting";
import RoyalSealGate from "@/components/RoyalSealGate";
import DoorOpeningAnimation from "@/components/DoorOpeningAnimation";
import InvitationCardHero from "@/components/InvitationCardHero";
import Header from "@/components/Header";
import ViewingSideOverlay from "@/components/ViewingSideOverlay";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import FloatingContact from "@/components/FloatingContact";
import { MandalaHalfOrnament } from "@/components/RoyalOrnaments";
import type { WeddingConfig, WeddingEvent, Venue } from "@shared/schema.ts";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import HeroBokeh from "@/components/ui/HeroBokeh.tsx";
import SimpleDivider from "@/components/SimpleDivider";
import { getEventIcon, getWardrobeTip, getDressCodeColors } from "@/lib/weddingUtils";
import { ANIMATION_CONSTANTS } from "@/lib/animations";

// Lazy load heavy sections for better performance
const StorySection = lazy(() => import("@/components/home/StorySection"));
const EventsSection = lazy(() => import("@/components/home/EventsSection"));

import FindByInviteSection from "@/components/home/FindByInviteSection";
import ContactInfoSection from "@/components/home/ContactInfoSection";
import FooterSection from "@/components/home/FooterSection";
import RsvpSuccessModal from "@/components/rsvp/RsvpSuccessModal";

const HeroSection = React.memo(({ config }: { config: WeddingConfig }) => {
  // Use wedding theme colors for consistent palette across both sides
  const nameColor = "var(--wedding-accent)";
  const ampColor = "var(--wedding-accent)";
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center relative pt-14 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 50% 40%, rgba(198,167,94,0.18), transparent 60%),
          var(--wedding-hero-gradient)
        `
      }}
      data-testid="hero-section"
    >
      {/* Layer 1: Subtle texture pattern for depth */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Layer 2: Soft gold radial glow for richness */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 45%, rgba(185,151,91,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Layer 3: Ambient bokeh effect */}
      <HeroBokeh />

      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
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
          background: "radial-gradient(ellipse 60% 40% at 50% 45%, rgba(185,151,91,0.18) 0%, rgba(0,0,0,0) 70%)",
        }}
      />


      <motion.div
        className="text-center z-10 px-4 relative max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth, delay: ANIMATION_CONSTANTS.delay.medium }}
      >
        {/* Central crest above names */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: ANIMATION_CONSTANTS.duration.slow, delay: ANIMATION_CONSTANTS.delay.long, ease: ANIMATION_CONSTANTS.easing.smooth }}
            whileHover={{ scale: 1.05, rotate: 3 }}
          >
            <img 
              src="/ganesh.png" 
              alt="Lord Ganesh" 
              className="w-[110px] h-[110px] object-contain"
            />
          </motion.div>
        </div>

        <motion.p
          className="text-[11px] sm:text-xs tracking-[0.45em] uppercase mb-6 font-medium"
          style={{ color: "var(--wedding-muted)" }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: ANIMATION_CONSTANTS.duration.normal }}
        >
          The Wedding Celebration of
        </motion.p>

        <motion.h1
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-2"
          style={{ color: nameColor }}
          data-testid="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
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
            transition={{ delay: 0.85, duration: ANIMATION_CONSTANTS.duration.normal, ease: "easeOut" }}
          />
          <motion.span
            className="font-serif text-3xl sm:text-4xl italic"
            style={{ color: ampColor }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: ANIMATION_CONSTANTS.duration.normal }}
          >
            &amp;
          </motion.span>
          <motion.div
            className="h-px flex-1 max-w-[100px]"
            style={{ background: "linear-gradient(to left, transparent, var(--wedding-accent))" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: ANIMATION_CONSTANTS.duration.normal, ease: "easeOut" }}
          />
        </div>

        <motion.h1
          className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-10"
          style={{ color: nameColor }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
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
          transition={{ delay: 1, duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(46,43,39,0.12)" }}
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
                  timeZone: "Asia/Kolkata"
                })}
              </p>
              <Countdown targetDate={new Date(config.weddingDate)} />
            </>
          ) : (
            <p
              className="font-serif text-xl italic font-semibold"
              style={{ color: "var(--wedding-text)" }}
              data-testid="date-tbd"
            >
              Date TBD
            </p>
          )}

          {config.venueName && config.venueName !== "To Be Announced" && (
            <p
              className="mt-5 flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
              style={{ color: "var(--wedding-muted)" }}
            >
              <MapPin size={12} />
              {config.venueName}{config.venueAddress ? `, ${config.venueAddress}` : ""}
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
        whileHover={{ opacity: 0.9, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.65, behavior: "smooth" })}
        aria-label="Scroll down"
      >
        <ChevronDown size={22} />
      </motion.button>
    </section>
  );
});

const VenueSection = React.memo(({ venueList }: { venueList: Venue[] }) => {
  const [activeVenueIdx, setActiveVenueIdx] = useState(0);
  const [activeSubSection, setActiveSubSection] = useState<"map" | "stay" | "reach">("map");

  const venueLabels = ["Wedding", "Reception"];
  const venueCities = ["Siliguri", "Faridabad"];
  const activeVenue = venueList[activeVenueIdx] ?? null;

  // Normalize literal \n from Firestore into real newlines
  const normalizeNewlines = (text: string) => text.replace(/\\n/g, "\n");

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
    <section id="venue" className="py-24 md:py-32 px-4 sm:px-8 relative" style={{ background: "var(--wedding-alt-bg)" }} data-testid="venue-section">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
            whileHover={{ scale: 1.05, rotate: 6 }}
          >
            <Building size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Join Us Here
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Venue &amp; Travel
          </h2>
          <SimpleDivider />
        </motion.div>

        {/* ── Venue Tab Switcher (Wedding / Reception) ── */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {[0, 1].map((i) => (
            <motion.button
              key={i}
              onClick={() => { setActiveVenueIdx(i); setActiveSubSection("map"); }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeVenueIdx === i ? "var(--wedding-accent)" : "var(--wedding-card-bg)",
                color: activeVenueIdx === i ? "var(--wedding-bg)" : "var(--wedding-text)",
                border: `1px solid ${activeVenueIdx === i ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                boxShadow: activeVenueIdx === i ? "0 3px 16px rgba(176,132,72,0.22)" : "none",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              data-testid={`venue-tab-${i}`}
            >
              <MapPin size={14} />
              {venueLabels[i]}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeVenueIdx === i ? "rgba(0,0,0,0.2)" : "rgba(176,132,72,0.10)",
                  color: activeVenueIdx === i ? "var(--wedding-bg)" : "var(--wedding-accent)",
                }}
              >
                {venueCities[i]}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Sub-Section Tab Buttons ── */}
        <div className="flex gap-2 justify-center mb-7 flex-wrap">
          {subTabs.map(({ id, label, icon: SubIcon }) => (
            <motion.button
              key={id}
              onClick={() => setActiveSubSection(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeSubSection === id ? "rgba(176,132,72,0.15)" : "var(--wedding-card-bg)",
                color: activeSubSection === id ? "var(--wedding-accent)" : "var(--wedding-muted)",
                border: `1px solid ${activeSubSection === id ? "var(--wedding-accent)" : "var(--wedding-border)"}`,
                fontWeight: activeSubSection === id ? 600 : 400,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              data-testid={`venue-sub-${id}`}
            >
              <SubIcon size={13} />
              {label}
            </motion.button>
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
                {/* Venue name + address header (override with accommodation details on stay tab) */}
                <div className="mb-4">
                  <p className="font-serif text-lg font-semibold mb-1" style={{ color: "var(--wedding-text)" }}>
                    {activeSubSection === "stay" && activeVenue.accommodationName ? activeVenue.accommodationName : activeVenue.name}
                  </p>
                  <p className="text-sm flex items-start gap-2" style={{ color: "var(--wedding-muted)" }}>
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" style={{ color: "var(--wedding-accent)" }} />
                    {activeSubSection === "stay" && activeVenue.accommodationAddress ? activeVenue.accommodationAddress : activeVenue.address}
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
                          referrerPolicy="no-referrer-when-downgrade"
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
                          style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
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
                        {normalizeNewlines(activeVenue.accommodation)}
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                        Accommodation details will be shared soon. Please contact us for suggestions.
                      </p>
                    )}

                    {/* Accommodation Map */}
                    {(activeVenue.accommodationMapEmbedUrl || activeVenue.mapEmbedUrl) && (
                      <div className="mt-4">
                        <div className="rounded-xl overflow-hidden mb-3 border" style={{ borderColor: "var(--wedding-border)" }}>
                          <iframe
                            src={activeVenue.accommodationMapEmbedUrl || activeVenue.mapEmbedUrl}
                            width="100%"
                            height="220"
                            style={{ border: 0, display: "block" }}
                            allowFullScreen
                            loading="lazy"
                            title={`Accommodation Map - ${activeVenue.name}`}
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        {(activeVenue.accommodationMapUrl || activeVenue.mapUrl) && (
                          <a
                            href={activeVenue.accommodationMapUrl || activeVenue.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-medium transition-opacity hover:opacity-85"
                            style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
                          >
                            <Navigation size={12} /> Get Directions
                          </a>
                        )}
                      </div>
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

                    {/* Venue directions */}
                    {activeVenue.directions ? (
                      <div className="space-y-3">
                        {activeVenue.accommodationDirections && activeVenue.accommodationName && (
                          <h4 className="font-serif text-sm font-semibold" style={{ color: "var(--wedding-text)" }}>
                            📍 To {activeVenue.name}
                          </h4>
                        )}
                        <div
                          className="rounded-xl p-4 text-sm leading-[1.85] whitespace-pre-line"
                          style={{ background: "rgba(176,132,72,0.05)", border: "1px solid var(--wedding-border)", color: "var(--wedding-muted)" }}
                        >
                          {normalizeNewlines(activeVenue.directions)}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--wedding-muted)" }}>
                        Travel details coming soon. Feel free to reach out for directions.
                      </p>
                    )}

                    {/* Accommodation directions (only if different) */}
                    {activeVenue.accommodationDirections && activeVenue.accommodationName && (
                      <div className="mt-5 space-y-3">
                        <h4 className="font-serif text-sm font-semibold" style={{ color: "var(--wedding-text)" }}>
                          🏨 To {activeVenue.accommodationName}
                        </h4>
                        <div
                          className="rounded-xl p-4 text-sm leading-[1.85] whitespace-pre-line"
                          style={{ background: "rgba(176,132,72,0.05)", border: "1px solid var(--wedding-border)", color: "var(--wedding-muted)" }}
                        >
                          {normalizeNewlines(activeVenue.accommodationDirections)}
                        </div>
                      </div>
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
});

const publicRsvpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(200),
  rsvpStatus: z.enum(["confirmed", "declined"]),
  adultsCount: z.number().int().min(1).max(20),
  childrenCount: z.number().int().min(0).max(20),
  foodPreference: z.enum(["vegetarian", "non-vegetarian"], {
    errorMap: () => ({ message: "Please select your food preference" }),
  }).optional(),
  accommodationRequired: z.boolean().optional(),
  eventsAttending: z.array(z.string()).default([]),
  dietaryRequirements: z.string().max(500),
  message: z.string().max(1000),
  side: z.enum(["groom", "bride", "both"]),
}).superRefine((data, ctx) => {
  // Use superRefine to validate all conditional fields together
  // This ensures all errors appear simultaneously on submit
  if (data.rsvpStatus === "confirmed") {
    if (data.eventsAttending.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one event to attend",
        path: ["eventsAttending"],
      });
    }
    if (!data.foodPreference) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select your food preference",
        path: ["foodPreference"],
      });
    }
    if (data.accommodationRequired === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select your accommodation preference",
        path: ["accommodationRequired"],
      });
    }
  }
});
type PublicRsvpForm = z.infer<typeof publicRsvpFormSchema>;

function RsvpSection({ events, config, prefillGuest, onRsvpSuccess }: { events: WeddingEvent[]; config?: WeddingConfig | null; prefillGuest?: any; onRsvpSuccess?: () => void }) {
  const { toast } = useToast();
  const { side, setSide } = useWeddingTheme();
  const [checkingName, setCheckingName] = useState(false);
  const [foundGuests, setFoundGuests] = useState<any[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [showGuestSelectionPopup, setShowGuestSelectionPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successStatus, setSuccessStatus] = useState<"confirmed" | "declined" | null>(null);

  const form = useForm<PublicRsvpForm>({
    resolver: zodResolver(publicRsvpFormSchema),
    mode: "onSubmit", // Only validate on submit
    reValidateMode: "onChange", // After first submit, revalidate on change
    defaultValues: {
      name: "",
      rsvpStatus: undefined as any,
      adultsCount: 1,
      childrenCount: 0,
      foodPreference: undefined,
      accommodationRequired: undefined as any,
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

  // Auto-prefill when guest is selected from "Find Your Invitation"
  useEffect(() => {
    if (!prefillGuest) return;
    if (prefillGuest.side && prefillGuest.side !== side && prefillGuest.side !== "both") {
      setSide(prefillGuest.side);
    }

    // Check if this is an existing guest (has rsvpStatus) or new name (no rsvpStatus)
    const isExistingGuest = prefillGuest.rsvpStatus !== null;

    if (isExistingGuest) {
      // Full prefill for existing guest
      setIsUpdating(true);
      setSelectedGuest(prefillGuest);
      form.setValue("rsvpStatus", prefillGuest.rsvpStatus);
      form.setValue("adultsCount", prefillGuest.adultsCount || 1);
      form.setValue("childrenCount", prefillGuest.childrenCount || 0);
      form.setValue("foodPreference", prefillGuest.foodPreference || "");
      form.setValue("accommodationRequired", prefillGuest.accommodationRequired || false);
      form.setValue("eventsAttending", Array.isArray(prefillGuest.eventsAttending) ? prefillGuest.eventsAttending : []);
      form.setValue("dietaryRequirements", prefillGuest.dietaryRequirements || "");
      form.setValue("message", prefillGuest.message || "");
    }

    // Always set the name (whether existing or new)
    form.setValue("name", prefillGuest.name);
  }, [prefillGuest]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for existing guest by name
  const checkExistingGuest = async (name: string) => {
    if (!name || name.length < 3) {
      return;
    }

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
          // No guests found — if we were in update mode, exit it and reset fields
          setFoundGuests([]);
          if (isUpdating) {
            setIsUpdating(false);
            setSelectedGuest(null);
            form.reset({
              name,                              // keep the name they just typed
              rsvpStatus: undefined as any,
              adultsCount: 1,
              childrenCount: 0,
              foodPreference: "" as any,
              accommodationRequired: undefined as any,
              eventsAttending: [],
              dietaryRequirements: "",
              message: "",
              side: side as "groom" | "bride" | "both",
            });
          }
        }
      } else {
        // Name not in database — same reset logic
        setFoundGuests([]);
        if (isUpdating) {
          setIsUpdating(false);
          setSelectedGuest(null);
          form.reset({
            name,
            rsvpStatus: undefined as any,
            adultsCount: 1,
            childrenCount: 0,
            foodPreference: "" as any,
            accommodationRequired: undefined as any,
            eventsAttending: [],
            dietaryRequirements: "",
            message: "",
            side: side as "groom" | "bride" | "both",
          });
        }
      }
    } catch (err) {
      setFoundGuests([]);
    } finally {
      setCheckingName(false);
    }
  };

  // Debounced name check - triggers 500ms after user stops typing
  // Skip if already in update mode (e.g., coming from "Find My Invite")
  useEffect(() => {
    const name = form.watch("name");
    if (!name || name.length < 3) {
      return;
    }

    // Don't search if we're already updating an existing guest
    if (isUpdating) {
      return;
    }

    const timeout = setTimeout(() => {
      checkExistingGuest(name);
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.watch("name"), isUpdating]); // eslint-disable-line react-hooks/exhaustive-deps

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
    form.setValue("accommodationRequired", guest.accommodationRequired || false);
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
    setIsUpdating(false);
    setShowGuestSelectionPopup(false);
    // Keep the name but allow new RSVP
  };

  const rsvpMutation = useMutation({
    mutationFn: async (data: PublicRsvpForm) => {
      // If updating existing guest, use their ID - but verify name matches!
      if (isUpdating && selectedGuest) {
        // Safety check: ensure the name being submitted matches the selected guest
        if (data.name.trim().toLowerCase() !== selectedGuest.name.trim().toLowerCase()) {
          // Name mismatch - treat as new guest instead
          const res = await apiRequest("POST", "/api/rsvp/public", data);
          return res.json();
        }
        const res = await apiRequest("POST", "/api/rsvp", { ...data, slug: selectedGuest.inviteSlug });
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/rsvp/public", data);
        return res.json();
      }
    },
    onSuccess: (result) => {
      // Show premium confirmation modal
      setSuccessStatus(result.rsvpStatus);
      setShowSuccess(true);

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
        foodPreference: undefined,
        accommodationRequired: undefined as any,
        eventsAttending: [],
        dietaryRequirements: "",
        message: "",
        side: side as "groom" | "bride" | "both",
      });

      // Trigger search refresh if callback provided
      if (onRsvpSuccess) {
        onRsvpSuccess();
      }
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const rsvpStatus = form.watch("rsvpStatus");

  return (
    <section id="rsvp" className="py-24 md:py-32 px-4 sm:px-8 relative" style={{ background: "var(--wedding-bg)" }} data-testid="rsvp-section">
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
            whileHover={{ scale: 1.05, rotate: 6 }}
          >
            <Heart size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Join Us
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            RSVP
          </h2>
          <SimpleDivider />
          <p className="text-sm mt-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            Your presence would mean the world to us as we begin this beautiful journey together. Please share your joy with us by confirming your attendance.
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
                <motion.button
                  key={status}
                  type="button"
                  onClick={() => {
                    form.setValue("rsvpStatus", status);
                    if (status === "declined") {
                      form.setValue("eventsAttending", []);
                      form.setValue("foodPreference", undefined);
                      form.setValue("accommodationRequired", undefined as any);
                    }
                    // Don't trigger validation here - let it happen on submit
                  }}
                  className="flex-1 py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: rsvpStatus === status ? "var(--wedding-accent)" : "transparent",
                    color: rsvpStatus === status ? "#fff" : "var(--wedding-text)",
                    border: `1px solid ${rsvpStatus === status ? "var(--wedding-accent)" : "var(--wedding-border)"}`
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  data-testid={`rsvp-${status}`}
                >
                  {status === "confirmed" ? "Joyfully Accept" : "Respectfully Decline"}
                </motion.button>
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
                    onChange={(e) => {
                      const newName = e.target.value;
                      // Validate after form has been submitted once, to clear errors
                      form.setValue("name", newName, {
                        shouldValidate: form.formState.isSubmitted,
                      });

                      // AGGRESSIVE state clearing: if name doesn't match selected guest, clear everything
                      if (selectedGuest && newName.trim().toLowerCase() !== selectedGuest.name.trim().toLowerCase()) {
                        setIsUpdating(false);
                        setSelectedGuest(null);
                        setFoundGuests([]);
                        // Keep rsvpStatus (form stays open), only clear detail fields
                        form.setValue("adultsCount", 1);
                        form.setValue("childrenCount", 0);
                        form.setValue("foodPreference", "" as any);
                        form.setValue("accommodationRequired", undefined as any);
                        form.setValue("eventsAttending", []);
                        form.setValue("dietaryRequirements", "");
                        form.setValue("message", "");
                      }
                    }}
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

                              // Only validate after form has been submitted once
                              form.setValue("eventsAttending", next, {
                                shouldValidate: form.formState.isSubmitted
                              });
                            }}
                            className="sr-only"
                          />
                          <span className="text-sm">{ev.title}</span>
                          <span className="text-[10px] ml-auto opacity-70">
                            {new Date(ev.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" })}
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
                      onChange={(e) => {
                        const value = e.target.value;
                        // Only validate after form has been submitted once, to clear errors
                        form.setValue("foodPreference", value as any, {
                          shouldValidate: form.formState.isSubmitted,
                        });
                      }}
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
                      Accommodation Required? *
                    </label>
                    <select
                      value={
                        form.watch("accommodationRequired") === undefined 
                          ? "" 
                          : form.watch("accommodationRequired") 
                          ? "yes" 
                          : "no"
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          form.setValue("accommodationRequired", undefined as any, {
                            shouldValidate: form.formState.isSubmitted,
                          });
                        } else {
                          form.setValue("accommodationRequired", value === "yes", {
                            shouldValidate: form.formState.isSubmitted,
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-lg text-sm"
                      style={{ background: "var(--wedding-bg)", border: "1px solid var(--wedding-border)", color: "var(--wedding-text)" }}
                      data-testid="select-accommodation"
                    >
                      <option value="">Select your preference</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                    {form.formState.errors.accommodationRequired && (
                      <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{form.formState.errors.accommodationRequired.message}</p>
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

              <motion.button
                type="submit"
                disabled={rsvpMutation.isPending}
                className="w-full py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="submit-rsvp"
              >
                {rsvpMutation.isPending ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Submit RSVP"
                )}
              </motion.button>
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
              onClick={() => {
                setShowGuestSelectionPopup(false);
                setFoundGuests([]);
                setIsUpdating(false);
                setSelectedGuest(null);
              }}
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

        {/* Premium Success Modal */}
        <RsvpSuccessModal
          open={showSuccess}
          status={successStatus}
          config={config || null}
          onClose={() => setShowSuccess(false)}
        />
      </div>
    </section>
  );
}

const WardrobePlannerSection = React.memo(({ events }: { events: WeddingEvent[] }) => {
  const [activeTip, setActiveTip] = useState<number | null>(null);
  const { side } = useWeddingTheme();

  // Filter events based on current side
  const filteredEvents = useMemo(() => {
    if (side === "groom" || side === "bride") {
      return events.filter((e) => e.side === side || e.side === "both");
    }
    return events;
  }, [events, side]);

  const wardrobeItems = filteredEvents.map((ev) => {
    const { style, desc, tip, footwear, imageUrl } = getWardrobeTip(ev.title, ev.dressCode);
    const colors = getDressCodeColors(ev.title);
    const date = new Date(ev.startTime).toLocaleDateString("en-IN", { month: "short", day: "numeric", timeZone: "Asia/Kolkata" });
    return {
      id: ev.id,
      event: ev.title,
      date,
      icon: getEventIcon(ev.title),
      colors,
      style,
      desc,
      tip,
      footwear,
      imageUrl,
    };
  });

  const sideName = side === "groom" ? "Kaustav's" : "Himasree's";

  return (
    <section id="wardrobe" className="py-24 md:py-32 px-4 sm:px-8 relative" style={{ background: "var(--wedding-bg)" }} data-testid="wardrobe-section">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
            whileHover={{ scale: 1.05, rotate: 6 }}
          >
            <Shirt size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Dress Your Best
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Wardrobe Planner
          </h2>
          <SimpleDivider />
          <p className="text-xs mt-4 mb-2" style={{ color: "var(--wedding-accent)", opacity: 0.8 }}>
            Events for {sideName} side
          </p>
          <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
            Tap the <Info size={11} className="inline mx-0.5" style={{ color: "var(--wedding-accent)" }} /> for our styling suggestions for each celebration
          </p>
        </motion.div>

        {wardrobeItems.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "var(--wedding-card-bg)", border: "1px dashed var(--wedding-border)" }}
          >
            <Shirt size={28} className="mx-auto mb-3" style={{ color: "var(--wedding-muted)", opacity: 0.5 }} />
            <p className="font-serif text-base mb-1" style={{ color: "var(--wedding-text)" }}>
              No Events Yet
            </p>
            <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
              Wardrobe suggestions for {sideName} side will be shared soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {wardrobeItems.map((item, idx) => {
            const ItemIcon = item.icon;
            const isOpen = activeTip === idx;
            return (
              <motion.div
                key={item.id}
                className="rounded-2xl overflow-hidden hover:shadow-xl transition-all"
                style={{
                  background: "var(--wedding-card-bg)",
                  border: "1px solid var(--wedding-border)",
                  boxShadow: isOpen ? "0 4px 20px rgba(46,43,39,0.08)" : "0 1px 6px rgba(46,43,39,0.04)",
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: idx * ANIMATION_CONSTANTS.stagger.fast,
                  duration: ANIMATION_CONSTANTS.duration.slow,
                  ease: ANIMATION_CONSTANTS.easing.smooth
                }}
                whileHover={{ y: -4 }}
              >
                {/* Dress code color swatches */}
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <div className="flex gap-1.5 items-center flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center border"
                      style={{ backgroundColor: item.colors.primary, borderColor: "rgba(0,0,0,0.1)" }}
                    >
                      <Shirt size={18} style={{ color: "rgba(255,255,255,0.9)", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                    </div>
                    <div
                      className="w-7 h-7 rounded-md border"
                      style={{ backgroundColor: item.colors.secondary, borderColor: "rgba(0,0,0,0.1)" }}
                    />
                    <div
                      className="w-7 h-7 rounded-md border"
                      style={{ backgroundColor: item.colors.tertiary, borderColor: "rgba(0,0,0,0.1)" }}
                    />
                    <p className="text-[9px] tracking-[0.15em] uppercase ml-1" style={{ color: "var(--wedding-muted)", opacity: 0.6 }}>
                      COLOR PALETTE
                    </p>
                  </div>
                </div>

                {/* Card header row */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-t" style={{ borderColor: "var(--wedding-border)" }}>
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
                  <motion.button
                    onClick={() => setActiveTip(isOpen ? null : idx)}
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isOpen ? "var(--wedding-accent)" : "rgba(176,132,72,0.10)",
                      border: "1px solid var(--wedding-border)",
                      color: isOpen ? "#fff" : "var(--wedding-accent)",
                    }}
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Show style tip"
                  >
                    <Info size={13} />
                  </motion.button>
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
          These are heartfelt suggestions — we want you to feel beautiful and comfortable celebrating with us!
        </motion.p>
          </>
        )}
      </div>
    </section>
  );
});

export default function Home() {
  const { setMusicUrl, fadeIn, stop, setOnTrackEnd, hasStarted, isPlaying } = useMusic();
  const { setSide, side } = useWeddingTheme();

  // New flow states
  const [splitSelectionDone, setSplitSelectionDone] = useState(false); // Step 1: Split side selection
  const [greetingShown, setGreetingShown] = useState(false); // Step 2: Welcome greeting
  const [sealClicked, setSealClicked] = useState(false); // Step 3: Seal clicked
  const [showMainSite, setShowMainSite] = useState(false); // Step 4: Show main website

  const [pendingRsvpGuest, setPendingRsvpGuest] = useState<any>(null);
  const [searchTrigger, setSearchTrigger] = useState<{ fn: () => void; query: string } | null>(null);
  const currentPlaylistRef = useRef<string[]>([]);
  const currentTrackIndexRef = useRef<number>(0);
  const isBackgroundMusicRef = useRef<boolean>(false);
  const prevSideSelectedRef = useRef<boolean>(false);

  /* ================= NO SIDE PREFERENCE STORAGE - ALWAYS SHOW CREST ================= */

  /* ================= SINGLE PUBLIC QUERY ================= */

  const { data, isLoading } = useQuery({
    queryKey: ["public-home"],  // Remove side from query key to prevent refetching on side switch
    queryFn: async () => {
      const res = await apiRequest(
        "GET",
        `/api/public/home?side=both`  // Always fetch all data, filter client-side
      );
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - wedding data rarely changes
    refetchOnWindowFocus: false, // Avoid unnecessary refetches on tab switch
    refetchOnReconnect: true,
  });

  const config = data?.config;

  // Filter events client-side based on current side to avoid server refetch on side switch
  const events = useMemo(() => {
    if (!data?.allEvents) return [];
    if (side === "groom" || side === "bride") {
      return data.allEvents.filter((e: any) => e.side === side || e.side === "both");
    }
    return data.allEvents;
  }, [data?.allEvents, side]);

  const milestones = data?.stories ?? [];
  const venueList = data?.venues ?? [];

  // Use all events (unfiltered) from home endpoint for RSVP form
  const allEvents = data?.allEvents ?? [];

  /* ================= MUSIC SETUP ================= */

  const { playlist, isBackgroundMusic } = useMemo(() => {
    if (!config) return { playlist: [], isBackgroundMusic: false };

    // Priority: Background music > Groom/Bride specific
    if (Array.isArray(config.backgroundMusicUrl) && config.backgroundMusicUrl.length) {
      const bgPlaylist = config.backgroundMusicUrl.filter(Boolean).map((track: any) =>
        typeof track === 'object' ? track.url : track
      ).filter(Boolean);
      return { playlist: bgPlaylist, isBackgroundMusic: true };
    }

    if (side === "groom" && config.groomMusicUrls?.length) {
      const groomPlaylist = config.groomMusicUrls.filter(Boolean).map((track: any) =>
        typeof track === 'object' ? track.url : track
      ).filter(Boolean);
      return { playlist: groomPlaylist, isBackgroundMusic: false };
    }

    if (side === "bride" && config.brideMusicUrls?.length) {
      const bridePlaylist = config.brideMusicUrls.filter(Boolean).map((track: any) =>
        typeof track === 'object' ? track.url : track
      ).filter(Boolean);
      return { playlist: bridePlaylist, isBackgroundMusic: false };
    }

    return { playlist: [], isBackgroundMusic: false };
  }, [config, side]);

  /* ================= APPLY PLAYLIST WHEN IT CHANGES ================= */

  useEffect(() => {
    if (!playlist.length || !showMainSite) return;

    // ALWAYS update this ref first to track that side has been selected
    // This prevents isFreshSelection from being true on multiple effect runs
    const isFreshSelection = !prevSideSelectedRef.current && showMainSite;
    prevSideSelectedRef.current = showMainSite;

    // CRITICAL: If music has already been started (playing OR paused) and we're using background music,
    // NEVER restart it - preserve the current state (playing or paused position)
    // This is the highest priority check and must come first
    if (hasStarted && isBackgroundMusic) {
      // Music already started, preserve its current state
      // Update the ref so future comparisons work correctly
      currentPlaylistRef.current = playlist;
      return; // Exit immediately - music state is preserved
    }

    // Check if playlist actually changed (compare URLs)
    const playlistChanged =
      currentPlaylistRef.current.length !== playlist.length ||
      currentPlaylistRef.current.some((url, idx) => url !== playlist[idx]);

    // Update refs
    const wasBackgroundMusic = isBackgroundMusicRef.current;
    isBackgroundMusicRef.current = isBackgroundMusic;


    // Start music if:
    // 1. Fresh selection (user just picked a side) AND playlist changed OR
    // 2. (Playlist changed AND not background music transition)
    // This keeps background music continuous when switching sides
    const shouldStartMusic =
      (isFreshSelection && playlistChanged) ||
      (playlistChanged && (!isBackgroundMusic || !wasBackgroundMusic));

    if (shouldStartMusic) {
      console.log('[Home] Starting music. Fresh:', isFreshSelection, 'Changed:', playlistChanged);
      currentPlaylistRef.current = playlist;
      currentTrackIndexRef.current = 0;
      stop();
      setMusicUrl(playlist[0]);

      // Fade in music after side selection
      setTimeout(() => {
        fadeIn();
      }, 1000);
    } else {
      // Update ref even if we didn't start music
      console.log('[Home] Not starting music. Updating ref only.');
      currentPlaylistRef.current = playlist;
    }
  }, [playlist, isBackgroundMusic, showMainSite, stop, setMusicUrl, fadeIn, hasStarted, isPlaying]);

  /* ================= AUTO NEXT TRACK ================= */

  useEffect(() => {
    const handleEnded = () => {
      const playlist = currentPlaylistRef.current;
      if (playlist.length <= 1) return;

      // Get next track in playlist
      const next = (currentTrackIndexRef.current + 1) % playlist.length;
      currentTrackIndexRef.current = next;
      setMusicUrl(playlist[next]);
      fadeIn();
    };

    setOnTrackEnd(handleEnded);
    return () => setOnTrackEnd(null);
  }, [setOnTrackEnd, fadeIn, setMusicUrl]);

  /* ================= VIEW COUNT ================= */

  useEffect(() => {
    const hasIncremented = sessionStorage.getItem("view_counted");
    console.log("[VIEW COUNT DEBUG] Has already incremented:", hasIncremented);
    if (!hasIncremented) {
      console.log("[VIEW COUNT DEBUG] Calling increment-view API...");
      apiRequest("POST", "/api/increment-view")
        .then((response) => {
          console.log("[VIEW COUNT DEBUG] Increment successful:", response);
        })
        .catch((error) => {
          console.error("[VIEW COUNT DEBUG] Increment failed:", error);
        });
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

  /* ================= ENTRANCE SEQUENCE: SPLIT SELECTION -> GREETING -> SEAL -> DOOR ANIMATION -> MAIN ================= */

  // Step 1: Split Side Selection (Landing Page)
  if (!splitSelectionDone) {
    return (
      <SplitSideSelection
        onSelectSide={(selectedSide) => {
          setSide(selectedSide);
          setSplitSelectionDone(true);
        }}
      />
    );
  }

  // Step 2: Welcome Greeting Animation
  if (!greetingShown) {
    return (
      <WelcomeGreeting
        side={side}
        onComplete={() => {
          setGreetingShown(true);
        }}
      />
    );
  }

  // Step 3: Royal Seal Gate
  if (!sealClicked) {
    return (
      <RoyalSealGate
        currentSide={side}
        onOpen={() => {
          // After seal opens, show main site directly
          setSealClicked(true);
          // Short delay then show main site
          setTimeout(() => {
            setShowMainSite(true);
          }, 900);
        }}
        onBackToSelection={() => {
          // Go back to split selection (reset entire flow)
          setSplitSelectionDone(false);
          setGreetingShown(false);
        }}
        onSelectSide={(newSide) => {
          // Allow switching side from seal page without going back
          setSide(newSide);
        }}
      />
    );
  }

  // Step 4: Main Wedding Website
  return (
    <motion.div
      key="main"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
    >
      <Header />

      <ViewingSideOverlay
        onBackToSelection={() => {
          // Go back to split selection (reset entire flow)
          setShowMainSite(false);
          setSealClicked(false);
          setGreetingShown(false);
          setSplitSelectionDone(false);
        }}
        onSideChange={(newSide) => {
          setSide(newSide);
        }}
      />

      <main>
        {/* Invitation Card as Hero */}
        <InvitationCardHero config={config} />
            <FindByInviteSection
              onEditRsvp={(guest) => {
                setPendingRsvpGuest(guest);
                setTimeout(() => {
                  const el = document.getElementById("rsvp");
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.replaceState(null, "", window.location.pathname);
                  }
                }, 80);
              }}
              onSubmitDirect={(name) => {
                // Pre-fill just the name, user will select Accept/Decline
                setPendingRsvpGuest({ name, rsvpStatus: null });
              }}
              onSearchReady={(searchFn, currentQuery) => {
                setSearchTrigger({ fn: searchFn, query: currentQuery });
              }}
            />
            <Suspense fallback={<div className="py-24 md:py-32" />}>
              <EventsSection events={events} />
            </Suspense>
            <VenueSection venueList={venueList} />
            {/* <WardrobePlannerSection events={allEvents} /> */}
            <Suspense fallback={<div className="py-24 md:py-32" />}>
              <StorySection milestones={milestones} coupleStory={config?.coupleStory} />
            </Suspense>
            <RsvpSection
              events={allEvents}
              config={config}
              prefillGuest={pendingRsvpGuest}
              onRsvpSuccess={() => {
                // Auto-refresh search if there's an active query
                // Increased delay to 1.5s to ensure backend has processed changes (deletions, updates, etc.)
                if (searchTrigger && searchTrigger.query.trim().length >= 2) {
                  setTimeout(() => {
                    searchTrigger.fn();
                  }, 1500);
                }
              }}
            />
            <ContactInfoSection />
            <FooterSection />
          </main>

      <FloatingContact />
    </motion.div>
  );
}
