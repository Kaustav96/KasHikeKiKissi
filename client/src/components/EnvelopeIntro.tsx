import { useState, useEffect } from "react";
import { useMusic } from "@/context/MusicContext";
import { Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onFinish?: () => void;
  config?: any;
}

export default function EnvelopeIntro({ onFinish, config }: Props) {
  const [sealBreaking, setSealBreaking] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { fadeIn, isPlaying, togglePlayPause, setMusicUrl } = useMusic();

  const sparkles = Array.from({ length: 20 });

  // Auto-open envelope after 2 seconds
  useEffect(() => {
    const openTimer = setTimeout(() => {
      // Break seal (smoother transition - no shake, just fade)
      setSealBreaking(true);

      // Show letter immediately when seal starts breaking
      setLetterVisible(true);

      // Open envelope after seal disappears (1s)
      setTimeout(() => setEnvelopeOpen(true), 1000);
    }, 2000);

    return () => clearTimeout(openTimer);
  }, [onFinish]);

  // Start music when letter becomes visible
  useEffect(() => {
    if (letterVisible && config) {
      // Small delay for smooth transition
      const musicTimer = setTimeout(() => {
        // Get the first music URL from config (prioritize background music)
        let musicUrl = '';

        if (Array.isArray(config.backgroundMusicUrl) && config.backgroundMusicUrl.length) {
          const firstTrack = config.backgroundMusicUrl[0];
          musicUrl = typeof firstTrack === 'object' ? firstTrack.url : firstTrack;
        } else if (config.groomMusicUrls?.length) {
          const firstTrack = config.groomMusicUrls[0];
          musicUrl = typeof firstTrack === 'object' ? firstTrack.url : firstTrack;
        } else if (config.brideMusicUrls?.length) {
          const firstTrack = config.brideMusicUrls[0];
          musicUrl = typeof firstTrack === 'object' ? firstTrack.url : firstTrack;
        }

        if (musicUrl) {
          console.log('[EnvelopeIntro] Setting music URL:', musicUrl);
          setMusicUrl(musicUrl);
          // Small delay to ensure URL is set before fading in
          setTimeout(() => {
            fadeIn();
          }, 100);
        }
      }, 500);
      return () => clearTimeout(musicTimer);
    }
  }, [letterVisible, config, fadeIn, setMusicUrl]);

  // Countdown timer that starts when letter is visible
  useEffect(() => {
    if (!letterVisible) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Navigate when countdown reaches 0
          setTimeout(() => {
            if (onFinish) onFinish();
            else window.location.href = "/side-selection";
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [letterVisible, onFinish]);


  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Blurred background layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/lux-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
          transform: "scale(1.1)"
        }}
      />


      {/* Full Page Envelope - Split into two halves */}
      <div className="relative w-full h-full">

        {/* Top Half of Envelope */}
        <div
          className={`absolute top-0 left-0 right-0 transition-all duration-[2500ms] ease-out origin-bottom ${
            envelopeOpen ? "-translate-y-full" : ""
          }`}
          style={{
            height: "50%",
            background: "linear-gradient(180deg, #7A0F1C 0%, #8B0E27 80%, #A1122F 100%)",
            boxShadow: "0 10px 50px rgba(0,0,0,0.5)"
          }}
        >
          {/* Decorative gold border at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Gold ornamental pattern */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-40">
            <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
              <path d="M10 20 Q50 10 100 20 Q150 30 190 20" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6"/>
              <circle cx="100" cy="20" r="4" fill="#FFD700"/>
              <circle cx="50" cy="15" r="3" fill="#D4AF37"/>
              <circle cx="150" cy="25" r="3" fill="#D4AF37"/>
            </svg>
          </div>

          {/* Top flap decoration */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 md:gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-xl md:text-3xl opacity-70 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                  🪔
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Half of Envelope */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-[2500ms] ease-out origin-top ${
            envelopeOpen ? "translate-y-full" : ""
          }`}
          style={{
            height: "50%",
            background: "linear-gradient(180deg, #A1122F 0%, #8B0E27 20%, #7A0F1C 100%)",
            boxShadow: "0 -10px 50px rgba(0,0,0,0.5)"
          }}
        >
          {/* Decorative gold border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

          {/* Gold ornamental pattern */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-40">
            <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
              <path d="M10 20 Q50 30 100 20 Q150 10 190 20" stroke="#D4AF37" strokeWidth="2" fill="none" opacity="0.6"/>
              <circle cx="100" cy="20" r="4" fill="#FFD700"/>
              <circle cx="50" cy="25" r="3" fill="#D4AF37"/>
              <circle cx="150" cy="15" r="3" fill="#D4AF37"/>
            </svg>
          </div>

          {/* Bottom decoration */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 md:gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="text-xl md:text-3xl opacity-70 animate-pulse" style={{ animationDelay: `${i * 0.2 + 0.5}s` }}>
                  🪔
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Seal with Bengali Couple */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-1000 ease-out ${
            sealBreaking ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden"
            style={{
              border: "6px solid #D4AF37",
              boxShadow: "0 0 60px rgba(212,175,55,0.8), 0 20px 80px rgba(0,0,0,0.6)",
              background: "#FFF9E6"
            }}
          >
            <img
              src="/traditional-bengali-wedding-couple.png"
              alt="Wedding Seal"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center text-6xl font-serif italic" style="color: #7A0F1C; background: linear-gradient(145deg, #FFD700 0%, #E6BE00 40%, #C6A75E 100%);">
                    H & K
                  </div>
                `;
              }}
            />

            {/* Gold ring overlays */}
            <div className="absolute inset-0 rounded-full" style={{
              border: "3px solid rgba(255,215,0,0.6)",
              boxShadow: "inset 0 0 40px rgba(255,215,0,0.4)"
            }} />
            <div className="absolute inset-4 rounded-full" style={{
              border: "2px solid rgba(212,175,55,0.4)"
            }} />

            {/* Wax seal texture effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-transparent to-black opacity-10" />
          </div>
        </div>

        {/* Golden Sparkles Explosion when seal breaks */}
        {sealBreaking && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40">
            {sparkles.map((_, i) => {
              const angle = (i / sparkles.length) * 360;
              const distance = 150 + Math.random() * 150;
              return (
                <div
                  key={i}
                  className="absolute animate-sparkle-burst"
                  style={{
                    left: "0",
                    top: "0",
                    animationDelay: `${Math.random() * 0.2}s`,
                    '--angle': `${angle}deg`,
                    '--distance': `${distance}px`,
                  } as any}
                >
                  <div className="text-yellow-400 text-3xl drop-shadow-glow">
                    {i % 3 === 0 ? "✨" : i % 3 === 1 ? "💫" : "⭐"}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Full Page Letter that appears after envelope opens */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-1000 ${
          letterVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Mango Leaves Torana - Top of Letter */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-32 flex justify-center items-start z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="animate-leaf-sway"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))"
                }}
              >
                <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
                  <path
                    d="M20 0 Q24 15 20 30 Q16 45 20 70 L20 70 Q16 45 20 30 Q24 15 20 0Z"
                    fill="#2D5016"
                    opacity="0.95"
                  />
                  <ellipse cx="20" cy="14" rx="8" ry="16" fill="#3D7022" opacity="0.8" />
                  <path
                    d="M20 8 Q22 20 20 32"
                    stroke="#4A8A2A"
                    strokeWidth="1.2"
                    opacity="0.6"
                    fill="none"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative w-full max-w-2xl h-[80vh] md:h-[85vh] lg:h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #fffdf4 0%, #fff8e7 50%, #fdf3e3 100%)",
            border: "3px solid #D4AF37"
          }}
        >
          {/* Loading Spinner Overlay - REMOVED */}

          {/* Decorative borders */}
          <div className="absolute inset-4 rounded-2xl border-2 border-[#D4AF37] opacity-40 pointer-events-none" />
          <div className="absolute inset-6 rounded-xl border border-[#D4AF37] opacity-20 pointer-events-none" />

          {/* Corner ornaments */}
          {["top-6 left-6", "top-6 right-6 rotate-90", "bottom-6 left-6 -rotate-90", "bottom-6 right-6 rotate-180"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} pointer-events-none z-10`}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M2 2 L14 2 Q18 2 18 6 L18 14" stroke="#D4AF37" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                <circle cx="2" cy="2" r="2.5" fill="#FFD700"/>
                <circle cx="18" cy="14" r="2" fill="#C6A75E"/>
                <path d="M6 2 Q6 6 2 6" stroke="#D4AF37" strokeWidth="1.5" fill="none" opacity="0.6"/>
              </svg>
            </div>
          ))}

          {/* Content - fixed height, no scroll */}
          <div className="flex-1 flex flex-col justify-between px-6 md:px-12 pt-4 pb-3">
            <div>
              {/* Top decoration */}
              <div className="text-center mb-2">
                <img src="/ganesh.png" alt="Ganesh" className="mx-auto h-8 mb-1 drop-shadow-lg" />
                <p className="text-[#B48A2C] italic font-serif text-[9px] tracking-wide">
                  ॥ Om Shri Ganeshaya Namah ॥ ॥ Om Prajapataye Namah ॥
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <span className="text-[#D4AF37] text-sm">❧</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>

              {/* Main title */}
              <div className="text-center mb-2">
                <h1 className="text-xl md:text-3xl italic font-serif mb-0.5" style={{
                  color: "#A1122F",
                  textShadow: "0 2px 4px rgba(161,18,47,0.2)"
                }}>
                  Subho Bibaho
                </h1>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#C6A75E] font-semibold">
                  Wedding Invitation
                </p>
              </div>

              {/* Bengali Couple Image */}
              <div className="flex justify-center mb-2">
                <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-full overflow-hidden" style={{
                  border: "2px solid #D4AF37",
                  boxShadow: "0 4px 20px rgba(212,175,55,0.4)"
                }}>
                  <img
                    src="/bengali-bride-groom.webp"
                    alt="Himasree & Kaustav"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to emoji if image doesn't exist
                      const target = e.currentTarget;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#FFF9E6] to-[#FFE4B5]">
                            <div class="text-2xl md:text-3xl">👰</div>
                            <div class="text-lg md:text-xl">❤️</div>
                            <div class="text-2xl md:text-3xl">🤵</div>
                          </div>
                        `;
                      }
                    }}
                  />
                  {/* Gold ring overlay */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                    border: "2px solid rgba(255,215,0,0.3)",
                    boxShadow: "inset 0 0 20px rgba(255,215,0,0.2)"
                  }} />
                </div>
              </div>

              {/* Names below image */}
              <div className="text-center mb-2">
                <p className="text-[#A1122F] font-serif italic text-sm md:text-lg">
                  Himasree & Kaustav
                </p>
              </div>

              {/* Floral divider */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="text-[#D4AF37] text-sm">🌸</span>
                <div className="w-6 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-base">🌺</span>
                <div className="w-6 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm">🌸</span>
              </div>

              {/* Invitation text */}
              <div className="text-center mb-2 px-2">
                <p className="italic text-gray-700 mb-1.5 leading-snug text-[11px] md:text-sm">
                  With joy in our hearts and blessings of our families, we cordially invite you to celebrate our union.
                </p>
                <p className="italic text-gray-700 leading-snug text-[11px] md:text-sm">
                  Please join us for a day filled with tradition, love, and happiness.
                </p>
              </div>

              {/* Icons row */}
              <div className="flex justify-center gap-2.5 mb-2 text-base md:text-lg">
                <span title="Ceremony">🪔</span>
                <span title="Celebration">🎊</span>
                <span title="Love">🌹</span>
                <span title="Blessings">🙏</span>
                <span title="Joy">🎶</span>
              </div>

              {/* Bottom message */}
              <div className="text-center mb-2">
                <p className="italic text-[#A1122F] font-serif text-xs md:text-sm font-semibold">
                  ✨ Your blessings are our greatest gift ✨
                </p>
              </div>
            </div>

            {/* Elegant Countdown at Bottom */}
            <div className="mt-auto pt-2 border-t" style={{ borderColor: "rgba(212,175,55,0.3)" }}>
              <div className="text-center">
                <p className="text-[#7A0F1C] font-serif italic text-xs md:text-base mb-1">
                  A beautiful celebration awaits…
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#C6A75E] text-[10px] md:text-xs">Opening in</span>
                  <div
                    className="text-2xl md:text-4xl font-bold text-[#A1122F] animate-pulse px-2"
                    style={{ textShadow: "0 2px 8px rgba(161,18,47,0.3)" }}
                  >
                    {countdown}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stylish Bottom-Right Music Button */}
        <AnimatePresence>
          {letterVisible && (
            <motion.button
              onClick={togglePlayPause}
              className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl border-2 transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(255,253,244,0.95) 0%, rgba(255,248,231,0.95) 100%)',
                borderColor: '#D4AF37',
                color: '#D4AF37',
              }}
              title={isPlaying ? "Pause music" : "Play music"}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
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
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes sparkle-burst {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--distance)),
              calc(sin(var(--angle)) * var(--distance))
            ) scale(0);
            opacity: 0;
          }
        }

        .animate-sparkle-burst {
          animation: sparkle-burst 1.5s ease-out forwards;
        }

        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(255,215,0,0.8));
        }


        @keyframes leaf-sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        .animate-leaf-sway {
          animation: leaf-sway 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}