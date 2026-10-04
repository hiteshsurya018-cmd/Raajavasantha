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

type Person = {
  name: string;
  role: string;
  image?: string;
};

function PremiumPersonCard({
  person,
  delay = 0,
}: {
  person: Person;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="group relative overflow-hidden border border-forest-deep/10 bg-white">

        {/* Premium background glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(194,164,94,0.16),transparent_48%),linear-gradient(145deg,rgba(241,235,218,0.5),rgba(255,255,255,0.95)_55%,rgba(226,234,222,0.4))]"
        />

        {/* Decorative gold strokes */}
        <span
          aria-hidden="true"
          className="absolute left-[-22px] top-7 h-3 w-36 rotate-[-3deg] rounded-full bg-gold/75"
        />
        <span
          aria-hidden="true"
          className="absolute right-[-28px] top-7 h-3 w-40 rotate-[2deg] rounded-full bg-gold/65"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-16 left-[-25px] h-3 w-40 rotate-[4deg] rounded-full bg-gold/55"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-16 right-[-30px] h-3 w-40 rotate-[-5deg] rounded-full bg-gold/55"
        />

        <div className="relative z-10 flex min-h-[420px] flex-col items-center px-6 pb-12 pt-10 text-center sm:px-10">

          {/* Portrait */}
          <div className="relative">

            {/* Glow behind portrait */}
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2rem] bg-gold/15 blur-2xl transition-all duration-500 group-hover:bg-gold/25"
            />

            <div className="relative h-52 w-44 overflow-hidden rounded-[1.25rem] border border-gold/30 bg-forest-deep/10 shadow-[0_20px_50px_rgba(20,55,42,0.12)] sm:h-60 sm:w-48">

              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-forest-deep via-forest-soft to-gold">
                  <span className="font-display text-5xl text-gold/80">
                    {initials(person.name)}
                  </span>
                </div>
              )}

              {/* Image overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-deep/30 via-transparent to-white/10"
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="relative mt-9 font-display text-3xl leading-tight text-forest-deep sm:text-4xl">
            {person.name}
          </h2>

          {/* Role */}
          <p className="relative mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">
            {person.role}
          </p>

          {/* Small decorative divider */}
          <div className="relative mt-6 flex items-center gap-2">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function FoundingTeam() {
  return (
    <>
      <PageHero
        eyebrow="Founding Team"
        title="Founding Team"
        intro="The people entrusted with shaping the vision and guiding Rajavasantha Welfare Trust."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          {/* =====================================================
              OFFICE BEARERS
          ====================================================== */}
          <Reveal>
            <p className="eyebrow">Office bearers</p>
          </Reveal>

          <div className="mt-10 grid gap-px bg-forest-deep/10 md:grid-cols-3">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={i * 80}>
                <article className="flex h-full flex-col items-start bg-card p-10 lg:p-12">
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

          {/* =====================================================
              BOARD OF TRUSTEES
          ====================================================== */}
          <Reveal className="mt-20">
            <p className="eyebrow">Board of Trustees</p>
          </Reveal>

          {/* First row */}
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-6">
            {trustees.slice(0, 2).map((person, i) => (
              <Reveal
                key={person.name}
                delay={i * 70}
                className={
                  i === 0
                    ? "md:col-span-2 md:col-start-2"
                    : "md:col-span-2"
                }
              >
                <article className="flex aspect-square h-full flex-col items-start border border-forest-deep/12 bg-card p-2.5 md:aspect-auto md:min-h-[290px] md:p-10 lg:p-12">

                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-forest-deep/10 md:hidden">
                    <span className="font-display text-4xl text-forest-deep/30">
                      {initials(person.name)}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden h-14 w-14 items-center justify-center rounded-full bg-forest-deep font-display text-xl text-gold md:flex md:h-24 md:w-24 md:text-3xl"
                  >
                    {initials(person.name)}
                  </span>

                  <h2 className="mt-auto break-words font-display text-lg leading-5 text-forest-deep md:mt-8 md:break-normal md:text-3xl md:leading-9">
                    {person.name}
                  </h2>

                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-forest-soft md:mt-2 md:text-[0.72rem] md:tracking-[0.2em]">
                    {person.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Second row */}
          <div className="mt-3 grid grid-cols-4 gap-3 md:mt-6 md:grid-cols-3 md:gap-6">
            {trustees.slice(2, 5).map((person, i) => (
              <Reveal
                key={person.name}
                delay={i * 70}
                className={`col-span-2 md:col-span-1 ${
                  i === 2 ? "col-start-2 md:col-start-auto" : ""
                }`}
              >
                <article className="flex aspect-square h-full flex-col items-start border border-forest-deep/12 bg-card p-2.5 md:aspect-auto md:min-h-[290px] md:p-10 lg:p-12">

                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-forest-deep/10 md:hidden">
                    <span className="font-display text-4xl text-forest-deep/30">
                      {initials(person.name)}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden h-14 w-14 items-center justify-center rounded-full bg-forest-deep font-display text-xl text-gold md:flex md:h-24 md:w-24 md:text-3xl"
                  >
                    {initials(person.name)}
                  </span>

                  <h2 className="mt-auto break-words font-display text-lg leading-5 text-forest-deep md:mt-8 md:break-normal md:text-3xl md:leading-9">
                    {person.name}
                  </h2>

                  <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-forest-soft md:mt-2 md:text-[0.72rem] md:tracking-[0.2em]">
                    {person.role}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* =====================================================
              FOUNDING MEMBERS — PREMIUM PHOTO SECTION
          ====================================================== */}

          <div className="mt-28">

            <Reveal>
              <div className="max-w-2xl">
                <p className="eyebrow">Founding members</p>

                <h2 className="mt-5 font-display text-4xl leading-tight text-forest-deep sm:text-5xl">
                  The people behind the beginning.
                </h2>

                <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                  The founding members whose vision and commitment helped shape
                  the Trust and its work in the community.
                </p>
              </div>
            </Reveal>

            {/* Premium cards */}
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {trustees.slice(0, 3).map((person, i) => (
                <PremiumPersonCard
                  key={person.name}
                  person={person as Person}
                  delay={i * 90}
                />
              ))}
            </div>

          </div>

          {/* =====================================================
              FOOTER INFORMATION
          ====================================================== */}
          <Reveal className="mt-20 max-w-2xl">
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