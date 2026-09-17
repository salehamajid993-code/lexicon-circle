import { BookOpen, Feather, Leaf, Mic2, Pencil, Scissors, Search, Sparkles, Star, Sun, WandSparkles } from "lucide-react";

const toneMap = {
  butter: { bg: "#f9d96b", ink: "#7a5d16" },
  sky: { bg: "#8fd3e8", ink: "#25677c" },
  coral: { bg: "#f58f82", ink: "#8c3d36" },
  leaf: { bg: "#8dbf8a", ink: "#3d7042" },
  orange: { bg: "#f4a261", ink: "#824b24" },
  lavender: { bg: "#c7b7df", ink: "#5c4a7d" },
} as const;

export type IllustrationIcon = "pencil" | "book" | "sparkles" | "mic" | "scissors" | "message" | "wand" | "sun" | "search";

export function IconMark({ name, size = 24, strokeWidth = 2.2 }: { name: IllustrationIcon; size?: number; strokeWidth?: number }) {
  const props = { size, strokeWidth, 'aria-hidden': true };
  if (name === "pencil") return <Pencil {...props} />;
  if (name === "book") return <BookOpen {...props} />;
  if (name === "sparkles") return <Sparkles {...props} />;
  if (name === "mic") return <Mic2 {...props} />;
  if (name === "scissors") return <Scissors {...props} />;
  if (name === "wand") return <WandSparkles {...props} />;
  if (name === "sun") return <Sun {...props} />;
  return <Search {...props} />;
}

export function MiniIcon({ name, tone = "butter" }: { name: IllustrationIcon; tone?: keyof typeof toneMap }) {
  const color = toneMap[tone];
  return <span className="grid h-12 w-12 place-items-center rounded-[17px] border-2 border-[#263238]/10" style={{ backgroundColor: color.bg, color: color.ink }}><IconMark name={name} size={23} /></span>;
}

export function Doodle({ type, className = "", size = 24 }: { type: "star" | "leaf" | "feather" | "sparkle" | "sun"; className?: string; size?: number }) {
  if (type === "leaf") return <Leaf className={className} aria-hidden="true" />;
  if (type === "feather") return <Feather className={className} aria-hidden="true" />;
  if (type === "sparkle") return <Sparkles className={className} aria-hidden="true" />;
  if (type === "sun") return <Sun className={className} size={size} aria-hidden="true" />;
  return <Star className={className} size={size} aria-hidden="true" />;
}

export function StorybookIllustration({ compact = false }: { compact?: boolean }) {
  return <div className={`relative mx-auto aspect-[4/3] w-full max-w-[570px] overflow-hidden rounded-[2.6rem] border-2 border-[#263238] bg-[#fffdf5] shadow-[7px_8px_0_#263238] ${compact ? "max-w-[260px]" : ""}`} aria-label="Two children exploring an open book with a pencil, stars, leaves and a sun" role="img"><img src="/images/lexicon-hero.png" alt="Two children exploring an open book and writing together" className="h-full w-full object-cover" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#f9d96b]/10 via-transparent to-[#8fd3e8]/10" /><span className="float-gently absolute left-[7%] top-[11%] z-10 rotate-[-14deg] text-[#ef7e72]"><Star size={32} fill="currentColor" /></span><span className="float-gently-delayed absolute right-[8%] top-[17%] z-10 rotate-[16deg] text-[#3d7042]"><Leaf size={34} /></span><span className="absolute bottom-[9%] right-[9%] z-10 rotate-[18deg] text-[#f4a261]"><Sparkles size={28} /></span></div>;
}

export function LibraryIllustration() {
  return <div className="relative mx-auto h-40 w-52" aria-hidden="true"><div className="absolute bottom-0 left-0 right-0 h-3 rounded-full bg-[#263238]" /><div className="absolute bottom-3 left-4 h-24 w-10 rounded-t-xl bg-[#f58f82] shadow-[3px_3px_0_#263238]" /><div className="absolute bottom-3 left-14 h-32 w-10 rounded-t-xl bg-[#8fd3e8] shadow-[3px_3px_0_#263238]" /><div className="absolute bottom-3 left-24 h-28 w-10 rounded-t-xl bg-[#f9d96b] shadow-[3px_3px_0_#263238]" /><div className="absolute bottom-3 left-34 h-20 w-10 rounded-t-xl bg-[#8dbf8a] shadow-[3px_3px_0_#263238]" /><span className="absolute right-2 top-0 text-[#ef7e72]"><Star size={22} fill="currentColor" /></span><span className="absolute left-1 top-8 text-[#3d7042]"><Leaf size={25} /></span></div>;
}
