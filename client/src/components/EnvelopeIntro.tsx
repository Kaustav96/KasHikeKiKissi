import { motion } from "framer-motion";
import { useState } from "react";

interface EnvelopeIntroProps {
    onFinish: () => void;
}

export default function EnvelopeIntro({ onFinish }: EnvelopeIntroProps) {
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => {
        if (opened) return;

        setOpened(true);

        setTimeout(() => {
            setLoading(true);
        }, 7000);

        setTimeout(() => {
            onFinish();
        }, 8500);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg,#F5EDE5 0%,#EFE6D8 50%,#F5EDE5 100%)",
            }}
        >

            {/* GANESH CAMOUFLAGE BACKGROUND */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                transition={{ duration: 2 }}
            >
                <img
                    src="/Ganeshji.png"
                    className="w-[900px] max-w-none object-contain"
                    style={{
                        filter: "blur(2px) drop-shadow(0 0 40px rgba(198,167,94,0.3))",
                    }}
                />
            </motion.div>

            {/* GOLDEN RADIAL GLOW */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
                <div
                    style={{
                        width: "900px",
                        height: "900px",
                        background:
                            "radial-gradient(circle, rgba(198,167,94,0.25) 0%, transparent 60%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            {/* Decorative Background Patterns */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <svg className="absolute w-full h-full">
                    <defs>
                        <pattern id="paisley" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                            <path d="M40 20 Q30 30 40 50 Q50 60 60 50 Q70 40 60 20 Q50 10 40 20"
                                fill="none" stroke="#C6A75E" strokeWidth="1" opacity="0.6" />
                            <circle cx="50" cy="35" r="15" fill="none" stroke="#A1122F" strokeWidth="0.8" opacity="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#paisley)" />
                </svg>
            </div>

            {/* Container for Ganesh and Envelope */}
            <div className="relative flex flex-col items-center gap-8">

                {/* GANESH ICON */}
                {/* <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{
                        opacity: opened ? 0 : 1,
                        y: opened ? -40 : 0,
                        scale: opened ? 0.7 : 1
                    }}
                >
                    <motion.img
                        src="/Ganeshji.png"
                        className="w-36 h-36 drop-shadow-lg object-contain"
                        animate={{
                            filter: [
                                "drop-shadow(0 4px 8px rgba(198,167,94,0.3))",
                                "drop-shadow(0 6px 12px rgba(198,167,94,0.5))",
                                "drop-shadow(0 4px 8px rgba(198,167,94,0.3))"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div> */}

                <div
                    className="relative w-[360px] h-[230px] cursor-pointer"
                    onClick={handleOpen}
                >

                    {/* ENVELOPE BODY */}

                    <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            background:
                                "linear-gradient(145deg,#8B0000 0%,#6B0000 60%,#3B0000 100%)",
                            boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
                            border: "2px solid #C6A75E",
                        }}
                    />

                    {/* INVITATION LETTER */}

                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 rounded-lg shadow-2xl overflow-hidden"
                        style={{
                            top: 45,
                            width: "500px",
                            height: "650px",
                            background: "linear-gradient(135deg, #FFFFFF 0%, #FFF9F0 50%, #FFFBF5 100%)",
                            border: "4px double #C6A75E",
                            zIndex: 20,
                        }}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{
                            opacity: opened ? 1 : 0,
                            y: opened ? -350 : 0,
                            scale: opened ? 1 : 0.5,
                        }}
                        transition={{
                            duration: 1.4,
                            delay: 1.2,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-12 py-10">

                            <img
                                src="/top.png"
                                className="absolute top-0 left-0 w-full opacity-50"
                                style={{
                                    height: "40%",
                                    objectFit: "cover",
                                }}
                            />

                            <img
                                src="/bottom.png"
                                className="absolute bottom-0 left-0 w-full opacity-50"
                                style={{
                                    height: "40%",
                                    objectFit: "cover",
                                }}
                            />

                            <motion.p
                                className="font-serif text-5xl font-extrabold relative z-10 mb-3"
                                style={{ color: "#A1122F" }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 10 }}
                                transition={{ delay: 2.6 }}
                            >
                                শুভ বিবাহ
                            </motion.p>

                            <motion.p
                                className="text-[15px] tracking-[0.25em] uppercase mb-2 italic font-semibold"
                                style={{ color: "#8B6B2E" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: opened ? 1 : 0 }}
                                transition={{ delay: 2.8 }}
                            >
                                Shubho Bibaho
                            </motion.p>

                            <motion.p
                                className="text-[12px] tracking-[0.2em] uppercase mb-6 font-semibold"
                                style={{ color: "#6B5B47" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: opened ? 1 : 0 }}
                                transition={{ delay: 3.0 }}
                            >
                                Wedding Invitation
                            </motion.p>

                            <motion.p
                                className="text-[13px] italic leading-relaxed font-medium"
                                style={{ color: "#6B5B47" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: opened ? 1 : 0 }}
                                transition={{ delay: 3.2 }}
                            >
                                With blessings of our families
                            </motion.p>

                        </div>
                    </motion.div>
                        {/* WAX SEAL */}

{!opened && (
  <motion.div
    className="absolute flex items-center justify-center"
    style={{
      top: "48px",      // aligns with triangle tip
      left: "135px",    // move slightly left from center
      zIndex: 30
    }}
    initial={{ scale: 0.95 }}
    animate={{
      opacity: opened ? 0 : 1,
      scale: [1, 1.05, 1],
    }}
    transition={{
      opacity: { duration: 0.4 },
      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    }}
  >
    <div
      className="w-24 h-24 rounded-full flex items-center justify-center font-serif"
      style={{
        background:
          "linear-gradient(145deg,#FFD700 0%,#E6BE00 40%,#C6A75E 70%,#8B6B2E 100%)",
        color: "#7A0F1C",
        fontSize: "24px",
        fontWeight: "bold",
        boxShadow:
          "0 12px 40px rgba(198,167,94,0.6), inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.25)",
        border: "2px solid #B9975B",
      }}
    >
      HK
    </div>
  </motion.div>
)}

                    {/* ENVELOPE FLAP */}

                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[110px] origin-top"
                        style={{
                            background:
                                "linear-gradient(180deg,#A1122F 0%,#8B0000 50%,#5C0000 100%)",
                            clipPath: "polygon(0 0,100% 0,50% 70%)",
                            zIndex: 10,
                        }}
                        animate={{
                            rotateX: opened ? -180 : 0,
                        }}
                        transition={{
                            duration: 1.2,
                        }}
                    />

                </div>
            </div>

            {/* LOADING SPINNER */}
            {loading && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-[60]"
                    style={{
                        background: "rgba(245, 237, 229, 0.3)",
                        backdropFilter: "blur(2px)"
                    }}
                >
                    <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl"
                        style={{
                            background: "rgba(245, 237, 229, 0.95)",
                            boxShadow: "0 8px 32px rgba(198, 167, 94, 0.3)",
                            border: "1px solid rgba(198, 167, 94, 0.4)"
                        }}
                    >

                        <motion.div
                            className="w-16 h-16 border-4 rounded-full"
                            style={{
                                borderColor: "#C6A75E",
                                borderTopColor: "#A1122F",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        <p
                            className="text-lg font-serif tracking-wide"
                            style={{ color: "#8B6B2E" }}
                        >
                            Loading...
                        </p>

                    </div>
                </motion.div>
            )}

        </div>
    );
}
// import { motion } from "framer-motion";
// import { useState } from "react";

// interface EnvelopeIntroProps {
//     onFinish: () => void;
// }

// export default function EnvelopeIntro({ onFinish }: EnvelopeIntroProps) {
//     const [opened, setOpened] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const handleOpen = () => {
//         if (opened) return;

//         setOpened(true);

//         // Show loading spinner after letter is displayed
//         setTimeout(() => {
//             setLoading(true);
//         }, 7000);

//         // Transition to next screen
//         setTimeout(() => {
//             onFinish();
//         }, 8500);
//     };

//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             style={{
//                 background:
//                     "linear-gradient(135deg,#F5EDE5 0%,#EFE6D8 50%,#F5EDE5 100%)",
//             }}
//         >
//             {/* Decorative Background Patterns */}
//             <div className="absolute inset-0 overflow-hidden opacity-20">
//                 {/* Paisley/Mandala Pattern Decorations */}
//                 <svg className="absolute w-full h-full">
//                     <defs>
//                         <pattern id="paisley" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
//                             <path d="M40 20 Q30 30 40 50 Q50 60 60 50 Q70 40 60 20 Q50 10 40 20"
//                                   fill="none" stroke="#C6A75E" strokeWidth="1" opacity="0.6"/>
//                             <circle cx="50" cy="35" r="15" fill="none" stroke="#A1122F" strokeWidth="0.8" opacity="0.5"/>
//                             <path d="M45 30 L55 30 M50 25 L50 45" stroke="#C6A75E" strokeWidth="0.5" opacity="0.4"/>
//                         </pattern>
//                     </defs>
//                     <rect width="100%" height="100%" fill="url(#paisley)"/>
//                 </svg>

//                 {/* Corner Decorative Elements */}
//                 {[0, 1, 2, 3].map((i) => (
//                     <motion.div
//                         key={i}
//                         className={`absolute w-32 h-32 ${
//                             i === 0 ? 'top-4 left-4' :
//                             i === 1 ? 'top-4 right-4' :
//                             i === 2 ? 'bottom-4 left-4' : 'bottom-4 right-4'
//                         }`}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 0.3, scale: 1 }}
//                         transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
//                     >
//                         <svg viewBox="0 0 100 100" className="w-full h-full">
//                             <circle cx="50" cy="50" r="40" fill="none" stroke="#C6A75E" strokeWidth="1.5"/>
//                             <circle cx="50" cy="50" r="30" fill="none" stroke="#A1122F" strokeWidth="1"/>
//                             <path d="M50 20 L50 35 M50 65 L50 80 M20 50 L35 50 M65 50 L80 50"
//                                   stroke="#C6A75E" strokeWidth="2"/>
//                             {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
//                                 const rad = (angle * Math.PI) / 180;
//                                 const x1 = 50 + 20 * Math.cos(rad);
//                                 const y1 = 50 + 20 * Math.sin(rad);
//                                 const x2 = 50 + 25 * Math.cos(rad);
//                                 const y2 = 50 + 25 * Math.sin(rad);
//                                 return <circle key={angle} cx={x2} cy={y2} r="2" fill="#A1122F"/>;
//                             })}
//                         </svg>
//                     </motion.div>
//                 ))}
//             </div>

//             {/* Container for Ganesh and Envelope - Centered Together */}
//             <div className="relative flex flex-col items-center gap-8">
//                 {/* GANESH ICON - Above Envelope */}
//                 <motion.div
//                     className="relative z-10"
//                     initial={{ opacity: 0, y: -20, scale: 0.8 }}
//                     animate={{
//                         opacity: opened ? 0 : 1,
//                         y: opened ? -40 : 0,
//                         scale: opened ? 0.7 : 1
//                     }}
//                     transition={{
//                         opacity: { duration: 0.6 },
//                         y: { duration: 0.8 },
//                         scale: { duration: 0.6 }
//                     }}
//                 >
//                     <motion.img
//                         src="/Ganeshji.png"
//                         className="w-48 h-48 drop-shadow-lg object-contain"
//                         animate={{
//                             filter: opened ? [
//                                 "drop-shadow(0 4px 8px rgba(198,167,94,0.3))"
//                             ] : [
//                                 "drop-shadow(0 4px 8px rgba(198,167,94,0.3))",
//                                 "drop-shadow(0 6px 12px rgba(198,167,94,0.5))",
//                                 "drop-shadow(0 4px 8px rgba(198,167,94,0.3))"
//                             ]
//                         }}
//                         transition={{ duration: 2, repeat: opened ? 0 : Infinity, ease: "easeInOut" }}
//                     />
//                 </motion.div>

//                 <div
//                     className="relative w-[360px] h-[230px] cursor-pointer"
//                     onClick={handleOpen}
//                 >

//                 {/* ENVELOPE BODY */}

//                 <div
//                     className="absolute inset-0 rounded-lg"
//                     style={{
//                         background:
//                             "linear-gradient(145deg,#8B0000 0%,#6B0000 60%,#3B0000 100%)",
//                         boxShadow: "0 40px 120px rgba(0,0,0,0.35)",
//                         border: "2px solid #C6A75E",
//                     }}
//                 />

//                 {/* INVITATION LETTER */}

//                 <motion.div
//                     className="absolute left-1/2 -translate-x-1/2 rounded-lg shadow-2xl overflow-hidden"
//                     style={{
//                         top: 45,
//                         width: "500px",
//                         height: "650px",
//                         background: "linear-gradient(135deg, #FFFFFF 0%, #FFF9F0 50%, #FFFBF5 100%)",
//                         border: "4px double #C6A75E",
//                         zIndex: 20,
//                     }}
//                     initial={{ opacity: 0, y: 0, scale: 0.5 }}
//                     animate={{
//                         opacity: opened ? 1 : 0,
//                         y: opened ? -350 : 0,
//                         scale: opened ? 1 : 0.5,
//                     }}
//                     transition={{
//                         duration: 1.4,
//                         delay: 1.2,
//                         ease: [0.16, 1, 0.3, 1]
//                     }}
//                 >
//                     <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-12 py-10">

//                         {/* TOP FLORAL BACKGROUND - Top Third Coverage */}
//                         <img
//                             src="/top.png"
//                             className="absolute top-0 left-0 w-full pointer-events-none opacity-50"
//                             style={{
//                                 height: "40%",
//                                 objectFit: "cover",
//                                 objectPosition: "top center"
//                             }}
//                         />

//                         {/* BOTTOM FLORAL BACKGROUND - Bottom Third Coverage */}
//                         <img
//                             src="/bottom.png"
//                             className="absolute bottom-0 left-0 w-full pointer-events-none opacity-50"
//                             style={{
//                                 height: "40%",
//                                 objectFit: "cover",
//                                 objectPosition: "bottom center"
//                             }}
//                         />

//                         {/* BENGALI TITLE */}
//                         <motion.p
//                             className="font-serif text-5xl font-extrabold relative z-10 mb-3"
//                             style={{ color: "#A1122F", textShadow: "0 1px 2px rgba(139,0,0,0.1)" }}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 10 }}
//                             transition={{ delay: 2.6 }}
//                         >
//                             শুভ বিবাহ
//                         </motion.p>

//                         <motion.p
//                             className="text-[15px] tracking-[0.25em] uppercase mb-2 relative z-10 italic font-semibold"
//                             style={{ color: "#8B6B2E" }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: opened ? 1 : 0 }}
//                             transition={{ delay: 2.8 }}
//                         >
//                             Shubho Bibaho
//                         </motion.p>

//                         <motion.p
//                             className="text-[12px] tracking-[0.2em] uppercase mb-6 relative z-10 font-semibold"
//                             style={{ color: "#6B5B47" }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: opened ? 1 : 0 }}
//                             transition={{ delay: 3.0 }}
//                         >
//                             Wedding Invitation
//                         </motion.p>

//                         <motion.p
//                             className="text-[13px] italic leading-relaxed relative z-10 font-medium"
//                             style={{ color: "#6B5B47" }}
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: opened ? 1 : 0 }}
//                             transition={{ delay: 3.2 }}
//                         >
//                             With blessings of our families
//                         </motion.p>

