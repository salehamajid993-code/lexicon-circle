import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import QuizAdventure from "../components/QuizAdventure";

export default function Quiz() {
  return <div className="pt-32 sm:pt-40"><section className="border-b border-[#e8ddc6] px-4 pb-16 sm:px-8 sm:pb-24"><div className="container grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="mb-5 text-xs font-900 uppercase tracking-[.18em] text-[#ef7e72]">A tiny personality quiz</p><h1 className="max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-600 leading-[.9]">Choose your <span className="text-[#ef7e72]">adventure.</span></h1></div><p className="max-w-md text-base leading-8 text-[#6d7b80]">A few gentle questions to help children notice what draws them into stories, words and creative play. There are no wrong answers.</p></div></section><section className="paper-lines py-16 sm:py-24"><div className="container max-w-3xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-900 text-[#6d7b80] hover:text-[#ef7e72]"><ArrowLeft size={16} /> Back home</Link><QuizAdventure /></div></section></div>;
}
