import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ActionLink } from "@/components/site/Action";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { focusAreas, homePrinciples, upcomingWork } from "@/data/site";
import { lovableAssets } from "@/lib/lovable-assets";

const hero = lovableAssets.hero;
const community = lovableAssets.community;
const ev = lovableAssets.ev;
const kids = lovableAssets.kids;
const sustain = lovableAssets.sustain;
const volunteersImg = lovableAssets.volunteers;
const nutrition = lovableAssets.nutrition;

const upcomingMedia = [
  {
    src: ev.url,
    alt: "Solar-powered electric vehicle charging points beside a road",
  },
  {
    src: kids.url,
    alt: "Smiling schoolchildren sharing a nutritious midday meal",
  },
  {
    src: sustain.url,
    alt: "Community gathering learning about solar lamps and energy efficiency",
  },
  {
    src: volunteersImg.url,
    alt: "Volunteers joining hands together in a circle",
  },
];

export default function Home() {
  return (
    <>
      {/* =====================================================
          HERO
          Full viewport — no ivory/white strip at bottom
      ====================================================== */}

      <section className="relative isolate min-h-[100svh] overflow-hidden bg-forest-deep">

        {/* ===================================================
            HERO BACKGROUND IMAGE

            Covers the complete viewport.
        ==================================================== */}

        <img
          src={hero.url}
          alt="A teacher supporting schoolchildren reading in a village classroom"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* ===================================================
            HERO OVERLAY
        ==================================================== */}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--forest-deep)_92%,transparent)_0%,color-mix(in_oklab,var(--forest-deep)_72%,transparent)_45%,color-mix(in_oklab,var(--forest-deep)_28%,transparent)_100%)]"
        />

        {/* ===================================================
            HERO CONTENT

            Also uses 100svh so the content container
            fills the viewport with the background.
        ==================================================== */}

        <div className="relative mx-auto flex min-h-[100svh] max-w-[80rem] flex-col justify-end px-5 pt-36 pb-16 lg:px-10 lg:pb-24">
          <Reveal>

            {/* =================================================
                HERO HEADING

                Reduced empty space above heading.
                Added controlled spacing between lines.
            ================================================== */}

            <h1 className="display-xl mt-2 max-w-4xl text-ivory leading-[1.05]">
              Service is our duty
              <span className="mt-7 block text-gold-soft">
                Society is our family.
              </span>
            </h1>

            {/* =================================================
                HERO DESCRIPTION
            ================================================== */}

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/80">
              Rajavasantha Welfare Trust works towards inclusive social
              development through education, healthcare, community welfare,
              environmental sustainability, empowerment and humanitarian
              action.
            </p>

            {/* =================================================
                HERO ACTIONS
            ================================================== */}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ActionLink to="/support" variant="gold">
                Support the Trust
              </ActionLink>

              <ActionLink
                to="/focus-areas"
                variant="outlineLight"
              >
                Explore our focus areas
              </ActionLink>
            </div>

          </Reveal>
        </div>
      </section>

      {/* =====================================================
          MISSION INTRODUCTION
      ====================================================== */}

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">

            <Reveal>
              <p className="eyebrow">
                Who we are
              </p>

              <h2 className="display-lg mt-6 text-forest-deep">
                Working for people. Working for a better future.
              </h2>
            </Reveal>

            <Reveal
              delay={80}
              className="space-y-6 text-[1.05rem] leading-relaxed text-muted-foreground"
            >
              <p>
                Rajavasantha Welfare Trust has been established as a
                charitable trust for public, educational, cultural, welfare
                and charitable purposes. Its founding trustees came together
                in Bengaluru in 2026 to create an institution capable of
                serving communities over the long term.
              </p>

              <p>
                The Trust Deed sets out objectives that span education and
                skill development, healthcare, nutrition, women and child
                development, community and rural development, renewable
                energy, environmental sustainability, sports and youth
                development, elderly care, animal welfare and disaster
                relief.
              </p>

              <p className="text-forest-soft">
                The Trust is at the beginning of its journey. What follows
                describes what it is established to do — the objectives
                entrusted to it by its deed.
              </p>

              <Link
                href="/about"
                className="link-underline font-medium text-forest-deep"
              >
                Learn about the Trust
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
            </Reveal>

          </div>
        </div>
      </section>

      {/* =====================================================
          FOCUS AREAS
      ====================================================== */}

      <section className="border-y border-forest-deep/10 bg-card">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="eyebrow">
                Our focus areas
              </p>

              <h2 className="display-lg mt-6 max-w-2xl text-forest-deep">
                Twelve areas of work, drawn from the Trust Deed.
              </h2>
            </div>

            <Link
              href="/focus-areas"
              className="link-underline font-medium text-forest-deep"
            >
              View all focus areas
              <ArrowRight className="h-4 w-4 text-gold" />
            </Link>

          </Reveal>

          <div className="mt-14 grid gap-px border border-forest-deep/10 bg-forest-deep/10 sm:grid-cols-2 lg:grid-cols-3">

            {focusAreas.map((area, i) => (
              <Reveal
                key={area.slug}
                delay={(i % 3) * 70}
              >
                <Link
                  href={`/focus-areas#${area.slug}`}
                  className="group flex h-full flex-col bg-card p-8 transition-colors duration-300 hover:bg-ivory"
                >
                  <area.icon
                    className="h-7 w-7 text-gold transition-transform duration-300 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />

                  <h3 className="mt-6 font-display text-xl text-forest-deep">
                    {area.title}
                  </h3>

                  <p className="mt-3 grow text-sm leading-relaxed text-muted-foreground">
                    {area.summary}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-forest-soft uppercase">
                    Explore

                    <ArrowUpRight className="h-4 w-4 text-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          EDITORIAL IMAGE BAND
      ====================================================== */}

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

            <Reveal>
              <img
                src={community.url}
                alt="Women meeting in a village self-help group discussion"
                width={1600}
                height={1104}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </Reveal>

            <Reveal delay={90}>

              <p className="eyebrow">
                Change begins when we choose to participate
              </p>

              <h2 className="display-lg mt-6 text-forest-deep">
                Three ways to stand behind the work.
              </h2>

              <dl className="mt-10 divide-y divide-forest-deep/10 border-y border-forest-deep/10">

                {[
                  {
                    t: "Support",
                    d: "Help strengthen the Trust's charitable initiatives as they are established.",
                  },
                  {
                    t: "Volunteer",
                    d: "Offer time, skills and energy to initiatives as they take shape.",
                  },
                  {
                    t: "Partner",
                    d: "Connect with us to explore future institutional and community collaborations.",
                  },
                ].map((item) => (
                  <div
                    key={item.t}
                    className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr]"
                  >
                    <dt className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase">
                      {item.t}
                    </dt>

                    <dd className="text-[0.95rem] leading-relaxed text-muted-foreground">
                      {item.d}
                    </dd>
                  </div>
                ))}

              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">

                <ActionLink
                  to="/support"
                  variant="forest"
                >
                  Support the Trust
                </ActionLink>

                <ActionLink
                  to="/volunteer"
                  variant="outline"
                >
                  Become a volunteer
                </ActionLink>

              </div>

            </Reveal>

          </div>
        </div>
      </section>

      {/* =====================================================
          UPCOMING WORK
      ====================================================== */}

      <section className="bg-forest-deep text-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          <Reveal>

            <p className="eyebrow">
              Our upcoming work
            </p>

            <h2 className="display-lg mt-6 max-w-3xl text-ivory">
              Where the Trust intends to begin.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/75">
              These are intended directions of work under the Trust&apos;s
              objectives. They are not yet operational programmes.
            </p>

          </Reveal>

          <div className="mt-14 grid gap-px bg-ivory/15 sm:grid-cols-2">

            {upcomingWork.map((item, i) => {
              const media = upcomingMedia[i];

              return (
                <Reveal
                  key={item.title}
                  delay={(i % 2) * 80}
                >
                  <div className="flex h-full flex-col bg-forest-deep">

                    {media && (
                      <img
                        src={media.src}
                        alt={media.alt}
                        width={1200}
                        height={800}
                        loading="lazy"
                        className="h-56 w-full object-cover lg:h-64"
                      />
                    )}

                    <div className="flex-1 p-8 lg:p-10">

                      <span className="font-display text-3xl text-gold/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3 className="mt-4 font-display text-2xl text-ivory">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-[0.95rem] leading-relaxed text-ivory/70">
                        {item.body}
                      </p>

                    </div>
                  </div>
                </Reveal>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================================
          PRINCIPLES
      ====================================================== */}

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">

          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="eyebrow">
                Guided by purpose
              </p>

              <h2 className="display-lg mt-6 max-w-2xl text-forest-deep">
                The commitments written into our deed.
              </h2>

            </div>

            <Link
              href="/principles"
              className="link-underline font-medium text-forest-deep"
            >
              Explore our principles
              <ArrowRight className="h-4 w-4 text-gold" />
            </Link>

          </Reveal>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

            {homePrinciples.map((p, i) => (
              <Reveal
                key={p.title}
                delay={(i % 3) * 70}
              >
                <div className="border-t border-forest-deep/15 pt-6">

                  <h3 className="font-display text-xl tracking-wide text-forest-deep uppercase">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>

                </div>
              </Reveal>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          SUPPORT CTA BAND
      ====================================================== */}

      <section className="relative isolate overflow-hidden bg-forest">

        <img
          src={nutrition.url}
          alt="Volunteers serving nutritious meals to children"
          width={1600}
          height={1100}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />

        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">

          <Reveal>

            <h2 className="display-lg text-ivory">
              Help build the capacity to serve.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ivory/80">
              Your support can help Rajavasantha Welfare Trust pursue its
              charitable and welfare objectives across communities.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

              <ActionLink
                to="/support"
                variant="gold"
              >
                Support the Trust
              </ActionLink>

              <ActionLink
                to="/contact"
                variant="outlineLight"
              >
                Contact the Trust
              </ActionLink>

            </div>

          </Reveal>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <CTASection />
    </>
  );
}