//                     </div>
//                 </motion.div>

//                 {/* ENVELOPE FLAP */}

//                 <motion.div
//                     className="absolute top-0 left-0 right-0 h-[110px] origin-top"
//                     style={{
//                         background:
//                             "linear-gradient(180deg,#A1122F 0%,#8B0000 50%,#5C0000 100%)",
//                         clipPath: "polygon(0 0,100% 0,50% 70%)",
//                         zIndex: 10,
//                         transformStyle: "preserve-3d"
//                     }}
//                     animate={{
//                         rotateX: opened ? -180 : 0,
//                     }}
//                     transition={{
//                         duration: 1.2,
//                     }}
//                 />

//                 {/* WAX SEAL */}

//                 {!opened && (
//                     <motion.div
//                         className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
//                         style={{ top: "75px", zIndex: 30 }}
//                         animate={{ opacity: opened ? 0 : 1 }}
//                         transition={{ duration: 0.4 }}
//                     >
//                         <div
//                             className="w-24 h-24 rounded-full flex items-center justify-center font-serif"
//                             style={{
//                                 background:
//                                     "linear-gradient(145deg,#FFD700 0%,#E6BE00 40%,#C6A75E 70%,#8B6B2E 100%)",
//                                 color: "#7A0F1C",
//                                 fontSize: "22px",
//                                 boxShadow:
//                                     "0 12px 40px rgba(198,167,94,0.5), inset 0 3px 6px rgba(255,255,255,0.6), inset 0 -4px 8px rgba(0,0,0,0.25)",
//                                 border: "2px solid #B9975B",
//                             }}
//                         >
//                             HK
//                         </div>
//                     </motion.div>
//                 )}

