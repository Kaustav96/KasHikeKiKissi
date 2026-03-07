import { Sun, Music, Sparkles, Heart, Crown } from "lucide-react";

export function getEventIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("haldi")) return Sun;
  if (t.includes("sangeet") || t.includes("music")) return Music;
  if (t.includes("reception")) return Sparkles;
  if (t.includes("engagement")) return Heart;
  return Crown;
}

export function getWardrobeTip(title: string, dressCode: string | null | undefined): {
  style: string; desc: string; tip: string; footwear: string; imageUrl: string;
} {
  const t = title.toLowerCase();
  if (t.includes("haldi")) return {
    style: "Sunlit Traditional",
    desc: dressCode || "Bright yellows & greens — airy and full of life.",
    tip: "A light Anarkali or comfortable Kurta set is perfect. Choose breathable cotton or linen fabrics — you'll be seated for a while.",
    footwear: "Flats or Juttis — easy to remove for the rituals.",
    imageUrl: "",
  };
  if (t.includes("sangeet")) return {
    style: "Festive Evening Glam",
    desc: dressCode || "Bold, shimmery, and made for dancing all night.",
    tip: "A vibrant Lehenga, Indo-western fusion, or a sharply-cut Sherwani works beautifully. Make sure you can move freely!",
    footwear: "Block heels or Mojari — stylish yet stable on the dance floor.",
    imageUrl: "",
  };
  if (t.includes("engagement")) return {
    style: "Festive & Celebratory",
    desc: dressCode || "Bright, cheerful attire for a joyous occasion.",
    tip: "Opt for vibrant Indian formals. Semi-formal Indian wear works well — think Lehenga, co-ord sets, or a smart Kurta.",
    footwear: "Block heels, Juttis, or dress flats.",
    imageUrl: "",
  };
  if (t.includes("reception")) return {
    style: "Black-tie Indian Elegance",
    desc: dressCode || "Formal, richly embellished, and statement-worthy.",
    tip: "A designer saree, embellished Lehenga, or a formal Sherwani with accessories. This is the evening to truly shine.",
    footwear: "Embellished heels or Nagra shoes — polished and formal.",
    imageUrl: "",
  };
  if (t.includes("vidai")) return {
    style: "Elegant & Emotional",
    desc: dressCode || "Grace and tradition for a touching farewell.",
    tip: "Traditional attire befitting a meaningful ceremony. Subtle, elegant colours are preferred over very bright ones.",
    footwear: "Comfortable flats or traditional footwear.",
    imageUrl: "",
  };
  if (t.includes("wedding") || t.includes("ceremony") || t.includes("biye")) return {
    style: "Elegant Traditional Wear",
    desc: dressCode || "Modest and comfortable for the holy ceremony.",
    tip: "Traditional attire — silk saree with heavy border, or a dhoti-kurta. Expect long rituals while seated; comfort is key.",
    footwear: "Comfortable flats or Juttis — rituals require removing footwear.",
    imageUrl: "",
  };
  return {
    style: dressCode ?? "Smart Indian Formals",
    desc: dressCode ?? "Dress elegantly for the occasion.",
    tip: `Follow the dress code: ${dressCode ?? "Indian formals"}. When in doubt, err on the side of traditional.`,
    footwear: "Comfortable footwear appropriate for the event.",
    imageUrl: "",
  };
}

export function getDressCodeColors(title: string): { primary: string; secondary: string; tertiary: string } {
  const t = title.toLowerCase();
  if (t.includes("haldi")) return { primary: "#FDB750", secondary: "#7FB069", tertiary: "#FFD88E" }; // Yellow, green, light yellow
  if (t.includes("sangeet")) return { primary: "#E91E8C", secondary: "#C6A75E", tertiary: "#8B3A8B" }; // Pink, gold, purple
  if (t.includes("engagement")) return { primary: "#E85D75", secondary: "#C6A75E", tertiary: "#FF9AA2" }; // Rose, gold, light pink
  if (t.includes("reception")) return { primary: "#8B0000", secondary: "#C6A75E", tertiary: "#2C1400" }; // Deep red, gold, black
  if (t.includes("vidai")) return { primary: "#D4A5A5", secondary: "#E6B9A6", tertiary: "#F5E6D3" }; // Muted rose, beige, cream
  if (t.includes("wedding") || t.includes("ceremony") || t.includes("biye")) return { primary: "#A1122F", secondary: "#C6A75E", tertiary: "#FFFFFF" }; // Red, gold, white
  return { primary: "#B9975B", secondary: "#8B6914", tertiary: "#EFE6D8" }; // Default gold palette
}
