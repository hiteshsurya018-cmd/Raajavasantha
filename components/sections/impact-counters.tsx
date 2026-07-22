import { Users, ClipboardCheck, HeartHandshake, GraduationCap, TreePine, Stethoscope } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const STATS = [
  { icon: Users, value: 2500, suffix: "+", label: "People benefitted" },
  { icon: ClipboardCheck, value: 120, suffix: "+", label: "Projects completed" },
  { icon: HeartHandshake, value: 850, suffix: "+", label: "Volunteers engaged" },
  { icon: GraduationCap, value: 800, suffix: "+", label: "Students supported" },
  { icon: TreePine, value: 1200, suffix: "+", label: "Trees planted" },
  { icon: Stethoscope, value: 15, suffix: "+", label: "Medical camps" },
];

export function ImpactCounters() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 text-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
      />
      <div className="container relative">
        <SectionHeading
          eyebrow="Our Impact So Far"
          title="Numbers we measure ourselves against, not each other"
          light
        />
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="flex flex-col items-center text-center">
                <s.icon className="h-7 w-7 text-secondary" strokeWidth={1.5} />
                <p className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-canvas/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
