import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import SimpleDivider from "@/components/SimpleDivider";
import { ANIMATION_CONSTANTS } from "@/lib/animations";

export default function ContactInfoSection() {
  return (
    <section id="contact" className="py-24 md:py-32 px-4 sm:px-8 relative" style={{ background: "var(--wedding-alt-bg)" }} data-testid="contact-section">
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
            <Phone size={18} style={{ color: "var(--wedding-accent)" }} />
          </motion.div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Need Help?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Contact Us
          </h2>
          <SimpleDivider />
        </motion.div>

        <motion.div
          className="rounded-lg p-8 text-center hover:shadow-xl transition-all"
          style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: ANIMATION_CONSTANTS.delay.medium,
            duration: ANIMATION_CONSTANTS.duration.normal,
            ease: ANIMATION_CONSTANTS.easing.smooth
          }}
          whileHover={{ y: -4 }}
        >
          <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            Have questions or need assistance? Our wedding coordinator is here to help make your experience memorable:
          </p>
          <div className="space-y-3">
            <motion.a
              href="tel:+918376916635"
              className="flex items-center justify-center gap-3 text-lg font-semibold transition-opacity"
              style={{ color: "var(--wedding-accent)" }}
              whileHover={{ scale: 1.04 }}
            >
              <Phone size={20} />
              <span>+91 83769 16635</span>
            </motion.a>
            <motion.a
              href="mailto:wedding@kaustavhimasree.com"
              className="flex items-center justify-center gap-3 text-base transition-opacity"
              style={{ color: "var(--wedding-text)" }}
              whileHover={{ scale: 1.04 }}
            >
              <Mail size={18} />
              <span>wedding@kaustavhimasree.com</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
