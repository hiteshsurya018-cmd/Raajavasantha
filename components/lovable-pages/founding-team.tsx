import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { leadership, trustees } from "@/data/site";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/* =========================================================
   SHARED PREMIUM PORTRAIT
   Used identically for Office Bearers + Trustees
   ========================================================= */

function PremiumPortrait({
  src,
  name,
}: {
  src: string;
  name: string;
}) {
  return (
    <div className="relative h-[158px] w-full shrink-0">
      {/* Top ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-gold/6 blur-3xl"
      />

      {/* Bottom ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-forest-deep/4 blur-3xl"
      />

      {/* Top gold line */}
      <div
        aria-hidden="true"
        className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
      />

      {/* Centre glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
      />

      {/* Left decorative line */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-[78px] h-px w-[28%] bg-gradient-to-r from-transparent via-gold/40 to-gold/15"
      />

      {/* Right decorative line */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-[78px] h-px w-[28%] bg-gradient-to-l from-transparent via-gold/40 to-gold/15"
      />

      {/* Portrait */}
      <div className="absolute left-1/2 top-3 z-10 h-[150px] w-[120px] -translate-x-1/2 overflow-hidden rounded-[1rem] border border-gold/35 bg-forest-deep/5 shadow-[0_14px_35px_rgba(0,45,32,0.16)]">
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/20 via-transparent to-white/10"
        />

        {/* Inner frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-[0.7rem] border border-white/20"
        />
      </div>
    </div>
  );
}

/* =========================================================
   TRUSTEE CARD
   Original card dimensions/layout preserved.
   When an image exists, the portrait block reaches the
   top edge of the existing card.
   ========================================================= */

function TrusteeCard({
  person,
  delay,
  className = "",
}: {
  person: (typeof trustees)[number];
  delay: number;
  className?: string;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <article className="flex aspect-square h-full flex-col items-start border border-forest-deep/12 bg-card p-2.5 md:aspect-auto md:min-h-[290px] md:p-10 lg:p-12">
        {person.image ? (
          <>
            {/* Mobile — image reaches the top of the card */}
            <div className="-mx-2 -mt-2 w-[calc(100%+1rem)] md:hidden">
              <PremiumPortrait
                src={person.image}
                name={person.name}
              />
            </div>

            {/* Desktop — cancel the original card padding */}
            <div className="-mx-10 -mt-10 w-[calc(100%+5rem)] lg:-mx-12 lg:-mt-12 lg:w-[calc(100%+6rem)]">
              <PremiumPortrait
                src={person.image}
                name={person.name}
              />
            </div>
          </>
        ) : (
          <>
            {/* Original mobile placeholder */}
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-forest-deep/10 md:hidden">
              <span
                aria-hidden="true"
                className="font-display text-4xl text-forest-deep/30"
              >
                {initials(person.name)}
              </span>
            </div>

            {/* Original desktop avatar */}
            <span
              aria-hidden="true"
              className="hidden h-14 w-14 items-center justify-center rounded-full bg-forest-deep font-display text-xl text-gold md:flex md:h-24 md:w-24 md:text-3xl"
            >
              {initials(person.name)}
            </span>
          </>
        )}

        <h2
          className={`break-words font-display text-lg leading-5 text-forest-deep md:break-normal md:text-3xl md:leading-9 ${
            person.image
              ? "mt-2 md:mt-2"
              : "mt-auto md:mt-8"
          }`}
        >
          {person.name}
        </h2>

        <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-forest-soft md:mt-2 md:text-[0.72rem] md:tracking-[0.2em]">
          {person.role}
        </p>
      </article>
    </Reveal>
  );
}

export default function FoundingTeamPage() {
  return (
    <>
      <PageHero
        eyebrow="The people behind the work"
        title="Founding team"
        description="The people who help guide Rajavasantha Welfare Trust with purpose, responsibility and a commitment to meaningful community work."
      />

      <main className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12">
        {/* =====================================================
            OFFICE BEARERS
            ===================================================== */}

        <section className="pt-20">
          <Reveal>
            <p className="eyebrow">Office bearers</p>
          </Reveal>

          <div className="mt-10 grid gap-px bg-forest-deep/10 md:grid-cols-3">
            {leadership.map((person, i) => (
              <Reveal key={person.name} delay={i * 80}>
                <article
                  className={`relative flex h-full flex-col bg-card ${
                    person.image
                      ? "overflow-hidden"
                      : "items-start p-10 lg:p-12"
                  }`}
                >
                  {person.image ? (
                    <>
                      <PremiumPortrait
                        src={person.image}
                        name={person.name}
                      />

                      <div className="relative w-full px-10 pb-10 pt-7 lg:px-12 lg:pb-12">
                        <h2 className="font-display text-3xl text-forest-deep">
                          {person.name}
                        </h2>

                        <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">
                          {person.role}
                        </p>

                        <div
                          aria-hidden="true"
                          className="mt-5 h-px w-10 bg-gradient-to-r from-gold/60 to-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        aria-hidden="true"
                        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-forest-deep font-display text-3xl text-gold"
                      >
                        {initials(person.name)}
                      </span>

                      <h2 className="mt-8 font-display text-3xl text-forest-deep">
                        {person.name}
                      </h2>

                      <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold">
                        {person.role}
                      </p>
                    </>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =====================================================
            BOARD OF TRUSTEES
            ===================================================== */}

        <section className="pt-20">
          <Reveal>
            <p className="eyebrow">Board of Trustees</p>
          </Reveal>

          {/* First two trustees */}
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-6">
            {trustees.slice(0, 2).map((person, i) => (
              <TrusteeCard
                key={person.name}
                person={person}
                delay={i * 70}
                className={
                  i === 0
                    ? "md:col-span-2 md:col-start-2"
                    : "md:col-span-2"
                }
              />
            ))}
          </div>

          {/* Remaining three trustees */}
          <div className="mt-3 grid grid-cols-4 gap-3 md:mt-6 md:grid-cols-3 md:gap-6">
            {trustees.slice(2, 5).map((person, i) => (
              <TrusteeCard
                key={person.name}
                person={person}
                delay={i * 70}
                className={`col-span-2 md:col-span-1 ${
                  i === 2 ? "col-start-2 md:col-start-auto" : ""
                }`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}