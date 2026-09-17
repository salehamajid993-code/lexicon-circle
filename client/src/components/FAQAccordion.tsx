import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../data/siteData";

export default function FAQAccordion({ items = faqs }: { items?: readonly { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="divide-y divide-[#e8ddc6] overflow-hidden rounded-2xl border border-[#e8ddc6] bg-[#fffdf5]">{items.map((item, index) => { const expanded = open === index; return <div key={item.question}><h3><button type="button" className="focus-ring flex w-full items-center justify-between gap-6 px-5 py-5 text-left font-[Fraunces] text-lg font-600 sm:px-7" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : index)}><span>{item.question}</span><ChevronDown className={`shrink-0 text-[#ef7e72] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} size={20} /></button></h3>{expanded && <div className="px-5 pb-6 text-sm leading-7 text-[#6d7b80] sm:px-7">{item.answer}</div>}</div>; })}</div>;
}
