"use client";

import { useState, type FormEvent } from "react";
import { HandCoins, Users, Handshake } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import {
  Field,
  SubmitRow,
  SuccessPanel,
  handleValidate,
  inputClass,
  type FieldError,
} from "@/components/site/form-parts";
import { areasOfInterest, contact } from "@/data/site";
import { submitDemoForm } from "@/lib/demo-form";

const ways = [
  {
    icon: HandCoins,
    title: "Financial support",
    body: "Support the Trust's charitable objectives. The deed provides for funds to be raised through donations, freewill offerings, endowments, gifts and contributions.",
  },
  {
    icon: Users,
    title: "Volunteer support",
    body: "Give your time and skills. Volunteers can contribute to outreach, education support, awareness and programme assistance as initiatives develop.",
  },
  {
    icon: Handshake,
    title: "Partnership support",
    body: "Explore ways to collaborate. We welcome conversations with institutions and community organisations about future collaboration.",
  },
];

export default function Support() {
  const [errors, setErrors] = useState<FieldError>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { ok, errors: found } = handleValidate(e, [
      { name: "name", label: "Name" },
      { name: "email", label: "Email", email: true },
      { name: "message", label: "Message" },
    ]);
    setErrors(found);
    setSubmitError(false);
    if (!ok) return;

    setSending(true);
    try {
      await submitDemoForm(e.currentTarget, "New support enquiry - Rajavasantha Welfare Trust");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Support the work. Strengthen the mission."
        intro="Rajavasantha Welfare Trust is newly established. Support today helps build the capacity to serve communities tomorrow."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-px bg-forest-deep/10 md:grid-cols-3">
            {ways.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <article className="h-full bg-card p-8 lg:p-10">
                  <w.icon className="h-7 w-7 text-gold" aria-hidden="true" />
                  <h2 className="mt-6 font-display text-2xl text-forest-deep">{w.title}</h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {w.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow">Support / donation enquiry</p>
              <h2 className="display-md mt-5 text-forest-deep">
                Online payment is not yet available.
              </h2>
              <p className="mt-6 text-[1.02rem] leading-relaxed text-muted-foreground">
                The Trust has not enabled online payments on this website. If you wish to
                support the Trust, please send an enquiry using this form, or write directly
                to{" "}
                <a href={`mailto:${contact.email}`} className="link-underline text-forest-deep">
                  {contact.email}
                </a>
                . A trustee will respond with the appropriate details.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-forest-soft">
                The Trust makes no claim regarding tax exemption or statutory approvals on
                this website. Any such information will be published only once formally
                granted and verified.
              </p>
            </Reveal>

            <Reveal delay={90}>
              {done ? (
                <SuccessPanel
                  title="Thank you for reaching out."
                  body="Your enquiry has been recorded. A member of the Trust will respond to you by email."
                />
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="border border-forest-deep/12 bg-card p-8 lg:p-12"
                >
                  <h2 className="font-display text-2xl text-forest-deep">Support enquiry</h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <Field label="Name" htmlFor="name" required error={errors["name"]}>
                      <input id="name" name="name" className={inputClass} maxLength={100} autoComplete="name" />
                    </Field>
                    <Field label="Email" htmlFor="email" required error={errors["email"]}>
                      <input id="email" name="email" type="email" className={inputClass} maxLength={255} autoComplete="email" />
                    </Field>
                    <Field label="Phone" htmlFor="phone">
                      <input id="phone" name="phone" type="tel" className={inputClass} maxLength={20} autoComplete="tel" />
                    </Field>
                    <Field label="Area of interest" htmlFor="interest">
                      <select id="interest" name="interest" className={inputClass} defaultValue="">
                        <option value="">Select</option>
                        {areasOfInterest.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                        <option>General support</option>
                      </select>
                    </Field>
                    <Field label="Message" htmlFor="message" required error={errors["message"]} className="sm:col-span-2">
                      <textarea id="message" name="message" rows={5} className={inputClass} maxLength={1000} />
                    </Field>
                  </div>
                  <SubmitRow
                    label={sending ? "Sending..." : "Send enquiry"}
                    note="Your details are used only to respond to this enquiry."
                  />
                  {submitError && (
                    <p role="alert" className="mt-4 text-sm text-destructive">
                      We couldn&apos;t send your enquiry. Please try again.
                    </p>
                  )}
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
