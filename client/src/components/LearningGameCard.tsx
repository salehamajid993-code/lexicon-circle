import { ArrowRight, Check, Clock3 } from "lucide-react";
import { Link } from "wouter";
import { IconMark, type IllustrationIcon } from "./Illustrations";

type Tone = "butter" | "sky" | "coral" | "leaf" | "orange" | "lavender";

const toneClasses: Record<Tone, { bg: string; ink: string }> = {
  butter: { bg: "#f9d96b", ink: "#7a5d16" },
  sky: { bg: "#8fd3e8", ink: "#25677c" },
  coral: { bg: "#f58f82", ink: "#8c3d36" },
  leaf: { bg: "#8dbf8a", ink: "#3d7042" },
  orange: { bg: "#f4a261", ink: "#824b24" },
  lavender: { bg: "#c7b7df", ink: "#5c4a7d" },
};

export type LearningGame = {
  name: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Difficult";
  ageGrade: string;
  icon: IllustrationIcon;
  tone: Tone;
  available: boolean;
  gameId?: string;
};

export default function LearningGameCard({ game }: { game: LearningGame }) {
  const tone = toneClasses[game.tone];
  return <article className="group story-card flex h-full flex-col rounded-[1.65rem] p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(74,66,45,.14)] sm:p-6">
    <div className="flex items-start justify-between gap-3"><span className="grid h-14 w-14 place-items-center rounded-[19px] border-2 border-[#263238]/10" style={{ backgroundColor: tone.bg, color: tone.ink }}><IconMark name={game.icon} size={27} /></span><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[.66rem] font-900 uppercase tracking-[.1em] ${game.available ? "bg-[#8dbf8a]/35 text-[#3d7042]" : "bg-[#f5efdf] text-[#8d8065]"}`}>{game.available ? <Check size={13} strokeWidth={3} /> : <Clock3 size={13} />}{game.available ? "Play now" : "Coming soon"}</span></div>
    <div className="mt-6 flex flex-wrap gap-2 text-[.65rem] font-900 uppercase tracking-[.12em] text-[#9b8b68]"><span>{game.category}</span><span className="text-[#e8ddc6]">•</span><span>{game.difficulty}</span></div>
    <h3 className="mt-2 font-[Fraunces] text-2xl font-600 leading-tight">{game.name}</h3><p className="mt-3 flex-1 text-sm leading-6 text-[#6d7b80]">{game.description}</p>
    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e8ddc6] pt-4 text-xs font-800 text-[#53636a]"><span>{game.ageGrade}</span>{game.gameId ? <Link href={`/learning-zone/games/${game.gameId}`} className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-[#263238] underline decoration-[#f9d96b] decoration-2 underline-offset-4">Play <ArrowRight size={15} /></Link> : <button type="button" disabled={!game.available} className="inline-flex items-center gap-1.5 rounded-lg text-[#263238] underline decoration-[#f9d96b] decoration-2 underline-offset-4 disabled:cursor-not-allowed disabled:opacity-55">Preview <ArrowRight size={15} /></button>}</div>
  </article>;
}
