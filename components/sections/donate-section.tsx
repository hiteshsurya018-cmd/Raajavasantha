"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, GraduationCap, Stethoscope, TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatINR, cn } from "@/lib/utils";

const PRESETS = [500, 1000, 2500, 5000];

function impactFor(amount: number) {
  return [
    { icon: GraduationCap, label: "school kits", value: Math.max(1, Math.round(amount / 250)) },
    { icon: Stethoscope, label: "health check-ups", value: Math.max(1, Math.round(amount / 150)) },
    { icon: TreePine, label: "trees planted & maintained", value: Math.max(1, Math.round(amount / 80)) },
  ];
}

export function DonateSection() {
  const [frequency, setFrequency] = React.useState<"once" | "monthly">("once");
  const [amount, setAmount] = React.useState(1000);
  const [custom, setCustom] = React.useState("");
  const impact = impactFor(amount);

  // "Sapling" grows taller with the donation amount — signature growth motif
  const growth = Math.min(100, (amount / 5000) * 100);

  return (
    <section className="relative overflow-hidden bg-primary py-24 text-canvas">
      <div className="container grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Make a Donation"
            title="Every rupee is tracked, reported, and put to work within 30 days"
            align="left"
            className="mx-0"
            light
          />
          <p className="mt-6 max-w-md text-canvas/75">
            Choose a one-time gift or become a monthly sustainer — the steadiest form of
            support for programmes that run all year round.
          </p>

          {/* Growth motif: sapling silhouette that fills with height */}
          <div className="mt-10 flex items-end gap-4">
            <div className="relative h-32 w-10 rounded-full bg-canvas/10">
              <motion.div
                className="absolute bottom-0 w-full rounded-full bg-secondary"
                animate={{ height: `${growth}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-canvas/60">Your impact grows with</p>
              <p className="font-display text-lg text-secondary">every rupee you give</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl bg-canvas p-8 text-ink shadow-lift sm:p-10">
          <div className="flex rounded-full bg-accent p-1">
            {(["once", "monthly"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                className={cn(
                  "flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors",
                  frequency === f ? "bg-primary text-canvas shadow-soft" : "text-ink-soft"
                )}
              >
                {f === "once" ? "One-time" : "Monthly"}
              </button>
            ))}
          </div>

          <div className="mt-7 grid grid-cols-4 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => { setAmount(p); setCustom(""); }}
                className={cn(
                  "rounded-xl border py-3 text-sm font-semibold transition-colors",
                  amount === p && !custom
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line text-ink-soft hover:border-primary/40"
                )}
              >
                &#8377;{p}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label htmlFor="custom-amount" className="mb-1.5 block text-sm font-medium text-ink">
              Or enter a custom amount
            </label>
            <div className="flex items-center rounded-xl border border-line px-4 focus-within:border-primary">
              <span className="text-ink-soft">&#8377;</span>
              <input
                id="custom-amount"
                type="number"
                min={100}
                placeholder="Custom amount"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  const v = Number(e.target.value);
                  if (v > 0) setAmount(v);
                }}
                className="w-full bg-transparent px-2 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-accent p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Your {formatINR(amount)}{frequency === "monthly" ? "/month" : ""} could fund
            </p>
            <ul className="mt-3 space-y-2">
              {impact.map((i) => (
                <li key={i.label} className="flex items-center gap-2.5 text-sm text-ink">
                  <i.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                  <span>
                    <strong className="font-semibold">{i.value}</strong> {i.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Button size="lg" className="mt-6 w-full gap-2">
            <Heart className="h-4 w-4" /> Donate {formatINR(amount)}{frequency === "monthly" ? "/mo" : ""}
          </Button>
          <p className="mt-3 text-center text-xs text-ink-faint">
            Secure payment &middot; 80G tax benefit &middot; Instant receipt
          </p>
        </div>
      </div>
    </section>
  );
}
