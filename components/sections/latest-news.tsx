import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const NEWS = [
  {
    title: "1,200th sapling planted at Turahalli Forest restoration site",
    category: "Environment",
    date: "12 Jul 2026",
    image: "/news/plantation-milestone.jpg",
    href: "/news/plantation-milestone",
  },
  {
    title: "Sixteenth free medical camp screens 340 residents in two days",
    category: "Healthcare",
    date: "03 Jul 2026",
    image: "/news/medical-camp-16.jpg",
    href: "/news/medical-camp-16",
  },
  {
    title: "First cohort of 40 women graduates from the tailoring programme",
    category: "Empowerment",
    date: "22 Jun 2026",
    image: "/news/tailoring-graduation.jpg",
    href: "/news/tailoring-graduation",
  },
];

export function LatestNews() {
  return (
    <section className="bg-accent py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="News & Events" title="From the field this month" align="left" className="mx-0" />
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            All updates <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <Reveal stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {NEWS.map((n) => (
            <Link key={n.title} href={n.href} className="card-lift group flex flex-col overflow-hidden rounded-3xl bg-canvas shadow-soft">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={n.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {n.category}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
                  {n.title}
                </h3>
                <div className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-ink-soft">
                  <Calendar className="h-3.5 w-3.5" /> {n.date}
                </div>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
