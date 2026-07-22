import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";

const PROJECTS = [
  {
    title: "School Kits for 500 Children",
    category: "Education",
    image: "/projects/school-kits.jpg",
    raised: 340000,
    goal: 500000,
    href: "/projects/school-kits",
  },
  {
    title: "Free Medical Camp, Rajajinagar",
    category: "Healthcare",
    image: "/projects/medical-camp.jpg",
    raised: 210000,
    goal: 300000,
    href: "/projects/medical-camp",
  },
  {
    title: "Tree Plantation Drive — Phase III",
    category: "Environment",
    image: "/projects/tree-plantation.jpg",
    raised: 95000,
    goal: 150000,
    href: "/projects/tree-plantation",
  },
  {
    title: "Weekly Food Distribution",
    category: "Nutrition",
    image: "/projects/food-distribution.jpg",
    raised: 128000,
    goal: 200000,
    href: "/projects/food-distribution",
  },
];

export function FeaturedProjects() {
  return (
    <section className="bg-accent py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured Projects"
            title="Where your rupee goes to work"
            align="left"
            className="mx-0"
          />
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <Link href="/projects">
              View all projects <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Reveal stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROJECTS.map((p) => {
            const pct = Math.min(100, Math.round((p.raised / p.goal) * 100));
            return (
              <Link
                key={p.title}
                href={p.href}
                className="card-lift group flex flex-col overflow-hidden rounded-3xl bg-canvas shadow-soft"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-canvas/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[1.05rem] font-semibold leading-snug text-ink">
                    {p.title}
                  </h3>

                  <div className="mt-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
                      <span className="font-semibold text-primary">{formatINR(p.raised)} raised</span>
                      <span>of {formatINR(p.goal)}</span>
                    </div>
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
