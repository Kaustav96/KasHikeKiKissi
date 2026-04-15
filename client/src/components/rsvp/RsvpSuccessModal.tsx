import { motion, AnimatePresence } from "framer-motion";
import KHCrest from "@/components/KHCrest";
import { Sparkles, Calendar, Clock } from "lucide-react";
import type { WeddingConfig } from "@shared/schema";

interface Props {
  open: boolean;
  status: "confirmed" | "declined" | null;
  config: WeddingConfig | null;
  isPendingApproval?: boolean;
  onClose: () => void;
}

// Generate ICS calendar file
function generateCalendarFile(config: WeddingConfig): string {
  if (!config.weddingDate) {
    throw new Error('Wedding date not set');
  }

  const weddingDate = new Date(config.weddingDate);

  // ICS requires DTSTART and DTEND in format: YYYYMMDDTHHmmss
  // Assuming wedding starts at 6 PM and lasts 4 hours
  const startDate = new Date(weddingDate);
  startDate.setHours(18, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(22, 0, 0, 0);

  const formatICSDateTime = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//Kaustav & Himasree//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICSDateTime(startDate)}`,
    `DTEND:${formatICSDateTime(endDate)}`,
    `DTSTAMP:${formatICSDateTime(new Date())}`,
    `SUMMARY:Kaustav & Himasree's Wedding`,
    `DESCRIPTION:Join us in celebrating the wedding of Kaustav & Himasree`,
    `LOCATION:${config.venueName || 'Wedding Venue'}${config.venueAddress ? ', ' + config.venueAddress : ''}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    `UID:wedding-${Date.now()}@kaustav-himasree.com`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Wedding Tomorrow - Kaustav & Himasree',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

// Download calendar file
function downloadCalendar(config: WeddingConfig) {
  const icsContent = generateCalendarFile(config);
  if (!icsContent) return;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'kaustav-himasree-wedding.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export default function RsvpSuccessModal({ open, status, config, isPendingApproval, onClose }: Props) {

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-md w-[92%] rounded-2xl p-8 text-center"
            style={{
              background: "var(--wedding-card-bg)",
              border: "2px solid var(--wedding-accent)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.25)",
            }}
            initial={{ scale: 0.85, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating sparkles */}
            <motion.div
              className="absolute -top-6 left-1/2 -translate-x-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={28} color="var(--wedding-accent)" />
            </motion.div>

            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.035] pointer-events-none rounded-2xl"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B9975B' fill-opacity='0.4'%3E%3Cpath d='M40 0C17.9 0 0 17.9 0 40s17.9 40 40 40 40-17.9 40-40S62.1 0 40 0zm0 72c-17.7 0-32-14.3-32-32S22.3 8 40 8s32 14.3 32 32-14.3 32-32 32z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{
                  background: "var(--wedding-accent)",
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  boxShadow: "0 0 8px var(--wedding-accent)",
                }}
                animate={{
                  y: [-10, -30],
                  opacity: [0, 0.8, 0],
                  scale: [0.5, 1, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}

            <div className="flex justify-center mb-4 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <KHCrest size={70} />
              </motion.div>
            </div>

            <motion.h2
              className="font-serif text-2xl mb-2 relative z-10"
              style={{ color: "var(--wedding-text)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {isPendingApproval
                ? "We've Received Your RSVP"
                : status === "confirmed"
                ? "Your Presence Means Everything"
                : "Thank You For Letting Us Know"}
            </motion.h2>

            <motion.p
              className="text-sm leading-relaxed mb-6 relative z-10"
              style={{ color: "var(--wedding-muted)" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {isPendingApproval
                ? "Your response is under review by the wedding team. We'll confirm your spot soon. Thank you for your patience! 🙏"
                : status === "confirmed"
                ? "We are delighted to celebrate this beautiful day with you."
                : "We will miss you, but your blessings mean the world to us."}
            </motion.p>

            {/* Pending approval info box */}
            {isPendingApproval && (
              <motion.div
                className="rounded-xl p-3 mb-6 flex items-start gap-3 text-left relative z-10"
                style={{ background: "rgba(176,132,72,0.08)", border: "1px solid var(--wedding-border)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Clock size={16} style={{ color: "var(--wedding-accent)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "var(--wedding-text)" }}>What happens next?</p>
                  <p className="text-xs" style={{ color: "var(--wedding-muted)" }}>
                    The wedding team will review your request and confirm your attendance. You may be contacted directly once approved.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[var(--wedding-accent)] to-transparent" />
              <span className="text-[var(--wedding-accent)] text-xs">✦</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent via-[var(--wedding-accent)] to-transparent" />
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 relative z-10">
              {/* Add to Calendar — only for confirmed + approved RSVPs with wedding date set */}
              {status === "confirmed" && !isPendingApproval && config?.weddingDate && (
                <motion.button
                  onClick={() => downloadCalendar(config)}
                  className="w-full px-6 py-2.5 rounded-lg text-sm font-medium transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ background: "var(--wedding-accent)", color: "var(--wedding-bg)" }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Calendar size={16} />
                  Add to Calendar
                </motion.button>
              )}

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="w-full px-6 py-2.5 rounded-lg text-sm font-medium transition-all relative hover:shadow-md"
                style={{
                  background: status === "confirmed" && !isPendingApproval && config?.weddingDate
                    ? "transparent"
                    : "var(--wedding-accent)",
                  color: status === "confirmed" && !isPendingApproval && config?.weddingDate
                    ? "var(--wedding-text)"
                    : "var(--wedding-bg)",
                  border: status === "confirmed" && !isPendingApproval && config?.weddingDate
                    ? "1px solid var(--wedding-border)"
                    : "none",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: status === "confirmed" && !isPendingApproval && config?.weddingDate ? 0.7 : 0.6 }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

