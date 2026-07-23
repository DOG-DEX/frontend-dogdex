export interface ProductVariant {
  id: string;
  name: string;
  subtitle: string;
  colorHex: string;
  bgGradient: string;
  tagImage: string;
  accentColor: string;
  cardBg: string;
  cardText: string;
  glowColor: string;
}

export const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: "silver",
    name: "Silver Steel",
    subtitle: "Classic Aircraft Grade",
    colorHex: "#E2E8F0",
    bgGradient: "from-[#85E0C0] via-[#A8E8D0] to-[#6CD4AD]",
    tagImage: "/images/smart-qr-tag.png",
    accentColor: "bg-[#1A1C1B] text-white",
    cardBg: "bg-[#E2E8F0]/75 border-white/80",
    cardText: "text-[#1A1C1B]",
    glowColor: "rgba(226, 232, 240, 0.6)",
  },
  {
    id: "mint",
    name: "Neon Mint",
    subtitle: "Emerald Pop Edition",
    colorHex: "#85E0C0",
    bgGradient: "from-[#85E0C0] via-[#00A170]/40 to-[#A8E8D0]",
    tagImage: "/images/smart-qr-tag.png",
    accentColor: "bg-[#00A170] text-white",
    cardBg: "bg-[#85E0C0]/75 border-white/80",
    cardText: "text-[#1A1C1B]",
    glowColor: "rgba(133, 224, 192, 0.6)",
  },
  {
    id: "orange",
    name: "Sunset Orange",
    subtitle: "Vibrant Pop Edition",
    colorHex: "#FF6B00",
    bgGradient: "from-[#FF6B00]/35 via-[#FFD6A5] to-[#FF6B00]/20",
    tagImage: "/images/smart-qr-tag.png",
    accentColor: "bg-[#FF6B00] text-white",
    cardBg: "bg-[#FF6B00]/80 border-white/80",
    cardText: "text-white",
    glowColor: "rgba(255, 107, 0, 0.6)",
  },
  {
    id: "black",
    name: "Cyber Black",
    subtitle: "Laser Gold Engraved",
    colorHex: "#1A1C1B",
    bgGradient: "from-[#232B26] via-[#1A1C1B] to-[#343D37]",
    tagImage: "/images/smart-qr-tag.png",
    accentColor: "bg-[#FF3B30] text-white",
    cardBg: "bg-[#1A1C1B]/85 border-neutral-700/80",
    cardText: "text-white",
    glowColor: "rgba(26, 28, 27, 0.8)",
  },
];
