import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import SimpleDivider from "../SimpleDivider";
import { ANIMATION_CONSTANTS } from "@/lib/animations";

export default function CoupleStorySection({ story }: { story: string }) {
  if (!story || story.trim() === "") return null;

  return (
    <section
      id="couple-story"
      className="py-24 md:py-32 px-4 sm:px-8 relative"
      style={{ background: "var(--wedding-bg)" }}
      data-testid="couple-story-section"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          className="text-center mb-12"
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
            Our Journey
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Our Story
          </h2>
          <SimpleDivider />
        </motion.div>

        <motion.div
          className="rounded-2xl p-8 sm:p-10 text-center hover:shadow-xl transition-all"
          style={{
            background: "var(--wedding-card-bg)",
            border: "2px solid var(--wedding-accent)",
            boxShadow: "0 4px 24px rgba(176,132,72,0.14)"
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: ANIMATION_CONSTANTS.delay.medium,
            duration: ANIMATION_CONSTANTS.duration.slow,
            ease: ANIMATION_CONSTANTS.easing.smooth
          }}
          whileHover={{ y: -4 }}
        >
          {/* Decorative top accent */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[var(--wedding-accent)]" />
            <Heart size={16} style={{ color: "var(--wedding-accent)" }} className="animate-pulse" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[var(--wedding-accent)]" />
          </div>

          <div className="prose prose-sm sm:prose-base mx-auto" style={{ maxWidth: "65ch" }}>
            <p
              className="text-base sm:text-lg leading-relaxed whitespace-pre-line text-left"
              style={{ color: "var(--wedding-text)", opacity: 0.9 }}
            >
              {story}
            </p>
          </div>

          {/* Decorative bottom accent */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--wedding-accent)] to-transparent" />
            <span className="text-[var(--wedding-accent)] text-xs">✦</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-[var(--wedding-accent)] to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

