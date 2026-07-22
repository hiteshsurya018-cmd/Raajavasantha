import { ShieldCheck, FileCheck2, Building2, ScrollText, BadgeCheck, Eye } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const BADGES = [
  { icon: FileCheck2, label: "80G Certified", sub: "Tax-exempt giving" },
  { icon: ScrollText, label: "12A Registered", sub: "Income tax exempt" },
  { icon: Building2, label: "CSR Eligible", sub: "Section 135 compliant" },
  { icon: ShieldCheck, label: "Registered Trust", sub: "Govt. of Karnataka" },
  { icon: BadgeCheck, label: "Verified NGO", sub: "Third-party audited" },
  { icon: Eye, label: "Full Transparency", sub: "Public annual reports" },
];

export function TrustIndicators() {
  return (
    <section className="border-y border-line bg-accent py-10">
      <div className="container">
        <Reveal stagger className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {BADGES.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-primary shadow-soft">
                <b.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="text-sm font-semibold text-ink">{b.label}</p>
              <p className="text-xs text-ink-soft">{b.sub}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
