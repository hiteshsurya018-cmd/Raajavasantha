import { Heart, Scale, Sparkles, Target } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  ["Dignity first", "Every programme starts with listening and treats people as partners, never recipients.", Heart],
  ["Accountable action", "We measure outcomes, share our work openly and steward every contribution responsibly.", Scale],
  ["Local leadership", "Lasting change is led by communities who understand their own futures best.", Sparkles],
];

export const metadata = { title: "About us", description: "Learn about Rajavasantha Welfare Trust and the principles behind our work." };

export default function AboutPage() {
  return <>
    <section className="bg-primary pb-20 pt-40 text-canvas"><div className="container max-w-4xl">
      <p className="eyebrow text-secondary">Our story</p><h1 className="mt-5 font-display text-5xl font-semibold leading-tight sm:text-6xl">A more caring future begins close to home.</h1>
      <p className="mt-7 max-w-2xl text-lg leading-relaxed text-canvas/80">Rajavasantha Welfare Trust brings practical support, opportunity and care to communities across Karnataka. We connect generous people with programmes that create durable change.</p>
    </div></section>
    <section className="container grid gap-12 py-20 lg:grid-cols-2 lg:py-28"><div><SectionHeading eyebrow="Why we exist" title="Compassion, organised into action." /><p className="mt-7 leading-8 text-ink-soft">Inequality is not abstract when it shapes a child&apos;s classroom, a family&apos;s access to care, or a woman&apos;s path to financial independence. Our work turns shared concern into consistent, community-led action.</p></div><div className="rounded-3xl bg-accent p-8 sm:p-10"><Target className="h-9 w-9 text-secondary-600" /><h2 className="mt-5 font-display text-3xl font-semibold text-primary">Our mission</h2><p className="mt-4 leading-8 text-ink-soft">To create equitable pathways to education, health, livelihoods and a healthy environment—so every family can thrive with dignity.</p><h2 className="mt-8 font-display text-3xl font-semibold text-primary">Our vision</h2><p className="mt-4 leading-8 text-ink-soft">A society where opportunity, care and belonging are shared by all.</p></div></section>
    <section className="bg-accent py-20"><div className="container"><SectionHeading eyebrow="What guides us" title="Values we practise every day." /><div className="mt-10 grid gap-5 md:grid-cols-3">{values.map(([title, copy, Icon]) => <article key={title as string} className="rounded-3xl bg-canvas p-7 shadow-soft"><Icon className="h-7 w-7 text-secondary-600" /><h2 className="mt-5 font-display text-2xl font-semibold text-primary">{title as string}</h2><p className="mt-3 leading-7 text-ink-soft">{copy as string}</p></article>)}</div></div></section>
  </>;
}
