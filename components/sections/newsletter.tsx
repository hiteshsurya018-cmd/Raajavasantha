"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { submitDemoForm } from "@/lib/demo-form";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      await submitDemoForm(e.currentTarget, "New newsletter signup — Rajavasantha Welfare Trust");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-canvas py-16">
      <div className="container">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center rounded-4xl border border-line bg-accent px-8 py-12 text-center sm:px-14">
          <span className="eyebrow">
            <span className="h-px w-6 bg-current opacity-60" /> Stay Connected
          </span>
          <h3 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Join our journey of change
          </h3>
          <p className="mt-2 max-w-sm text-sm text-ink-soft">
            One thoughtful email a month — real stories, no noise.
          </p>

          {status === "sent" ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCircle2 className="h-5 w-5" /> You&rsquo;re on the list. Welcome.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 flex w-full max-w-md gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-line bg-canvas px-5 py-3 text-sm text-ink placeholder:text-ink-faint focus-visible:border-primary"
              />
                <button
                  type="submit"
                  disabled={status === "sending"}
                aria-label="Subscribe"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-canvas transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                </button>
              {status === "error" && <p role="alert" className="sr-only">We couldn&apos;t send your signup.</p>}
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
