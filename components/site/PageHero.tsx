import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-deep pt-36 pb-20 text-ivory lg:pt-44 lg:pb-28">
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 h-96 w-96 rounded-full border border-gold/20"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full border border-gold/10"
      />
      <div className="relative mx-auto max-w-[80rem] px-5 lg:px-10">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-lg mt-6 max-w-4xl text-ivory">{title}</h1>
          {intro && (
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">{intro}</p>
          )}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
