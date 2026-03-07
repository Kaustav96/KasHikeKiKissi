import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import SimpleDivider from "@/components/SimpleDivider";

export default function ContactInfoSection() {
  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-8" style={{ background: "var(--wedding-alt-bg)" }} data-testid="contact-section">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-4"
            style={{ background: "rgba(176,132,72,0.10)", border: "1px solid var(--wedding-border)" }}>
            <Phone size={18} style={{ color: "var(--wedding-accent)" }} />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase mb-2 font-medium" style={{ color: "var(--wedding-muted)" }}>
            Need Help?
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 tracking-tight" style={{ color: "var(--wedding-text)" }}>
            Contact Us
          </h2>
          <SimpleDivider />
        </motion.div>

        <motion.div
          className="rounded-lg p-8 text-center"
          style={{ background: "var(--wedding-card-bg)", border: "1px solid var(--wedding-border)" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-base sm:text-lg mb-6 leading-relaxed" style={{ color: "var(--wedding-muted)" }}>
            Have questions or need assistance? Our wedding coordinator is here to help make your experience memorable:
          </p>
          <div className="space-y-3">
            <a
              href="tel:+919876512345"
              className="flex items-center justify-center gap-3 text-lg font-semibold hover:opacity-80 transition-opacity"
              style={{ color: "var(--wedding-accent)" }}
            >
              <Phone size={20} />
              <span>+91 98765 12345</span>
            </a>
            <a
              href="mailto:wedding@kaustavhimasree.com"
              className="flex items-center justify-center gap-3 text-base hover:opacity-80 transition-opacity"
              style={{ color: "var(--wedding-text)" }}
            >
              <Mail size={18} />
              <span>wedding@kaustavhimasree.com</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
