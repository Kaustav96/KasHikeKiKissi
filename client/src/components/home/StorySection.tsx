import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import {
    BookOpen, Camera, Sparkles, Heart, Film, Cake, TreePine, Laugh, Plane, Mountain
} from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { MandalaHalfOrnament } from "../RoyalOrnaments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ANIMATION_CONSTANTS } from "@/lib/animations";
import type { StoryMilestone } from "@shared/schema.ts";

const StorySection = React.memo(({ milestones, coupleStory }: { milestones: StoryMilestone[], coupleStory?: string }) => {
    if (milestones.length === 0 && !coupleStory) return null;

    const [selectedMilestone, setSelectedMilestone] = useState<StoryMilestone | null>(null);
    const [isCoupleStoryOpen, setIsCoupleStoryOpen] = useState(false);
    const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(0);
    const scrollProgressMotion = useMotionValue(0);
    const [scrollProgress, setScrollProgress] = useState<number>(0);
    const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Track scroll progress with IntersectionObserver for better performance
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        milestoneRefs.current.forEach((ref, index) => {
            if (!ref) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveMilestoneIndex(index);
                    }
                },
                {
                    threshold: 0.5,
                    rootMargin: "-20% 0px -20% 0px"
                }
            );

            observer.observe(ref);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [milestones.length]);

    // Track scroll progress for timeline animation
    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;

            const rect = timelineRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const timelineTop = rect.top;
            const timelineBottom = rect.bottom;
            const timelineHeight = rect.height;

            // Calculate progress (0 to 1)
            let progress = 0;
            if (timelineTop < viewportHeight && timelineBottom > 0) {
                progress = Math.min(
                    1,
                    Math.max(
                        0,
                        (viewportHeight - timelineTop) / timelineHeight
                    )
                );
            }
            setScrollProgress(progress);
            scrollProgressMotion.set(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollProgressMotion, milestones.length]);

    // Function to get icon and palette based on milestone title (memoized)
    const getMilestoneVisuals = useCallback((title: string, index: number) => {
        const t = title.toLowerCase();

        // Icon mapping based on milestone content
        let icon = Sparkles; // default
        if (t.includes('beginning')) icon = Heart;
        else if (t.includes('movie')) icon = Film;
        else if (t.includes('photo')) icon = Camera;
        else if (t.includes('birthday') || t.includes('isha')) icon = Cake;
        else if (t.includes('christmas')) icon = TreePine;
        else if (t.includes('comedy') || t.includes('laughter')) icon = Laugh;
        else if (t.includes('flight')) icon = Plane;
        else if (t.includes('siliguri') || t.includes('families') || t.includes('blessed')) icon = Mountain;

        // Color palette mapping for better thematic match
        let palette;
        if (t.includes('beginning')) {
            // Romantic pink/rose for beginning
            palette = { bg: "linear-gradient(135deg, #3B0A18 0%, #8B1A3A 45%, #C4547A 85%, #F8CEDC 100%)", glow: "rgba(196,84,122,0.5)", textLight: "#F8CEDC" };
        } else if (t.includes('movie')) {
            // Dark purple/cinema vibes
            palette = { bg: "linear-gradient(135deg, #130820 0%, #341466 45%, #6C2BBD 85%, #C09AEF 100%)", glow: "rgba(108,43,189,0.5)", textLight: "#DCC5F8" };
        } else if (t.includes('photo')) {
            // Blue for memories/photos
            palette = { bg: "linear-gradient(135deg, #060E1E 0%, #0D2653 45%, #2663A6 85%, #8AB4E0 100%)", glow: "rgba(38,99,166,0.5)", textLight: "#B8D4F5" };
        } else if (t.includes('birthday') || t.includes('isha')) {
            // Warm gold/spiritual
            palette = { bg: "linear-gradient(135deg, #2C1400 0%, #7B3800 45%, #CF8529 85%, #F5D890 100%)", glow: "rgba(207,133,41,0.5)", textLight: "#F5D890" };
        } else if (t.includes('christmas')) {
            // Green/festive for Christmas
            palette = { bg: "linear-gradient(135deg, #081910 0%, #133C22 45%, #1E6B3C 85%, #8DD4AC 100%)", glow: "rgba(30,107,60,0.5)", textLight: "#B8EDD4" };
        } else if (t.includes('comedy') || t.includes('laughter')) {
            // Bright yellow/orange for comedy
            palette = { bg: "linear-gradient(135deg, #2B0800 0%, #6B2200 45%, #C44B00 85%, #FFAA70 100%)", glow: "rgba(196,75,0,0.5)", textLight: "#FFD0A0" };
        } else if (t.includes('flight')) {
            // Sky blue for flight
            palette = { bg: "linear-gradient(135deg, #0A1A2E 0%, #1E4A7A 45%, #5B9BD5 85%, #B3D9FF 100%)", glow: "rgba(91,155,213,0.5)", textLight: "#D0E8FF" };
        } else if (t.includes('siliguri') || t.includes('families') || t.includes('blessed')) {
            // Mountain/nature tones - earthy greens and browns
            palette = { bg: "linear-gradient(135deg, #1A2B1A 0%, #3D5A3D 45%, #7A9D6F 85%, #C8E6C9 100%)", glow: "rgba(122,157,111,0.5)", textLight: "#E8F5E9" };
        } else {
            // Default gradient cycling
            const palettes = [
                { bg: "linear-gradient(135deg, #2C1400 0%, #7B3800 45%, #CF8529 85%, #F5D890 100%)", glow: "rgba(207,133,41,0.5)", textLight: "#F5D890" },
                { bg: "linear-gradient(135deg, #3B0A18 0%, #8B1A3A 45%, #C4547A 85%, #F8CEDC 100%)", glow: "rgba(196,84,122,0.5)", textLight: "#F8CEDC" },
                { bg: "linear-gradient(135deg, #060E1E 0%, #0D2653 45%, #2663A6 85%, #8AB4E0 100%)", glow: "rgba(38,99,166,0.5)", textLight: "#B8D4F5" },
            ];
            palette = palettes[index % palettes.length];
        }

        return { icon, palette };
    }, []);

    // Generate stable particles (prevents re-render jitter)
    const particles = useMemo(() => {
        return [...Array(6)].map(() => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 2,
            x: Math.random() * 10 - 5
        }));
    }, []);

    // Smooth sparkle animation using framer-motion transform
    const sparkleY = useTransform(scrollProgressMotion, [0, 1], ["0%", "100%"]);

    return (
        <section
            id="story"
            className="py-24 md:py-32 px-4 sm:px-8 relative overflow-hidden"
            style={{ background: "var(--wedding-alt-bg)" }}
            data-testid="story-section"
        >
            {/* Subtle background texture */}
            <div
                className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="absolute top-0 left-0 w-32 md:w-48 opacity-8 pointer-events-none">
                <MandalaHalfOrnament side="left" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 md:w-48 opacity-8 pointer-events-none">
                <MandalaHalfOrnament side="right" />
            </div>

            <div className="max-w-5xl mx-auto relative">
                {/* Section header */}
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: ANIMATION_CONSTANTS.duration.slow, ease: ANIMATION_CONSTANTS.easing.smooth }}
                >
                    <div
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
                        style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}
                    >
                        <BookOpen size={18} style={{ color: "var(--wedding-accent)" }} />
                    </div>
                    <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
                        Where Love Began
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
                        Our Story
                    </h2>
                    <SimpleDivider />
                </motion.div>

                {/* Timeline */}
                <div className="relative" ref={timelineRef}>
                    {/* Vertical centre line — desktop only */}
                    <div
                        className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-px pointer-events-none"
                        style={{
                            background: "linear-gradient(to bottom, transparent, var(--wedding-border) 8%, var(--wedding-border) 92%, transparent)",
                            transform: "translateX(-50%)",
                        }}
                    />

                    {/* Scroll progress line */}
                    <motion.div
                        className="hidden sm:block absolute left-1/2 top-0 w-px pointer-events-none"
                        style={{
                            background: "linear-gradient(to bottom, transparent, var(--wedding-accent) 8%, var(--wedding-accent) 92%, transparent)",
                            transform: "translateX(-50%)",
                            transformOrigin: "top",
                        }}
                        initial={{ height: "0%" }}
                        animate={{ height: `${scrollProgress * 100}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />

                    {/* Sparkle travel effect - smooth transform */}
                    {scrollProgress > 0 && (
                        <motion.div
                            className="hidden sm:block absolute left-1/2 w-2 h-2 rounded-full pointer-events-none -ml-1"
                            style={{
                                background: "var(--wedding-accent)",
                                boxShadow: "0 0 12px var(--wedding-accent), 0 0 6px var(--wedding-accent)",
                                top: sparkleY,
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.6, 1, 0.6],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}

                    {/* Couple Story Button - opens modal */}
                    {coupleStory && coupleStory.trim() !== "" && (
                        <motion.div
                            className="mb-12 sm:mb-16 flex justify-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: ANIMATION_CONSTANTS.duration.slow,
                                ease: ANIMATION_CONSTANTS.easing.smooth
                            }}
                        >
                            <Button
                                onClick={() => setIsCoupleStoryOpen(true)}
                                className="group relative overflow-hidden rounded-full px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-600"
                                style={{
                                    background: "var(--wedding-accent)",
                                    color: "var(--wedding-bg)",
                                    border: "2px solid var(--wedding-accent)"
                                }}
                            >
                                <motion.span
                                    className="relative z-10 flex items-center gap-3"
                                    whileHover={{ scale: 1.04 }}
                                >
                                    <Heart size={18} className="group-hover:animate-pulse" fill="currentColor" />
                                    Read Our Love Story
                                    <Sparkles size={16} className="group-hover:animate-pulse" />
                                </motion.span>
                                {/* Hover glow effect */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            </Button>
                        </motion.div>
                    )}

                    <div className="space-y-10 sm:space-y-16">
                        {milestones.map((milestone, idx) => {
                            const { icon: IconComp, palette } = getMilestoneVisuals(milestone.title, idx);
                            const isRight = idx % 2 === 1;
                            const isActive = idx === activeMilestoneIndex;

                            return (
                                <motion.div
                                    key={milestone.id}
                                    ref={(el) => (milestoneRefs.current[idx] = el)}
                                    className={`flex flex-col gap-6 sm:items-start sm:gap-0 ${isRight ? "sm:flex-row-reverse" : "sm:flex-row"
                                    }`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    transition={{
                                        duration: ANIMATION_CONSTANTS.duration.slow,
                                        delay: idx * ANIMATION_CONSTANTS.stagger.fast,
                                        ease: ANIMATION_CONSTANTS.easing.smooth
                                    }}
                                    data-testid={`story-milestone-${milestone.id}`}
                                >
                                    {/* ── Illustration panel with image preview ── */}
                                    <motion.div
                                        className={`w-full sm:flex-1 rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer transition-all duration-300 ${isActive ? "scale-105" : ""
                                        }`}
                                        style={{
                                            background: milestone.imageUrl ? 'transparent' : palette.bg,
                                            boxShadow: isActive
                                                ? `0 20px 80px ${palette.glow}, 0 0 0 3px var(--wedding-accent)`
                                                : `0 12px 50px ${palette.glow}`,
                                            height: "220px",
                                        }}
                                        onClick={() => setSelectedMilestone(milestone)}
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelectedMilestone(milestone);
                                            }
                                        }}
                                        aria-label={`View details for ${milestone.title}`}
                                    >
                                        {/* Background image with overlay */}
                                        {milestone.imageUrl && (
                                            <>
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${milestone.imageUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-0"
                                                    style={{
                                                        background: `linear-gradient(135deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.75) 100%)`,
                                                    }}
                                                />
                                            </>
                                        )}

                                        {/* Animated radial glow */}
                                        <motion.div
                                            className="absolute inset-0"
                                            style={{
                                                background: milestone.imageUrl
                                                    ? `radial-gradient(ellipse 70% 70% at 50% 50%, ${palette.glow} 0%, transparent 68%)`
                                                    : `radial-gradient(ellipse 70% 70% at 50% 50%, ${palette.glow} 0%, transparent 68%)`,
                                                opacity: milestone.imageUrl ? 0.6 : 0.8,
                                            }}
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.8, 1, 0.8],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        />

                                        {/* Floating particles - stable version */}
                                        {particles.map((p, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute rounded-full"
                                                style={{
                                                    width: p.size,
                                                    height: p.size,
                                                    background: palette.textLight,
                                                    opacity: 0.3,
                                                    left: `${p.left}%`,
                                                    top: `${p.top}%`,
                                                }}
                                                animate={{
                                                    y: [0, -20, 0],
                                                    x: [0, p.x, 0],
                                                    opacity: [0.2, 0.5, 0.2],
                                                }}
                                                transition={{
                                                    duration: 3 + p.delay,
                                                    repeat: Infinity,
                                                    delay: p.delay,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        ))}

                                        {/* Rotating decorative rings */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <motion.div
                                                className="absolute rounded-full border"
                                                style={{ width: 160, height: 160, borderColor: "rgba(255,255,255,0.15)" }}
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                            />
                                            <motion.div
                                                className="absolute rounded-full border"
                                                style={{ width: 100, height: 100, borderColor: "rgba(255,255,255,0.22)" }}
                                                animate={{ rotate: -360 }}
                                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            />
                                        </div>

                                        {/* Central icon with enhanced animation */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <motion.div
                                                className="rounded-full p-5 relative"
                                                style={{
                                                    background: "rgba(255,255,255,0.10)",
                                                    border: "1px solid rgba(255,255,255,0.20)",
                                                    backdropFilter: "blur(6px)",
                                                }}
                                                initial={{ scale: 0, rotate: -180 }}
                                                whileInView={{ scale: 1, rotate: 0 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: idx * 0.07 + 0.25,
                                                    type: "spring",
                                                    stiffness: 200,
                                                }}
                                                whileHover={{
                                                    scale: 1.15,
                                                    rotate: 5,
                                                    transition: { duration: 0.3 },
                                                }}
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.05, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                >
                                                    <IconComp size={32} style={{ color: palette.textLight }} />
                                                </motion.div>

                                                {/* Pulse effect */}
                                                <motion.div
                                                    className="absolute inset-0 rounded-full"
                                                    style={{
                                                        border: `2px solid ${palette.textLight}`,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        scale: [1, 1.5],
                                                        opacity: [0.5, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeOut",
                                                    }}
                                                />
                                            </motion.div>
                                        </div>

                                        {/* Bottom strip */}
                                        <div
                                            className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between"
                                            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 100%)" }}
                                        >
                                            <p
                                                className="text-[9px] tracking-[0.38em] uppercase font-semibold"
                                                style={{ color: "rgba(255,255,255,0.60)" }}
                                            >
                                                Chapter {String(idx + 1).padStart(2, "0")}
                                            </p>
                                            <p
                                                className="text-[8px] tracking-wider uppercase font-medium flex items-center gap-1"
                                                style={{ color: "rgba(255,255,255,0.50)" }}
                                            >
                                                <Camera size={10} /> Click to view
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* ── Timeline dot (desktop only) ── */}
                                    <div className="hidden sm:flex flex-col items-center justify-start flex-shrink-0 w-10 pt-20">
                                        <motion.div
                                            className="relative"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.07 + 0.4, type: "spring", stiffness: 300 }}
                                            animate={isActive ? { scale: 1.3 } : { scale: 1 }}
                                        >
                                            <div
                                                className="w-[14px] h-[14px] rounded-full transition-all duration-300"
                                                style={{
                                                    background: isActive ? "var(--wedding-accent)" : "var(--wedding-accent)",
                                                    boxShadow: isActive
                                                        ? "0 0 0 4px var(--wedding-alt-bg), 0 0 0 6px var(--wedding-accent), 0 0 20px var(--wedding-accent)"
                                                        : "0 0 0 4px var(--wedding-alt-bg), 0 0 0 6px var(--wedding-border)",
                                                }}
                                            />
                                            {/* Animated ring pulse */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                style={{
                                                    border: "2px solid var(--wedding-accent)",
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: isActive ? [1, 2.5] : [1, 2.5],
                                                    opacity: isActive ? [0.8, 0] : [0.6, 0],
                                                }}
                                                transition={{
                                                    duration: isActive ? 1.5 : 2,
                                                    repeat: Infinity,
                                                    delay: idx * 0.3,
                                                    ease: "easeOut",
                                                }}
                                            />
                                        </motion.div>
                                    </div>

                                    {/* ── Text panel ── */}
                                    <motion.div
                                        className={`w-full sm:flex-1 py-0 sm:py-6 ${isRight ? "sm:text-right" : "sm:text-left"
                                        }`}
                                        initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.07 + 0.5, duration: 0.6 }}
                                    >
                                        <motion.h3
                                            className="font-serif text-xl sm:text-2xl font-bold mb-3 leading-snug"
                                            style={{ color: "var(--wedding-text)" }}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.07 + 0.6, duration: 0.5 }}
                                        >
                                            {milestone.title}
                                        </motion.h3>
                                        <motion.div
                                            className={`h-[2px] w-10 mb-4 ${isRight ? "sm:ml-auto" : ""}`}
                                            style={{ background: "var(--wedding-accent)" }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: 40 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.07 + 0.7, duration: 0.5 }}
                                        />
                                        <motion.p
                                            className="text-sm leading-[1.85]"
                                            style={{ color: "var(--wedding-muted)" }}
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.07 + 0.8, duration: 0.5 }}
                                        >
                                            {milestone.description}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <Dialog open={!!selectedMilestone} onOpenChange={(open) => !open && setSelectedMilestone(null)}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedMilestone && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl" style={{ color: "var(--wedding-text)" }}>
                                    {selectedMilestone.title}
                                </DialogTitle>
                                <p className="text-xs tracking-wider uppercase mt-1" style={{ color: "var(--wedding-muted)" }}>
                                    {selectedMilestone.date}
                                </p>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedMilestone.imageUrl ? (
                                    <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--wedding-border)" }}>
                                        <img
                                            src={selectedMilestone.imageUrl}
                                            alt={selectedMilestone.title}
                                            className="w-full h-auto object-cover"
                                            style={{ maxHeight: "60vh", imageOrientation: "from-image" }}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="rounded-xl p-12 text-center border-2 border-dashed"
                                        style={{ borderColor: "var(--wedding-border)", background: "var(--wedding-alt-bg)" }}
                                    >
                                        <Camera size={48} className="mx-auto mb-4" style={{ color: "var(--wedding-muted)", opacity: 0.5 }} />
                                        <p className="text-sm font-medium mb-2" style={{ color: "var(--wedding-text)" }}>
                                            Memory Coming Soon
                                        </p>
                                        <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                                            We're curating the perfect photo for this special moment
                                        </p>
                                    </div>
                                )}
                                <div className="px-1">
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
                                        {selectedMilestone.description}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
                </motion.div>
            </Dialog>

            {/* Couple Story Modal */}
            <Dialog open={isCoupleStoryOpen} onOpenChange={setIsCoupleStoryOpen}>
                <DialogContent
                    className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
                    style={{
                        background: "var(--wedding-card-bg)",
                        border: "2px solid var(--wedding-accent)",
                    }}
                >
                    <DialogHeader>
                        <DialogTitle
                            className="font-serif text-2xl sm:text-3xl text-center pb-4"
                            style={{ color: "var(--wedding-text)" }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <motion.div
                                    className="absolute -top-4 right-6"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Heart size={14} style={{ color: "var(--wedding-accent)" }} fill="var(--wedding-accent)" />
                                </motion.div>
                                <span>Our Love Story</span>
                                <motion.div
                                    className="absolute -top-4 right-6"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Heart size={14} style={{ color: "var(--wedding-accent)" }} fill="var(--wedding-accent)" />
                                </motion.div>
                            </div>
                            <SimpleDivider />
                        </DialogTitle>
                    </DialogHeader>

                    <div className="relative overflow-hidden rounded-xl p-6 sm:p-8">
                        {/* Decorative background texture */}
                        <div
                            className="absolute inset-0 opacity-[0.035] pointer-events-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}
                        />

                        {/* Top decorative accent */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--wedding-accent)] to-transparent" />
                            <Sparkles size={16} style={{ color: "var(--wedding-accent)" }} />
                            <div className="w-12 h-px bg-gradient-to-l from-transparent via-[var(--wedding-accent)] to-transparent" />
                        </div>

                        {/* Story content */}
                        {/*<div className="prose prose-sm sm:prose-base mx-auto max-w-2xl relative z-10">*/}
                        {/*    <p*/}
                        {/*        className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-center"*/}
                        {/*        style={{ color: "var(--wedding-text)", opacity: 0.95 }}*/}
                        {/*    >*/}
                        {/*        {coupleStory}*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                        <div
                            className="text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 text-center"
                            style={{ color: "var(--wedding-text)", opacity: 0.95 }}
                        >
                            {coupleStory?.split("\n").map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>

                        {/* Bottom decorative accent */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--wedding-accent)] to-transparent" />
                            <span className="text-[var(--wedding-accent)] text-xs">✦</span>
                            <div className="w-12 h-px bg-gradient-to-l from-transparent via-[var(--wedding-accent)] to-transparent" />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
});

export default StorySection;