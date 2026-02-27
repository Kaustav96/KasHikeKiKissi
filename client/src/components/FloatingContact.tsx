import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Phone, Music, Pause, Play } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { useWeddingTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";
import type { WeddingConfig } from "../../../shared/schema.js";

interface FloatingContactProps {
  config: WeddingConfig;
}

export default function FloatingContact({ config }: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { side } = useWeddingTheme();
  const { isPlaying, hasStarted, togglePlayPause } = useMusic();

  const phone = side === "bride" ? config.bridePhone : config.groomPhone;
  const whatsapp = side === "bride" ? config.brideWhatsapp : config.groomWhatsapp;
  const contactName = side === "bride" ? "Himasree" : "Kaustav";
  const accentColor = side === "groom" ? "#B9975B" : "#8B0000";
  const bgColor = side === "groom" ? "#EFE6D8" : "#F8F1E7";
  const textColor = side === "groom" ? "#2E2A27" : "#3D1A1A";
  const borderColor = side === "groom" ? "rgba(185,151,91,0.3)" : "rgba(139,0,0,0.2)";

  const whatsappNumber = (whatsapp || phone || "").replace(/[^0-9]/g, "");
  const callNumber = phone || whatsapp || "";
  const hasContact = !!(phone || whatsapp);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" data-testid="floating-contact">
      {/* Music Control - Always visible above chat */}
      <motion.button
        onClick={togglePlayPause}
        className="p-4 rounded-full shadow-xl border-2 transition-all"
        style={{
          background: bgColor,
          borderColor: accentColor,
          color: accentColor,
        }}
        title={isPlaying ? "Pause music" : "Play music"}
        data-testid="music-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{
            duration: 3,
            repeat: isPlaying ? Infinity : 0,
            ease: "linear",
          }}
        >
          <Music size={22} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && hasContact && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-[130px] right-0 rounded-xl overflow-hidden shadow-xl"
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              minWidth: 220,
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: borderColor }}
            >
              <p className="font-serif text-sm font-semibold" style={{ color: textColor }}>
                Reach {contactName}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: accentColor }}>
                {side === "bride" ? "Bride's Side" : "Groom's Side"}
              </p>
            </div>

            <div className="p-2 space-y-1">
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I have a question about the wedding.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "#25D366", color: "#fff" }}
                  data-testid="contact-whatsapp"
                >
                  <SiWhatsapp size={18} />
                  <div>
                    <p className="text-sm font-medium">Chat on WhatsApp</p>
                    <p className="text-[10px] opacity-80">Instant messaging</p>
                  </div>
                </a>
              )}

              {callNumber && (
                <a
                  href={`tel:${callNumber}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: accentColor, color: "#fff" }}
                  data-testid="contact-call"
                >
                  <Phone size={18} />
                  <div>
                    <p className="text-sm font-medium">Call {contactName}</p>
                    <p className="text-[10px] opacity-80">{callNumber}</p>
                  </div>
                </a>
              )}
            </div>

            <div
              className="px-4 py-2 border-t"
              style={{ borderColor: borderColor }}
            >
              <p className="text-[9px] text-center" style={{ color: accentColor }}>
                Switch side in header for other contact
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasContact && (
        <motion.button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
          style={{
            background: isOpen ? textColor : accentColor,
            color: "#fff",
            boxShadow: `0 4px 20px ${side === "groom" ? "rgba(185,151,91,0.4)" : "rgba(139,0,0,0.4)"}`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          data-testid="floating-contact-toggle"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}
    </div>
  );
}
