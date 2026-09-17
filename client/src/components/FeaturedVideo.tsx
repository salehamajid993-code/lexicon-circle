import { Play, Sparkles } from "lucide-react";
import { featuredChildVideo } from "../data/siteData";

export default function FeaturedVideo() {
  const video = featuredChildVideo;
  return (
    <section className="bg-[#f7efd9] py-16 sm:py-24">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-[#263238] bg-[#263238] shadow-[7px_8px_0_#f58f82]">
          {video.videoUrl ? <video className="aspect-video w-full object-cover" controls preload="metadata" poster={video.thumbnail} aria-label={video.title}><source src={video.videoUrl} /></video> : <div className="relative aspect-video overflow-hidden"><img src={video.thumbnail} loading="lazy" alt="Storybook illustration placeholder for the featured child video" className="h-full w-full object-cover opacity-75" /><div className="absolute inset-0 grid place-items-center bg-[#263238]/25"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#f9d96b] text-[#263238] shadow-[4px_4px_0_#263238]"><Play fill="currentColor" size={25} /></span></div><p className="absolute bottom-4 left-4 rounded-full bg-[#fff9e8]/90 px-3 py-1.5 text-[.68rem] font-900 uppercase tracking-[.13em] text-[#263238]">Demo placeholder · video coming soon</p></div>}
        </div>
        <div>
          <div className="mb-4 flex items-center gap-3 text-[.7rem] font-900 uppercase tracking-[.18em] text-[#ef7e72]"><span className="h-px w-7 bg-current" /><Sparkles size={15} /> Weekly feature</div>
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-600 leading-[.95]">Little Voices, <span className="text-[#ef7e72]">Big Stories.</span></h2>
          <p className="mt-5 text-base leading-7 text-[#6d7b80]">A gentle showcase for the ideas, words and stories children are making right now.</p>
          <div className="mt-7 rounded-2xl border border-[#e8ddc6] bg-[#fffdf5] p-5"><p className="text-xs font-900 uppercase tracking-[.14em] text-[#ef7e72]">{video.category}</p><h3 className="mt-2 font-[Fraunces] text-2xl font-600">{video.title}</h3><p className="mt-2 text-sm leading-6 text-[#6d7b80]">{video.description}</p><p className="mt-4 text-sm font-900 text-[#263238]">{video.name}</p></div>
        </div>
      </div>
    </section>
  );
}
