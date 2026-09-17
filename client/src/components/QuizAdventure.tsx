import { useState } from "react";
import { ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "wouter";

const questions = [
  { prompt: "What would you most like to do with a story?", answers: ["Notice every tiny detail", "Invent a new world", "Tell it out loud", "Collect unusual words"] },
  { prompt: "Which creative spark sounds best today?", answers: ["A quiet reading nook", "A blank page and a pencil", "A room full of listeners", "A word with a secret meaning"] },
  { prompt: "What makes learning feel good?", answers: ["Finding something I missed", "Making an idea my own", "Sharing a thought", "Discovering a new way to say it"] },
];
const results = ["The Reader", "The Writer", "The Storyteller", "The Word Explorer"];

export default function QuizAdventure({ preview = false }: { preview?: boolean }) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [result, setResult] = useState<number | null>(null);
  const choose = (answer: number) => {
    const next = scores.map((score, index) => score + (index === answer ? 1 : 0));
    if (step === questions.length - 1) setResult(next.indexOf(Math.max(...next)));
    else { setScores(next); setStep((current) => current + 1); }
  };
  const reset = () => { setStep(0); setScores([0, 0, 0, 0]); setResult(null); };
  return <div className="rounded-[2rem] border border-[#e8ddc6] bg-[#fffdf5] p-5 shadow-[0_18px_55px_rgba(74,66,45,.08)] sm:p-8">
    <div className="flex items-center justify-between gap-4"><p className="text-xs font-900 uppercase tracking-[.16em] text-[#ef7e72]">{result === null ? `Question ${step + 1} of ${questions.length}` : "Your story path"}</p><Sparkles className="text-[#f4a261]" size={20} /></div>
    {result === null ? <div key={step} className="quiz-step-enter"><h3 className="mt-5 font-[Fraunces] text-2xl font-600 sm:text-3xl">{questions[step].prompt}</h3><div className="mt-6 grid gap-3">{questions[step].answers.map((answer, index) => <button key={answer} type="button" onClick={() => choose(index)} className="focus-ring group flex items-center justify-between rounded-2xl border border-[#e8ddc6] bg-[#fff9e8] px-4 py-4 text-left text-sm font-800 transition-all hover:-translate-y-0.5 hover:border-[#263238] hover:bg-[#f9d96b]/45"><span>{answer}</span><ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></button>)}</div><div className="mt-6 flex gap-1.5" aria-label={`Progress: question ${step + 1} of ${questions.length}`}>{questions.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= step ? "bg-[#ef7e72]" : "bg-[#e8ddc6]"}`} />)}</div></div> : <div className="quiz-result-enter py-8 text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#8dbf8a] text-[#263238]"><Check size={25} strokeWidth={3} /></span><h3 className="mt-5 font-[Fraunces] text-3xl font-600">You might be {results[result]}.</h3><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6d7b80]">There is no wrong way into a story. This path is simply a small invitation to notice what already draws you in.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/programs" className="inline-flex items-center gap-2 rounded-full bg-[#263238] px-5 py-3 text-sm font-900 text-[#fff9e8]">Explore programs <ArrowRight size={16} /></Link><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-full border-2 border-[#263238] px-5 py-3 text-sm font-900"><RotateCcw size={15} /> Try again</button></div></div>}
    {preview && result === null && <Link href="/quiz" className="mt-6 inline-flex items-center gap-2 text-sm font-900 text-[#263238] underline decoration-[#f9d96b] decoration-2 underline-offset-4">Open the full quiz <ArrowRight size={16} /></Link>}
  </div>;
}
