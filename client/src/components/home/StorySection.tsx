import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import {
    BookOpen, Camera, Sparkles, Heart, Film, Cake, TreePine, Laugh, Plane, Mountain
} from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { MandalaHalfOrnament } from "../RoyalOrnaments";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ANIMATION_CONSTANTS } from "@/lib/animations";
import type { StoryMilestone } from "@shared/schema.ts";

const StorySection = React.memo(({ milestones, coupleStory }: { milestones: StoryMilestone[]; coupleStory?: string }) => {
    if (milestones.length === 0) return null;

    const [selectedMilestone, setSelectedMilestone] = useState<StoryMilestone | null>(null);
    const [showCoupleStory, setShowCoupleStory] = useState(false);
    const controls = useAnimation();
    const animationRef = useRef<{ startTime: number; pausedAt: number } | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const motionDivRef = useRef<HTMLDivElement | null>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const userScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Duplicate milestones for seamless infinite scroll (5 copies for smooth infinite experience)
    const duplicatedMilestones = useMemo(() => {
        return [...milestones, ...milestones, ...milestones, ...milestones, ...milestones];
    }, [milestones]);

    // Initialize animation on mount
    useEffect(() => {
        const startAnimation = () => {
            animationRef.current = { startTime: Date.now(), pausedAt: 0 };

            // With 5 copies, animate from -20% to -80% for smooth infinite loop
            controls.start({
                x: ["-20%", "-80%"],
                transition: {
                    duration: 60,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                }
            });
        };

        startAnimation();

        return () => {
            controls.stop();
        };
    }, [controls]);

    // Handle scroll lock when modal opens and preserve position
    useEffect(() => {
        if (selectedMilestone || showCoupleStory) {
            // Pause animation and record current time
            if (animationRef.current) {
                animationRef.current.pausedAt = Date.now();
            }
            controls.stop();
            // Lock body scroll
            document.body.style.overflow = 'hidden';
        } else if (animationRef.current && animationRef.current.pausedAt > 0 && !isUserScrolling) {
            // Small delay to ensure smooth transition
            const resumeTimer = setTimeout(() => {
                if (!isUserScrolling && !selectedMilestone) {
                    // Calculate how much time has elapsed in the animation
                    const elapsed = (animationRef.current!.pausedAt - animationRef.current!.startTime) % 60000;
                    const progress = elapsed / 60000; // 0 to 1
                    const currentPercent = -20 - (progress * 60); // -20 to -80

                    // Resume from current position
                    controls.start({
                        x: [`${currentPercent}%`, "-80%"],
                        transition: {
                            duration: 60 * (1 - progress),
                            ease: "linear",
                            repeat: Infinity,
                            repeatType: "loop",
                        }
                    });

                    // Reset start time for next pause
                    animationRef.current!.startTime = Date.now() - elapsed;
                    animationRef.current!.pausedAt = 0;
                }
            }, 100); // Small delay for smooth transition

            // Unlock body scroll
            document.body.style.overflow = '';

            return () => clearTimeout(resumeTimer);
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedMilestone, showCoupleStory, controls, isUserScrolling]);

    // Handle user interaction (wheel/touch) - pause animation temporarily
    const handleUserInteraction = useCallback(() => {
        // Pause auto-animation immediately
        if (!isUserScrolling) {
            setIsUserScrolling(true);
            if (animationRef.current && !selectedMilestone) {
                animationRef.current.pausedAt = Date.now();
            }
            controls.stop();
        }

        // Clear existing timeout
        if (userScrollTimeoutRef.current) {
            clearTimeout(userScrollTimeoutRef.current);
        }

        // Resume auto-animation after user stops scrolling for 1 second
        userScrollTimeoutRef.current = setTimeout(() => {
            setIsUserScrolling(false);
        }, 1000);
    }, [controls, selectedMilestone, isUserScrolling]);

    // Attach interaction event listeners
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // For desktop mouse wheel
        const handleWheel = () => handleUserInteraction();

        // For mobile touch
        const handleTouchStart = () => handleUserInteraction();
        const handleTouchMove = () => handleUserInteraction();

        container.addEventListener('wheel', handleWheel, { passive: true });
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            if (userScrollTimeoutRef.current) {
                clearTimeout(userScrollTimeoutRef.current);
            }
        };
    }, [handleUserInteraction]);

    const getMilestoneVisuals = useCallback((title: string, index: number) => {
        const t = title.toLowerCase();

        // Icon mapping
        let icon = Sparkles;
        if (t.includes('beginning')) icon = Heart;
        else if (t.includes('movie')) icon = Film;
        else if (t.includes('photo')) icon = Camera;
        else if (t.includes('birthday') || t.includes('isha')) icon = Cake;
        else if (t.includes('christmas')) icon = TreePine;
        else if (t.includes('comedy') || t.includes('laughter')) icon = Laugh;
        else if (t.includes('flight')) icon = Plane;
        else if (t.includes('siliguri') || t.includes('families') || t.includes('blessed')) icon = Mountain;

        // Color palette mapping
        let palette;
        if (t.includes('beginning')) {
            palette = { bg: "linear-gradient(135deg, #3B0A18 0%, #8B1A3A 45%, #C4547A 85%, #F8CEDC 100%)", glow: "rgba(196,84,122,0.5)", textLight: "#F8CEDC" };
        } else if (t.includes('movie')) {
            palette = { bg: "linear-gradient(135deg, #130820 0%, #341466 45%, #6C2BBD 85%, #C09AEF 100%)", glow: "rgba(108,43,189,0.5)", textLight: "#DCC5F8" };
        } else if (t.includes('photo')) {
            palette = { bg: "linear-gradient(135deg, #060E1E 0%, #0D2653 45%, #2663A6 85%, #8AB4E0 100%)", glow: "rgba(38,99,166,0.5)", textLight: "#B8D4F5" };
        } else if (t.includes('birthday') || t.includes('isha')) {
            palette = { bg: "linear-gradient(135deg, #2C1400 0%, #7B3800 45%, #CF8529 85%, #F5D890 100%)", glow: "rgba(207,133,41,0.5)", textLight: "#F5D890" };
        } else if (t.includes('christmas')) {
            palette = { bg: "linear-gradient(135deg, #081910 0%, #133C22 45%, #1E6B3C 85%, #8DD4AC 100%)", glow: "rgba(30,107,60,0.5)", textLight: "#B8EDD4" };
        } else if (t.includes('comedy') || t.includes('laughter')) {
            palette = { bg: "linear-gradient(135deg, #2B0800 0%, #6B2200 45%, #C44B00 85%, #FFAA70 100%)", glow: "rgba(196,75,0,0.5)", textLight: "#FFD0A0" };
        } else if (t.includes('flight')) {
            palette = { bg: "linear-gradient(135deg, #0A1A2E 0%, #1E4A7A 45%, #5B9BD5 85%, #B3D9FF 100%)", glow: "rgba(91,155,213,0.5)", textLight: "#D0E8FF" };
        } else if (t.includes('siliguri') || t.includes('families') || t.includes('blessed')) {
            palette = { bg: "linear-gradient(135deg, #1A2B1A 0%, #3D5A3D 45%, #7A9D6F 85%, #C8E6C9 100%)", glow: "rgba(122,157,111,0.5)", textLight: "#E8F5E9" };
        } else {
            const palettes = [
                { bg: "linear-gradient(135deg, #2C1400 0%, #7B3800 45%, #CF8529 85%, #F5D890 100%)", glow: "rgba(207,133,41,0.5)", textLight: "#F5D890" },
                { bg: "linear-gradient(135deg, #3B0A18 0%, #8B1A3A 45%, #C4547A 85%, #F8CEDC 100%)", glow: "rgba(196,84,122,0.5)", textLight: "#F8CEDC" },
                { bg: "linear-gradient(135deg, #060E1E 0%, #0D2653 45%, #2663A6 85%, #8AB4E0 100%)", glow: "rgba(38,99,166,0.5)", textLight: "#B8D4F5" },
            ];
            palette = palettes[index % palettes.length];
        }

        return { icon, palette };
    }, []);

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

            {/* Section header */}
            <div className="max-w-5xl mx-auto relative">
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

                {/* Couple Story Button */}
                {coupleStory && (
                    <motion.div
                        className="text-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <motion.button
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                            style={{
                                background: "var(--wedding-accent)",
                                color: "var(--wedding-bg)",
                                border: "1px solid var(--wedding-accent)",
                                boxShadow: "0 4px 20px rgba(176,132,72,0.25)",
                            }}
                            whileHover={{ 
                                scale: 1.05, 
                                boxShadow: "0 8px 30px rgba(176,132,72,0.35)" 
                            }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowCoupleStory(true)}
                        >
                            <BookOpen size={16} />
                            Read Our Full Story
                        </motion.button>
                    </motion.div>
                )}
            </div>

            {/* Horizontal Scrolling Milestones */}
            <div
                ref={scrollContainerRef}
                className="relative w-full overflow-hidden py-10"
            >
                {/* Hide scrollbar with CSS */}
                <style>{`
                    #story .overflow-hidden::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {/* Left fade gradient */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-[var(--wedding-alt-bg)] to-transparent z-10 pointer-events-none" />

                {/* Right fade gradient */}
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-[var(--wedding-alt-bg)] to-transparent z-10 pointer-events-none" />

                {/* Scrolling container */}
                <motion.div
                    ref={motionDivRef}
                    className="flex gap-6"
                    animate={controls}
                    initial={{ x: "-20%" }}
                    style={{ width: "fit-content" }}
                    drag="x"
                    dragConstraints={{ left: -10000, right: 0 }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
                    onDragStart={() => {
                        setIsUserScrolling(true);
                        if (animationRef.current && !selectedMilestone) {
                            animationRef.current.pausedAt = Date.now();
                        }
                        controls.stop();
                    }}
                    onDragEnd={() => {
                        if (userScrollTimeoutRef.current) {
                            clearTimeout(userScrollTimeoutRef.current);
                        }
                        userScrollTimeoutRef.current = setTimeout(() => {
                            setIsUserScrolling(false);
                        }, 1000);
                    }}
                >
                    {duplicatedMilestones.map((milestone, idx) => {
                        const { palette } = getMilestoneVisuals(milestone.title, idx);
                        // Use numbered images for gallery (01, 02, 03, etc.)
                        const milestoneIndex = (idx % milestones.length) + 1;
                        const galleryImageNumber = String(milestoneIndex).padStart(2, "0");

                        // Map to numbered image files in public folder
                        const galleryImageMap: Record<number, string> = {
                            1: '/01_beginning.png',
                            2: '/02_movie.png',
                            3: '/03_first_photo.png',
                            4: '/04_Isha_Bday.png',
                            5: '/05_christmas.png',
                            6: '/06_Comedy.png',
                            7: '/07_first_flight.png',
                            8: '/08_Siliguri.png',
                            9: '/09_blessed.png',
                        };

                        const galleryImageUrl = galleryImageMap[milestoneIndex] || milestone.imageUrl;

                        return (
                            <motion.div
                                key={`${milestone.id}-${idx}`}
                                className="relative w-72 h-96 md:w-80 md:h-[450px] flex-shrink-0 rounded-xl overflow-hidden cursor-pointer shadow-lg"
                                style={{
                                    background: palette.bg,
                                    boxShadow: `0 12px 50px ${palette.glow}`,
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    zIndex: 10,
                                    boxShadow: `0 20px 80px ${palette.glow}, 0 0 0 3px var(--wedding-accent)`
                                }}
                                onClick={() => setSelectedMilestone(milestone)}
                            >
                                {/* Gallery image - uses numbered files */}
                                <img
                                    src={galleryImageUrl}
                                    alt={milestone.title}
                                    className="w-full h-full object-contain"
                                    style={{
                                        objectFit: 'contain',
                                        objectPosition: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.5)'
                                    }}
                                    onError={(e) => {
                                        // Fallback to gradient background with camera icon
                                        const img = e.currentTarget;
                                        img.style.display = 'none';
                                        if (img.parentElement && !img.parentElement.querySelector('.fallback-placeholder')) {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'fallback-placeholder w-full h-full flex items-center justify-center';
                                            placeholder.style.background = palette.bg;
                                            placeholder.innerHTML = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${palette.textLight}" stroke-width="2" opacity="0.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
                                            img.parentElement.appendChild(placeholder);
                                        }
                                    }}
                                />

                                {/* Subtle hover overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"
                                />

                                {/* Bottom click hint only */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between bg-black/40 backdrop-blur-sm"
                                >
                                    <p
                                        className="text-[9px] tracking-[0.35em] uppercase font-semibold text-white/70"
                                    >
                                        Chapter {galleryImageNumber}
                                    </p>
                                    <p
                                        className="text-[8px] tracking-wider uppercase font-medium flex items-center gap-1 text-white/60"
                                    >
                                        <Camera size={10} /> Click to view
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Image Modal */}
            <Dialog open={!!selectedMilestone} onOpenChange={(open) => !open && setSelectedMilestone(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedMilestone && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="font-serif text-2xl" style={{ color: "var(--wedding-text)" }}>
                                    {selectedMilestone.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {selectedMilestone.imageUrl ? (
                                    <div className="rounded-xl overflow-hidden border bg-black/5" style={{ borderColor: "var(--wedding-border)" }}>
                                        <img
                                            src={selectedMilestone.imageUrl}
                                            alt={selectedMilestone.title}
                                            className="w-full h-auto object-contain"
                                            style={{
                                                maxHeight: "60vh",
                                                objectFit: "contain",
                                                margin: "0 auto",
                                                display: "block"
                                            }}
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
            </Dialog>

            {/* Couple Story Modal */}
            {coupleStory && (
                <Dialog open={showCoupleStory} onOpenChange={(open) => !open && setShowCoupleStory(false)}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl mb-2" style={{ color: "var(--wedding-text)" }}>
                                Our Love Story
                            </DialogTitle>
                            <SimpleDivider />
                        </DialogHeader>
                        <div className="px-2 py-4">
                            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--wedding-muted)" }}>
                                {coupleStory}
                            </p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
});

export default StorySection;
