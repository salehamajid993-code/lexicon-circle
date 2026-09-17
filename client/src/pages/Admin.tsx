import { useEffect, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, ChevronRight, ClipboardList, ExternalLink, Feather, Gamepad2, Layers3, LockKeyhole, Settings2, Sparkles, Trophy, Video, WandSparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { AdminSection } from "../../../shared/adminModels";

type Section = { id: AdminSection; label: string; group: string; description: string; icon: typeof Gamepad2 };
const sections: Section[] = [
  { id: "dashboard", label: "Dashboard", group: "Overview", description: "Operational counts and service health.", icon: BarChart3 },
  { id: "games", label: "Games", group: "Learning", description: "Manage game metadata and publishing states.", icon: Gamepad2 },
  { id: "questions", label: "Questions", group: "Learning", description: "Edit, preview, reorder, and validate questions.", icon: ClipboardList },
  { id: "vocabulary", label: "Vocabulary", group: "Learning", description: "Maintain definitions, examples, and word relationships.", icon: BookOpen },
  { id: "etymology", label: "Etymology", group: "Learning", description: "Review sources before publishing word histories.", icon: Layers3 },
  { id: "writing-prompts", label: "Writing Prompts", group: "Learning", description: "Configure prompts, target words, and timers.", icon: Feather },
  { id: "featured", label: "Featured Content", group: "Content", description: "Choose weekly and featured experiences.", icon: Sparkles },
  { id: "videos", label: "Videos", group: "Content", description: "Manage approved hosted video references.", icon: Video },
  { id: "programs", label: "Programs", group: "Content", description: "Manage program content without replacing approved copy.", icon: WandSparkles },
  { id: "camps", label: "Camps", group: "Content", description: "Manage configured camps and registration references.", icon: Layers3 },
  { id: "testimonials", label: "Testimonials", group: "Content", description: "Publish only approved testimonials.", icon: CheckCircle2 },
  { id: "faqs", label: "FAQs", group: "Content", description: "Maintain common questions and answers.", icon: ClipboardList },
  { id: "points", label: "Points", group: "Rewards", description: "Configure future awards without changing history.", icon: Trophy },
  { id: "levels", label: "Levels", group: "Rewards", description: "Manage thresholds and level descriptions.", icon: BarChart3 },
  { id: "badges", label: "Badges", group: "Rewards", description: "Define explicit unlock conditions.", icon: Trophy },
  { id: "rewards", label: "Rewards", group: "Rewards", description: "Keep redemption disabled until fulfillment exists.", icon: Trophy },
  { id: "children", label: "Child Progress", group: "Progress", description: "View only authorized operational information.", icon: BookOpen },
  { id: "settings", label: "Settings", group: "System", description: "Review environment and integration status.", icon: Settings2 },
];

export default function AdminPage() {
  const [location] = useLocation();
  const activeId = (location.split("/")[2] || "dashboard") as AdminSection;
  const active = sections.find((section) => section.id === activeId) ?? sections[0];
  const ActiveIcon = active.icon;
  const [status, setStatus] = useState<{ configured: boolean; message: string } | null>(null);
  useEffect(() => {
    document.title = `Admin · ${active.label} | The Lexicon Circle`;
    const meta = document.querySelector('meta[name="robots"]') ?? document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex,nofollow");
    document.head.appendChild(meta);
    return () => { meta.remove(); };
  }, [active.label]);
  useEffect(() => { fetch("/api/admin/status").then((response) => response.json()).then(setStatus).catch(() => setStatus({ configured: false, message: "Admin status could not be checked." })); }, []);
  const groups = Array.from(new Set(sections.map((section) => section.group)));
  return <div className="min-h-[calc(100vh-5rem)] bg-[#f5f0e4] px-4 pb-20 pt-28 sm:px-8 sm:pt-36"><div className="mx-auto max-w-[1440px]"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-xs font-900 uppercase tracking-[.18em] text-[#ef7e72]">Operations workspace</p><h1 className="mt-3 font-[Fraunces] text-5xl font-600 text-[#263238]">Admin Circle</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6d7b80]">A clear place to manage Lexicon Circle content, learning configuration, and authorized progress data.</p></div><Link href="/" className="inline-flex items-center gap-2 rounded-full border-2 border-[#263238] px-4 py-2 text-sm font-900 text-[#263238] hover:bg-[#fff9e8]"><ExternalLink size={15} /> View public site</Link></div><div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]"><aside className="rounded-[1.5rem] border border-[#e8ddc6] bg-[#fffdf5] p-3 shadow-[0_14px_35px_rgba(74,66,45,.08)]"><div className="flex items-center gap-3 rounded-xl bg-[#263238] px-4 py-3 text-[#fff9e8]"><LockKeyhole size={17} className="text-[#f9d96b]" /><span className="text-sm font-900">Protected admin area</span></div>{groups.map((group) => <div key={group} className="mt-5"><p className="px-3 text-[.64rem] font-900 uppercase tracking-[.16em] text-[#9b8b68]">{group}</p><nav className="mt-2 grid gap-1" aria-label={`${group} admin links`}>{sections.filter((section) => section.group === group).map((section) => { const Icon = section.icon; const selected = section.id === active.id; return <Link key={section.id} href={`/admin/${section.id}`} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-900 transition-colors ${selected ? "bg-[#f9d96b]/35 text-[#263238]" : "text-[#6d7b80] hover:bg-[#f5f0e4]"}`}><Icon size={16} />{section.label}{selected && <ChevronRight className="ml-auto" size={15} />}</Link>; })}</nav></div>)}</aside><main className="min-w-0"><div className="rounded-[1.5rem] border border-[#e8ddc6] bg-[#fffdf5] p-6 shadow-[0_14px_35px_rgba(74,66,45,.08)] sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-900 uppercase tracking-[.16em] text-[#ef7e72]">{active.group}</p><h2 className="mt-2 font-[Fraunces] text-4xl font-600 text-[#263238]">{active.label}</h2><p className="mt-2 text-sm leading-6 text-[#6d7b80]">{active.description}</p></div><ActiveIcon className="text-[#f9d96b]" size={34} /></div>{status && <div role="status" className="mt-7 flex items-start gap-3 rounded-2xl border border-[#f4a261]/45 bg-[#f4a261]/12 p-4 text-sm leading-6 text-[#53636a]"><LockKeyhole className="mt-0.5 shrink-0 text-[#ef7e72]" size={18} /><div><strong className="font-900">Admin tools are not connected.</strong><br />{status.message} This interface will not claim saves, publishing, or analytics until server-side admin authentication and a durable content store are configured.</div></div>}<div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{(active.id === "dashboard" ? ["Active games", "Writing submissions", "Assessments pending", "Published prompts", "Parent accounts", "Child profiles"] : ["Draft content", "Published content", "Disabled content"]).map((label) => <div key={label} className="rounded-2xl border border-[#e8ddc6] bg-[#fff9e8] p-5"><p className="text-xs font-900 uppercase tracking-[.12em] text-[#9b8b68]">{label}</p><p className="mt-3 font-[Fraunces] text-3xl text-[#9b8b68]">—</p><p className="mt-1 text-xs text-[#9b8b68]">Unavailable until connected</p></div>)}</div><div className="mt-8 rounded-2xl border border-dashed border-[#e8ddc6] p-8 text-center"><Settings2 className="mx-auto text-[#f9d96b]" size={30} /><h3 className="mt-4 font-[Fraunces] text-2xl text-[#263238]">No records to show yet</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6d7b80]">The content model and publishing states are defined, but this environment has no authenticated admin session or durable content database. No placeholder rows have been invented.</p><button type="button" disabled className="mt-6 inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-[#263238]/35 px-5 py-3 text-sm font-900 text-[#fff9e8]">Connect admin storage to manage content</button></div></div></main></div></div></div>;
}
