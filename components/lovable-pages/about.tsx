import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { lovableAssets } from "@/lib/lovable-assets";

const community = lovableAssets.community;

const sections = [
  {
    label: "Who we are",
    heading: "A trust established to serve the public good.",
    body: [
      "Rajavasantha Welfare Trust is a charitable trust based in Rajajinagar, Bengaluru. Its Trust Deed records that the founders desired to set apart and establish a fund for public, educational, welfare and charitable objects and purposes.",
      "The trustees hold the Trust's property for the purposes detailed in the deed, and are responsible for controlling, administering and managing the affairs of the Trust.",
    ],
  },
  {
    label: "Our purpose",
    heading: "Total development of the human person.",
    body: [
      "The deed's first objective speaks of engaging in social, cultural, educational and moral activities that contribute to the total development of the human personality — for the benefit of all people, without distinction of caste, creed, community, religion or sex.",
      "That intent runs through every later section of the deed, from schools and health camps to renewable energy and disaster relief.",
    ],
  },
  {
    label: "Our approach",
    heading: "A mandate that connects many parts of community life.",
    body: [
      "The deed encompasses education, healthcare, social welfare, community development, environmental sustainability, rural development, women and child development, and humanitarian assistance.",
      "Rather than treating these as separate concerns, the Trust intends to approach them as connected — a child's learning depends on nutrition and health; a family's livelihood depends on water, energy and skills.",
    ],
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About the Trust"
        title="About Rajavasantha Welfare Trust"
        intro="A newly established charitable trust in Bengaluru, created for public, educational, cultural, welfare and charitable purposes."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] space-y-20 px-5 py-20 lg:px-10 lg:py-28">
          {sections.map((s, i) => (
            <Reveal key={s.label} className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="eyebrow">{s.label}</p>
                <h2 className="display-md mt-5 text-forest-deep">{s.heading}</h2>
              </div>
              <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted-foreground">
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {i === 2 && (
                  <Link
                    href="/focus-areas"
                    className="link-underline font-medium text-forest-deep"
                  >
                    See the twelve focus areas <ArrowRight className="h-4 w-4 text-gold" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-forest-deep/10 bg-card">
        <div className="mx-auto grid max-w-[80rem] items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <Reveal>
            <p className="eyebrow">A broad vision for social development</p>
            <h2 className="display-md mt-5 text-forest-deep">
              Breadth of objectives, measured in intent — not yet in claims.
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
              The deed provides for schools, colleges and vocational institutes; digital
              literacy, AI, robotics and STEM education; primary healthcare and health camps;
              nutrition support for children in Anganwadis and government schools; community
              halls and libraries; organic farming and watershed management; solar and wind
              energy; waste management and recycling; sports academies; elderly care;
              veterinary and animal welfare; and disaster relief and rehabilitation.
            </p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-forest-soft">
              The Trust presents these as objectives it is established to pursue, not as work
              already completed.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <img
              src={community.url}
              alt="Community members gathered for a village meeting"
              width={1600}
              height={1104}
              loading="lazy"
              className="w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow">Our journey</p>
              <h2 className="display-md mt-5 text-forest-deep">Established in 2026.</h2>
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-gold pl-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase">
                  17 June 2026
                </p>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-muted-foreground">
                  A voluntary meeting of the proposed trustees was held in Bengaluru, at which
                  it was unanimously decided to register the Trust, with the members present
                  constituting the board of trustees.
                </p>
              </div>
              <div className="border-l-2 border-forest-deep/20 pl-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-forest-soft uppercase">
                  The road ahead
                </p>
                <p className="mt-2 text-[1.05rem] leading-relaxed text-muted-foreground">
                  The Trust is at the beginning of its journey of building programmes,
                  partnerships and community initiatives. As initiatives are established, this
                  page will record them honestly.
                </p>
              </div>
              <Link
                href="/founding-team"
                className="link-underline font-medium text-forest-deep"
              >
                Meet our Founding Team <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest-deep text-ivory">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28">
          <Reveal>
            <p className="eyebrow justify-center">Our commitment</p>
            <h2 className="display-md mt-6 text-ivory">
              Service offered without discrimination.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory/75">
              The deed states that the benefits of the Trust&apos;s charitable and benevolent
              services shall be available to all people irrespective of nationality, caste,
              creed, colour, community, religion or sex. That commitment shapes how the Trust
              intends to work.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
