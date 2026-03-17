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
  // const [countdown, setCountdown] = useState(5);
  const { fadeIn, isPlaying, togglePlayPause, setMusicUrl } = useMusic();

  const sparkles = Array.from({ length: 20 });

  // Handle seal tap - user-triggered opening
  const handleSealTap = () => {
    if (sealBreaking) return; // Prevent multiple taps

    // Break seal (smoother transition - no shake, just fade)
    setSealBreaking(true);

    // Show letter immediately when seal starts breaking
    setLetterVisible(true);

    // Open envelope after seal disappears (1s)
    setTimeout(() => setEnvelopeOpen(true), 1000);
  };

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
          setMusicUrl(musicUrl);
          // Small delay to ensure URL is set before fading in
          setTimeout(() => {
            // Try to autoplay - if it fails (mobile), user can use the button
            fadeIn().catch(() => {
              // Autoplay blocked on mobile - user can use music button
            });
          }, 100);
        }
      }, 500);
      return () => clearTimeout(musicTimer);
    }
  }, [letterVisible, config, fadeIn, setMusicUrl]);

  // // Countdown timer that starts when letter is visible
  // useEffect(() => {
  //   if (!letterVisible) return;
  //
  //   const interval = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(interval);
  //         // Navigate when countdown reaches 0
  //         setTimeout(() => {
  //           if (onFinish) onFinish();
  //           else window.location.href = "/side-selection";
  //         }, 1000);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //
  //   return () => clearInterval(interval);
  // }, [letterVisible, onFinish]);


  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Blurred background layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/lux-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(3px)",
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

        {/* Center Seal with Bengali Couple - Interactive */}
        <motion.div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center transition-all duration-1000 ease-out ${
            sealBreaking ? "scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <motion.div
            onClick={handleSealTap}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 80px rgba(255,215,0,1), 0 20px 80px rgba(0,0,0,0.6)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden cursor-pointer"
            style={{
              border: "6px solid #D4AF37",
              boxShadow: "0 0 60px rgba(212,175,55,0.8), 0 20px 80px rgba(0,0,0,0.6)",
              background: "#FFF9E6"
            }}
          >
            <img
              src="/bengali_wedding_couple.png"
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
          </motion.div>

          {/* Luxurious Hint Text with Elegant Box */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 sm:mt-10 md:mt-12 flex flex-col items-center text-center px-4 w-full max-w-sm sm:max-w-md mx-auto"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 8px 32px rgba(212,175,55,0.3), 0 0 60px rgba(255,215,0,0.15)",
                  "0 8px 40px rgba(212,175,55,0.4), 0 0 80px rgba(255,215,0,0.25)",
                  "0 8px 32px rgba(212,175,55,0.3), 0 0 60px rgba(255,215,0,0.15)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative px-8 py-6 sm:px-10 sm:py-8 rounded-xl backdrop-blur-sm"
              style={{
                background: "linear-gradient(135deg, rgba(139,18,47,0.85) 0%, rgba(122,15,28,0.90) 50%, rgba(139,18,47,0.85) 100%)",
                border: "2px solid rgba(212,175,55,0.6)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)"
              }}
            >
              {/* Corner ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#FFD700] opacity-60" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#FFD700] opacity-60" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#FFD700] opacity-60" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#FFD700] opacity-60" />

              {/* Top decorative line */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-60" />
                <span className="text-[#FFD700] text-xs opacity-80">✦</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#FFD700] to-transparent opacity-60" />
              </div>

              {/* Main luxurious text */}
              <motion.div
                  animate={{
                    opacity: [0.85, 1, 0.85]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="flex flex-col items-center"
              >
                {/* Pointing finger emoji above */}
                <motion.div
                  animate={{
                    y: [0, -8, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-3xl sm:text-4xl md:text-5xl mb-2"
                >
                  👆
                </motion.div>

                <p
                  className="
                    text-base
                    sm:text-lg
                    md:text-xl
                    font-serif
                    tracking-[0.2em]
                    leading-relaxed
                    uppercase
                    mb-2
                  "
                  style={{
                    color: "#FFF5E1",
                    textShadow: "0 2px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.3)",
                    fontWeight: 400
                  }}
                >
                  Tap the Royal Seal
                </p>
                <p
                  className="
                    text-xs
                    sm:text-sm
                    font-light
                    tracking-[0.15em]
                    italic
                  "
                  style={{
                    color: "#F5DEB3",
                    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  to open the invitation.
                </p>
              </motion.div>

              {/* Bottom decorative line */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" />
                <span className="text-[#D4AF37] text-xs opacity-80">✦</span>
                <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#D4AF37] to-transparent opacity-60" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

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

        <motion.div
            className="relative w-[95vw] sm:w-[90vw] md:w-full max-w-2xl h-[85vh] sm:h-[88vh] md:h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #fffdf4 0%, #fff8e7 50%, #fdf3e3 100%)",
              border: "3px solid #D4AF37"
            }}
            animate={{
              y: [0, -6, 0],
              boxShadow: [
                "0 25px 50px rgba(0,0,0,0.28)",
                "0 30px 60px rgba(0,0,0,0.35)",
                "0 25px 50px rgba(0,0,0,0.28)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
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
          <div className="flex-1 flex flex-col justify-between px-3 sm:px-5 md:px-10 pt-2 sm:pt-3 md:pt-4 pb-2 sm:pb-2.5 md:pb-3 overflow-hidden">
            <div className="flex-1 flex flex-col justify-evenly overflow-hidden">
              {/* Top decoration */}
              <div className="text-center mb-1 sm:mb-1.5">
                <img src="/ganesh.png" alt="Ganesh" className="mx-auto h-7 sm:h-9 md:h-11 mb-0.5 sm:mb-1 drop-shadow-lg" />
                <p className="text-[#B48A2C] italic font-serif text-[9px] sm:text-[10px] md:text-xs tracking-wide">
                  ॥ Om Shri Ganeshaya Namah ॥ ॥ Om Prajapataye Namah ॥
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                <span className="text-[#D4AF37] text-sm">❧</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              </div>

              {/* Main title */}
              <div className="text-center mb-1 sm:mb-1.5">
                <h1 className="text-base sm:text-lg md:text-2xl italic font-serif mb-0.5" style={{
                  color: "#A1122F",
                  textShadow: "0 2px 4px rgba(161,18,47,0.2)"
                }}>
                  Subho Bibaho
                </h1>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#C6A75E] font-semibold">
                  An Auspicious Celebration
                </p>
              </div>

              {/* Couple Section - 2 Columns with Photos */}
              <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-5 mb-1 sm:mb-1.5 px-1 sm:px-2">
                {/* Bride Column */}
                <div className="flex-1 flex flex-col items-center max-w-[45%]">
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-28 md:h-28 rounded-full overflow-hidden mb-1" style={{
                    border: "2px solid #D4AF37",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.4)"
                  }}>
                    <img
                      src="/bride.png"
                      alt="Himasree"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "65% center" }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF9E6] to-[#FFE4B5]">
                              <div class="text-2xl md:text-3xl">👰</div>
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
                  <p className="text-[#A1122F] font-serif italic text-xs sm:text-sm md:text-base font-semibold text-center leading-tight">
                    Himasree
                  </p>
                </div>

                {/* Heart Connector */}
                <div className="flex-shrink-0 flex items-center pt-5 sm:pt-7 md:pt-10">
                  <svg width="24" height="32" viewBox="0 0 24 32" className="w-4 h-5 sm:w-5 sm:h-6 md:w-7 md:h-9">
                    <defs>
                      <linearGradient id="coupleHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4AF37" />
                        <stop offset="50%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#D4AF37" />
                      </linearGradient>
                    </defs>
                    {/* Heart shape */}
                    <path
                      d="M12 28 C12 28, 3 21, 3 14 C3 9, 6 6, 9 6 C10.5 6, 12 7.5, 12 9 C12 7.5, 13.5 6, 15 6 C18 6, 21 9, 21 14 C21 21, 12 28, 12 28 Z"
                      fill="url(#coupleHeartGrad)"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                {/* Groom Column */}
                <div className="flex-1 flex flex-col items-center max-w-[45%]">
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-28 md:h-28 rounded-full overflow-hidden mb-1" style={{
                    border: "2px solid #D4AF37",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.4)"
                  }}>
                    <img
                      src="/groom.png"
                      alt="Kaustav"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "35% center" }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFF9E6] to-[#FFE4B5]">
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
                  <p className="text-[#A1122F] font-serif italic text-xs sm:text-sm md:text-base font-semibold text-center leading-tight">
                    Kaustav
                  </p>
                </div>
              </div>

              {/* Floral divider */}
              <div className="flex items-center justify-center gap-1.5 mb-1 md:mb-1.5">
                <span className="text-[#D4AF37] text-sm">🌸</span>
                <div className="w-6 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-base">🌺</span>
                <div className="w-6 h-px bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm">🌸</span>
              </div>

              {/* Parents Details - Below Couple Names */}
              <div className="mb-1 md:mb-1.5 px-1 sm:px-2">
                <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-4">
                  {/* Bride's Parents - Left */}
                  <div className="flex-1 text-center relative">
                    {/* Decorative flourish top */}
                    <div className="flex justify-center mb-1">
                      <svg width="20" height="8" viewBox="0 0 20 8" className="w-4 h-2 sm:w-5 sm:h-2">
                        <path d="M0 4 Q5 0 10 4 Q15 8 20 4" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                      </svg>
                    </div>

                    <p
                      className="font-serif text-[9px] sm:text-[10px] md:text-xs font-semibold mb-1 tracking-wider"
                      style={{
                        background: "linear-gradient(135deg, #7A0F1C 0%, #A1122F 50%, #7A0F1C 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      Daughter of
                    </p>

                    <div className="space-y-0.5">
                      <p className="text-[#4A4A4A] font-serif text-[9px] sm:text-[10px] md:text-[11px] leading-tight font-medium" style={{
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}>
                        Mr. Himadri Dam
                      </p>
                      <p className="text-[#D4AF37] text-[8px] sm:text-[9px] font-light">
                        &
                      </p>
                      <p className="text-[#4A4A4A] font-serif text-[9px] sm:text-[10px] md:text-[11px] leading-tight font-medium" style={{
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}>
                        Mrs. Pinki Dam
                      </p>
                    </div>

                    {/* Decorative flourish bottom */}
                    <div className="flex justify-center mt-1">
                      <svg width="20" height="8" viewBox="0 0 20 8" className="w-4 h-2 sm:w-5 sm:h-2">
                        <path d="M0 4 Q5 8 10 4 Q15 0 20 4" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>

                  {/* Elegant Separator with ornament */}
                  <div className="flex flex-col items-center justify-center px-1 gap-1">
                    <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent via-[#D4AF37] to-[#D4AF37] opacity-50" />
                    <svg width="12" height="12" viewBox="0 0 12 12" className="w-3 h-3">
                      <circle cx="6" cy="6" r="4" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.6"/>
                      <circle cx="6" cy="6" r="2" fill="#D4AF37" opacity="0.4"/>
                    </svg>
                    <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-[#D4AF37] to-transparent opacity-50" />
                  </div>

                  {/* Groom's Parents - Right */}
                  <div className="flex-1 text-center relative">
                    {/* Decorative flourish top */}
                    <div className="flex justify-center mb-1">
                      <svg width="20" height="8" viewBox="0 0 20 8" className="w-4 h-2 sm:w-5 sm:h-2">
                        <path d="M0 4 Q5 0 10 4 Q15 8 20 4" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                      </svg>
                    </div>

                    <p
                      className="font-serif text-[9px] sm:text-[10px] md:text-xs font-semibold mb-1 tracking-wider"
                      style={{
                        background: "linear-gradient(135deg, #7A0F1C 0%, #A1122F 50%, #7A0F1C 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                      }}
                    >
                      Son of
                    </p>

                    <div className="space-y-0.5">
                      <p className="text-[#4A4A4A] font-serif text-[9px] sm:text-[10px] md:text-[11px] leading-tight font-medium" style={{
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}>
                        Mr. Krishnendu Banerjee
                      </p>
                      <p className="text-[#D4AF37] text-[8px] sm:text-[9px] font-light">
                        &
                      </p>
                      <p className="text-[#4A4A4A] font-serif text-[9px] sm:text-[10px] md:text-[11px] leading-tight font-medium" style={{
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }}>
                        Mrs. Anshu Banerjee
                      </p>
                    </div>

                    {/* Decorative flourish bottom */}
                    <div className="flex justify-center mt-1">
                      <svg width="20" height="8" viewBox="0 0 20 8" className="w-4 h-2 sm:w-5 sm:h-2">
                        <path d="M0 4 Q5 8 10 4 Q15 0 20 4" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider before invitation text */}
              <div className="flex items-center gap-2 mb-1 md:mb-1.5">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
                <span className="text-[#D4AF37] text-xs">✦</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-40" />
              </div>

              {/* Invitation text */}
              <div className="text-center mb-1 md:mb-1.5 px-2">
                <p className="italic text-gray-700 mb-0.5 sm:mb-1 leading-snug text-[9.5px] sm:text-[10.5px] md:text-sm">
                  With immense joy and the blessings of our families,
                  we invite you to celebrate our sacred union.
                </p>
                <p className="italic text-gray-700 leading-snug text-[9.5px] sm:text-[10.5px] md:text-sm">
                  Join us as we begin this beautiful journey together
                  filled with love, tradition, and happiness.
                </p>
              </div>

              {/* Bottom message */}
              <div className="text-center mb-0.5">
                <p className="italic text-[#A1122F] font-serif text-[8.5px] sm:text-[9.5px] md:text-xs font-semibold">
                  ✨ Your blessings are our greatest gift ✨
                </p>
              </div>
            </div>

            {/* Begin Celebration Button - No whitespace */}
            <div
                className="pt-1 sm:pt-1.5 md:pt-2 border-t text-center flex-shrink-0"
                style={{ borderColor: "rgba(212,175,55,0.3)" }}
            >
              <p className="text-[#7A0F1C] font-serif italic text-[8.5px] sm:text-[9.5px] md:text-sm mb-1 sm:mb-1.5">
                The celebration begins here...
              </p>
              <motion.button
                  onClick={() => {
                    if (onFinish) onFinish();
                    else window.location.href = "/side-selection";
                  }}
                  className="relative px-4 py-2 sm:px-6 sm:py-2.5 md:px-10 md:py-3.5 rounded-full font-serif tracking-wide text-[9.5px] sm:text-[10.5px] md:text-base overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg,#D4AF37,#FFD700,#C6A75E)",
                    color: "#7A0F1C",
                    boxShadow: "0 6px 24px rgba(212,175,55,0.45)"
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
              >
                {/* Shimmer animation */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                          "linear-gradient(120deg, transparent, rgba(255,255,255,0.6), transparent)"
                    }}
                    animate={{ x: ["-120%", "200%"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "linear"
                    }}
                />

                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 md:gap-2.5 justify-center whitespace-nowrap">
                  Enter the Celebration
                  <motion.span
                      animate={{ x: [0, 6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                      className="text-xs sm:text-sm md:text-lg font-bold"
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stylish Bottom-Right Music Button */}
        <AnimatePresence>
          {letterVisible && (
            <motion.button
              onClick={togglePlayPause}
              className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 md:bottom-10 md:right-10 z-50 p-3 sm:p-3.5 md:p-4 rounded-full shadow-xl border-2 transition-all"
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
                <Music size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
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

