import { ArrowRight, BookOpen, Feather, Heart, Lightbulb, Quote, UserRound } from "lucide-react";
import { Link } from "wouter";
import { SectionHeading } from "../components/ContentBlocks";
import { siteConfig } from "../data/siteData";

export default function About() {
  return (
    <div className="pt-32 sm:pt-40">
      <section className="border-b border-[#e8ddc6] px-4 pb-16 sm:px-6">
        <div className="founder-section flex flex-col md:flex-row items-center gap-6 my-12">
          <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-2 border-primary">
            <img 
              src="/images/founder.jpg" 
              alt="Founder" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="founder-info max-w-lg">
            <h3 className="text-2xl font-bold">Zeb Rahman</h3>
            <p className="text-muted-foreground text-sm mb-2">Founder & Director</p>
            <p className="text-base">
              Zeb Rahman is the Founder & Director of The Lexicon Circle, dedicated to
  nurturing young readers and helping children discover the joy of reading,
  vocabulary, grammar, and creative writing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}