//                 {/* TAP TEXT */}

//                 {!opened && (
//                     <p
//                         className="absolute bottom-[-40px] w-full text-center text-lg tracking-widest"
//                         style={{ color: "#8B6B2E" }}
//                     >
//                         Tap to Open the Invitation
//                     </p>
//                 )}
//             </div>
//             </div>

//             {/* LOADING SPINNER */}
//             {loading && (
//                 <motion.div
//                     className="fixed inset-0 flex items-center justify-center z-[60]"
//                     style={{
//                         background: "rgba(245, 237, 229, 0.3)",
//                         backdropFilter: "blur(2px)"
//                     }}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl" style={{
//                         background: "rgba(245, 237, 229, 0.95)",
//                         boxShadow: "0 8px 32px rgba(198, 167, 94, 0.3)",
//                         border: "1px solid rgba(198, 167, 94, 0.4)"
//                     }}>
//                         {/* Spinner */}
//                         <motion.div
//                             className="w-16 h-16 border-4 rounded-full"
//                             style={{
//                                 borderColor: "#C6A75E",
//                                 borderTopColor: "#A1122F",
//                                 boxShadow: "0 0 20px rgba(198,167,94,0.3)"
//                             }}
//                             animate={{ rotate: 360 }}
//                             transition={{
//                                 duration: 1,
//                                 repeat: Infinity,
//                                 ease: "linear"
//                             }}
//                         />

//                         {/* Loading Text */}
//                         <motion.p
//                             className="text-lg font-serif tracking-wide"
//                             style={{ color: "#8B6B2E" }}
//                             animate={{ opacity: [0.5, 1, 0.5] }}
//                             transition={{
//                                 duration: 1.5,
//                                 repeat: Infinity,
//                                 ease: "easeInOut"
//                             }}
//                         >
//                             Loading...
//                         </motion.p>
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );
// }