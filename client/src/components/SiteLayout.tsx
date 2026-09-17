import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowUpRight, BookOpen, Instagram, Menu, X } from "lucide-react";
import { siteConfig } from "../data/siteData";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Camps", href: "/camps" },
  { label: "Quiz", href: "/quiz" },
  { label: "Learning Zone", href: "/learning-zone" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Brand() {
  return <Link href="/" className="group flex items-center gap-3 focus-ring rounded-xl" aria-label="The Lexicon Circle home"><span className="grid h-10 w-10 place-items-center rounded-[13px] bg-[#f9d96b] text-[#263238] shadow-[3px_4px_0_#263238] transition-transform duration-200 group-hover:-rotate-6"><BookOpen size={21} strokeWidth={2.5} /></span><span className="leading-[.95]"><span className="block font-[Fraunces] text-[1.08rem] font-bold tracking-[-.04em]">The Lexicon</span><span className="block font-[Fraunces] text-[1.08rem] font-bold tracking-[-.04em] text-[#ef7e72]">Circle</span></span></Link>;
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 18); window.addEventListener("scroll", handleScroll, { passive: true }); return () => window.removeEventListener("scroll", handleScroll); }, []);
  useEffect(() => { setMenuOpen(false); if (!location.includes("#")) window.scrollTo({ top: 0, behavior: "smooth" }); }, [location]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  const isActive = (href: string) => href === "/" ? location === "/" : location.startsWith(href);
  const handleNav = (href: string) => { setMenuOpen(false); if (href.includes("#")) { if (location !== "/") { navigate("/"); window.setTimeout(() => document.getElementById("parents")?.scrollIntoView({ behavior: "smooth" }), 80); } else document.getElementById("parents")?.scrollIntoView({ behavior: "smooth" }); } };
  return <div className="min-h-screen overflow-x-hidden bg-[#fff9e8] text-[#263238]"><header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "px-3 pt-3" : "px-0 pt-0"}`}><div className={`mx-auto flex max-w-[1320px] items-center justify-between border-b border-[#e8ddc6] bg-[#fff9e8]/95 px-5 py-4 backdrop-blur-md transition-all duration-300 sm:px-8 ${scrolled ? "rounded-2xl border px-5 py-3 shadow-[0_12px_35px_rgba(74,66,45,.10)]" : ""}`}><Brand /><nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => handleNav(item.href)} className={`focus-ring rounded-lg text-[.8rem] font-700 transition-colors hover:text-[#ef7e72] ${isActive(item.href) ? "text-[#ef7e72]" : "text-[#53636a]"}`} aria-current={isActive(item.href) ? "page" : undefined}>{item.label}</Link>)}</nav><div className="flex items-center gap-2"><Link href="/contact" className="hidden rounded-full bg-[#263238] px-5 py-3 text-[.8rem] font-800 text-[#fff9e8] shadow-[3px_3px_0_#f58f82] transition-all hover:-translate-y-0.5 hover:bg-[#ef7e72] sm:inline-flex">Book a Trial <ArrowUpRight size={16} className="ml-1" /></Link><button type="button" className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-[#e8ddc6] bg-[#fffdf5] lg:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</button></div></div>{menuOpen && <div className="mx-3 mt-2 rounded-2xl border border-[#e8ddc6] bg-[#fffdf5] p-3 shadow-[0_18px_50px_rgba(74,66,45,.14)] lg:hidden"><nav className="grid gap-1" aria-label="Mobile navigation">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => handleNav(item.href)} className={`focus-ring rounded-xl px-4 py-3.5 text-sm font-800 ${isActive(item.href) ? "bg-[#f9d96b]" : "hover:bg-[#f5efdf]"}`}>{item.label}</Link>)}<Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#263238] px-4 py-3.5 text-sm font-800 text-[#fff9e8]">Book a Trial <ArrowUpRight size={16} className="ml-1" /></Link></nav></div>}</header><main key={location} className="page-transition">{children}</main><Footer /></div>;
}

function Footer() { return <footer className="border-t border-[#e8ddc6] bg-[#f7efd9]"><div className="container grid gap-10 py-14 md:grid-cols-[1.2fr_.8fr_.8fr] lg:py-20"><div><Brand /><p className="mt-5 max-w-xs text-sm leading-7 text-[#6d7b80]">{siteConfig.tagline}</p><div className="mt-6 flex items-center gap-2 text-xs font-800 uppercase tracking-[.14em] text-[#9b8b68]"><span className="h-px w-8 bg-[#f58f82]" /> Stories start with curiosity.</div></div><div><p className="mb-4 text-xs font-800 uppercase tracking-[.15em] text-[#9b8b68]">Explore</p><div className="grid gap-3 text-sm font-700 text-[#53636a]">{navItems.map((item) => <Link key={item.href} href={item.href} className="w-fit transition-colors hover:text-[#ef7e72]">{item.label}</Link>)}</div></div><div><p className="mb-4 text-xs font-800 uppercase tracking-[.15em] text-[#9b8b68]">Stay in the circle</p>{siteConfig.instagramUrl ? <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-800 text-[#53636a] hover:text-[#ef7e72]"><Instagram size={17} /> Instagram</a> : <p className="text-sm leading-6 text-[#6d7b80]">Instagram link will appear here when configured.</p>}{siteConfig.email && <a href={`mailto:${siteConfig.email}`} className="mt-3 block text-sm font-700 text-[#53636a] hover:text-[#ef7e72]">{siteConfig.email}</a>}</div></div><div className="border-t border-[#e8ddc6] px-4 py-5 text-center text-xs text-[#8d8065]">© {new Date().getFullYear()} The Lexicon Circle · Made for curious minds</div></footer>; }
