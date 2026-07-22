import {
  BookOpen, Stethoscope, Users, Leaf, PawPrint, Home,
  Trophy, LifeBuoy, Soup,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { RootLine } from "@/components/ui/root-line";

const AREAS = [
  { icon: BookOpen, name: "Education", desc: "Quality schooling for a brighter future" },
  { icon: Stethoscope, name: "Healthcare", desc: "Accessible medical care for all" },
  { icon: Users, name: "Women Empowerment", desc: "Skills, credit and dignity" },
  { icon: Leaf, name: "Environment", desc: "Protecting nature, securing tomorrow" },
  { icon: PawPrint, name: "Animal Welfare", desc: "Care, protection and shelter" },
  { icon: Home, name: "Rural Development", desc: "Stronger villages, stronger nation" },
  { icon: Trophy, name: "Youth & Sports", desc: "Nurturing tomorrow's champions" },
  { icon: LifeBuoy, name: "Disaster Relief", desc: "Responding today, rebuilding tomorrow" },
  { icon: Soup, name: "Nutrition Support", desc: "No one should sleep hungry" },
];

export function FocusAreas() {
  return (
    <section className="relative bg-canvas py-24">
      <div className="container">
        <SectionHeading
          eyebrow="Our Focus Areas"
          title="Nine roots, one tree"
          description="Every programme we run branches from the same trunk: the belief that dignity is not conditional."
        />
        <div className="relative mt-16 flex gap-8">
          <RootLine className="shrink-0" />
          <Reveal stagger className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((a) => (
              <div
                key={a.name}
                className="card-lift group rounded-3xl border border-line bg-accent p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-primary shadow-soft transition-colors group-hover:bg-primary group-hover:text-secondary">
                  <a.icon className="h-5.5 w-5.5" strokeWidth={1.6} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{a.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{a.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
