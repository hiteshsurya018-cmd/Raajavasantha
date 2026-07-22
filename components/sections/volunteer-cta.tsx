"use client";

import * as React from "react";
import { Sparkles, Users2, Award, Clock, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { submitDemoForm } from "@/lib/demo-form";

const BENEFITS = [
  { icon: Users2, text: "Join a community of 850+ active volunteers" },
  { icon: Award, text: "Certificate & recognition for consistent service" },
  { icon: Clock, text: "Flexible weekend & weekday shifts" },
  { icon: Sparkles, text: "Hands-on impact you can see, not just report" },
];

export function VolunteerCta() {
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitDemoForm(e.currentTarget, "New volunteer signup — Rajavasantha Welfare Trust");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-canvas py-24">
      <div className="container grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal direction="left">
          <span className="eyebrow">
            <span className="h-px w-6 bg-current opacity-60" /> Become a Volunteer
          </span>
          <h2 className="mt-4 text-balance font-display text-[2.1rem] leading-tight text-ink sm:text-[2.6rem]">
            Your Saturday mornings could rebuild someone&rsquo;s whole week.
          </h2>
          <p className="mt-4 max-w-md text-ink-soft">
            No experience required — just two hours and a willingness to show up.
            We&rsquo;ll match you to a project near you within 48 hours.
          </p>
          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-primary">
                  <b.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="text-sm text-ink">{b.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="right">
          <div className="rounded-4xl border border-line bg-accent p-8 shadow-soft sm:p-10">
            {status === "sent" ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  Thank you for stepping up
                </h3>
                <p className="mt-2 text-sm text-ink-soft">
                  A coordinator will reach out within 48 hours with your first assignment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-xl font-semibold text-ink">Volunteer sign-up</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" id="v-name" name="fullName" type="text" required />
                  <Field label="Phone number" id="v-phone" name="phone" type="tel" required />
                </div>
                <Field label="Email address" id="v-email" name="email" type="email" required />
                <div>
                  <label htmlFor="v-interest" className="mb-1.5 block text-sm font-medium text-ink">
                    Area of interest
                  </label>
                  <select
                    id="v-interest"
                    name="interest"
                    required
                    className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink focus-visible:border-primary"
                  >
                    <option>Education</option>
                    <option>Healthcare camps</option>
                    <option>Environment & plantation</option>
                    <option>Event support</option>
                  </select>
                </div>
                <Button type="submit" disabled={status === "sending"} className="w-full">
                  {status === "sending" ? "Sending…" : "Submit application"}
                </Button>
                {status === "error" && <p role="alert" className="text-sm text-red-700">We couldn&apos;t send your application. Please try again.</p>}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  name,
  type,
  required,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-primary"
      />
    </div>
  );
}
