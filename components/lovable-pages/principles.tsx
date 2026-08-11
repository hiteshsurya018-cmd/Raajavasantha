import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
import { principles } from "@/data/site";

export default function Principles() {
  return (
    <>
      <PageHero
        eyebrow="Guided by purpose"
        title="Principles that shape how the Trust intends to work."
        intro="Each principle below is grounded in the provisions of the Trust Deed."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-px bg-forest-deep/10 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 70}>
                <article className="group h-full bg-card p-8 transition-colors duration-300 hover:bg-forest-deep lg:p-12">
                  <span className="font-display text-3xl text-gold/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-4 font-display text-2xl tracking-wide text-forest-deep uppercase transition-colors group-hover:text-ivory">
                    {p.title}
                  </h2>
                  <div className="rule-gold mt-5" />
                  <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground transition-colors group-hover:text-ivory/75">
                    {p.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection heading="Principles become practice through people." />
    </>
  );
}
