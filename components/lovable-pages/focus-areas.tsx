import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { focusAreas } from "@/data/site";

export default function FocusAreas() {
  return (
    <>
      <PageHero
        eyebrow="Our Focus"
        title="Twelve focus areas, drawn from the Trust Deed."
        intro="Each area below reflects objectives set out in the Trust Deed. They describe what the Trust is established to undertake as its initiatives develop."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-20">
          <nav aria-label="Focus areas" className="flex flex-wrap gap-2">
            {focusAreas.map((a) => (
              <a
                key={a.slug}
                href={`#${a.slug}`}
                className="border border-forest-deep/15 px-4 py-2 text-xs tracking-[0.08em] text-forest-soft uppercase transition-colors hover:border-gold hover:text-forest-deep"
              >
                {a.title}
              </a>
            ))}
          </nav>

          <div className="mt-16 space-y-px bg-forest-deep/10">
            {focusAreas.map((area, i) => (
              <Reveal key={area.slug}>
                <article
                  id={area.slug}
                  className="scroll-mt-28 bg-card p-8 lg:p-14"
                >
                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div>
                      <div className="flex items-center gap-4">
                        <area.icon className="h-8 w-8 text-gold" aria-hidden="true" />
                        <span className="font-display text-2xl text-forest-deep/30">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h2 className="display-md mt-6 text-forest-deep">{area.title}</h2>
                      <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
                        {area.summary}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Objectives in the deed include</p>
                      <ul className="mt-6 space-y-3">
                        {area.points.map((p) => (
                          <li
                            key={p}
                            className="flex gap-3 border-b border-forest-deep/8 pb-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection heading="Support the areas that matter to you." />
    </>
  );
}
