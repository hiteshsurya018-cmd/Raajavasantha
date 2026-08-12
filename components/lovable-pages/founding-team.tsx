import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { leadership, trustees } from "@/data/site";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FoundingTeam() {
  return (
    <>
      <PageHero
        eyebrow="Founding Team"
        title="Founding Team"
        intro="The trustees entrusted with guiding Rajavasantha Welfare Trust."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          {/* =========================
              OFFICE BEARERS
          ========================== */}
          <Reveal>
            <p className="eyebrow">Office bearers</p>
          </Reveal>

          <div className="mt-10 grid gap-px bg-forest-deep/10 md:grid-cols-3">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={i * 80}>
                <article className="flex h-full flex-col items-start bg-card p-10 lg:p-12">
                  {/* Avatar */}
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-forest-deep font-display text-3xl text-gold"
                  >
                    {initials(person.name)}
                  </span>

                  <h2 className="mt-8 font-display text-3xl text-forest-deep">
                    {person.name}
                  </h2>

                  <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">
                    {person.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* =========================
              BOARD OF TRUSTEES
          ========================== */}
          <Reveal className="mt-20">
            <p className="eyebrow">Board of Trustees</p>
          </Reveal>

          {/* First row — 2 trustees */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {trustees.slice(0, 2).map((person, i) => (
              <Reveal key={person.name} delay={i * 70}>
                <article className="flex h-full flex-col items-start border border-forest-deep/12 bg-card p-10 lg:p-12">
                  {/* Large avatar — same style as Office Bearers */}
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-forest-deep font-display text-3xl text-gold"
                  >
                    {initials(person.name)}
                  </span>

                  <h2 className="mt-8 font-display text-3xl text-forest-deep">
                    {person.name}
                  </h2>

                  <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-forest-soft">
                    {person.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Second row — 3 trustees */}
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {trustees.slice(2, 5).map((person, i) => (
              <Reveal key={person.name} delay={i * 70}>
                <article className="flex h-full flex-col items-start border border-forest-deep/12 bg-card p-10 lg:p-12">
                  {/* Large avatar — same style as Office Bearers */}
                  <span
                    aria-hidden="true"
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-forest-deep font-display text-3xl text-gold"
                  >
                    {initials(person.name)}
                  </span>

                  <h2 className="mt-8 font-display text-3xl text-forest-deep">
                    {person.name}
                  </h2>

                  <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-forest-soft">
                    {person.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* =========================
              FOOTER INFORMATION
          ========================== */}
          <Reveal className="mt-16 max-w-2xl">
            <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
              Leadership profiles will be expanded as the Trust&apos;s public
              communications develop. Personal contact details of trustees are
              not published on this website.
            </p>

            <Link
              href="/contact"
              className="link-underline mt-6 font-medium text-forest-deep"
            >
              Contact the Trust
              <ArrowRight className="h-4 w-4 text-gold" />
            </Link>
          </Reveal>

        </div>
      </section>
    </>
  );
}