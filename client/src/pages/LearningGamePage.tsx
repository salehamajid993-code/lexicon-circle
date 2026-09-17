import { Link, useRoute } from "wouter";
import LearningGameEngine from "../components/LearningGameEngine";
import { findPlayableGame } from "../data/learningGameData";

export default function LearningGamePage() {
  const [, singularParams] = useRoute("/learning-zone/game/:gameId");
  const [, pluralParams] = useRoute("/learning-zone/games/:gameId");
  const params = singularParams ?? pluralParams;
  const game = findPlayableGame(params?.gameId);
  return <div className="paper-lines min-h-[calc(100vh-5rem)] px-4 pb-16 pt-32 sm:px-8 sm:pb-24 sm:pt-40"><div className="container">{game ? <LearningGameEngine game={game} /> : <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#e8ddc6] bg-[#fffdf5] p-10 text-center"><h1 className="font-[Fraunces] text-3xl">That game is still finding its words.</h1><p className="mt-3 text-sm leading-6 text-[#6d7b80]">Please return to the Learning Zone and choose one of the playable games.</p><Link href="/learning-zone" className="mt-6 inline-flex rounded-full bg-[#263238] px-5 py-3 text-sm font-900 text-[#fff9e8]">Back to Learning Zone</Link></div>}</div></div>;
}
