"use client";

import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { CTASection } from "@/components/site/CTASection";
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

const contributions = [
  "Community outreach",
  "Education and tutoring support",
  "Awareness campaigns",
  "Event coordination",
  "Administrative support",
  "Digital and technology skills",
  "Fundraising support",
  "Programme assistance",
];

export default function Volunteer() {
  const [errors, setErrors] = useState<FieldError>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { ok, errors: found } = handleValidate(e, [
      { name: "fullName", label: "Full name" },
      { name: "email", label: "Email", email: true },
      { name: "phone", label: "Phone" },
      { name: "city", label: "City" },
      { name: "interest", label: "Area of interest" },
      { name: "consent", label: "your consent to be contacted", checkbox: true },
    ]);
    setErrors(found);
    setSubmitError(false);
    if (!ok) return;

    setSending(true);
    try {
      await submitDemoForm(e.currentTarget, "New volunteer application - Rajavasantha Welfare Trust");
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
        eyebrow="Volunteer"
        title="Your time can make a difference."
        intro="Volunteers bring skills, energy and local knowledge. Register your interest and we will be in touch as the Trust's initiatives take shape."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow">How volunteers can help</p>
              <h2 className="display-md mt-5 text-forest-deep">
                Areas where volunteers may contribute as initiatives develop.
              </h2>
              <ul className="mt-8 space-y-3">
                {contributions.map((c) => (
                  <li
                    key={c}
                    className="flex gap-3 border-b border-forest-deep/10 pb-3 text-[0.98rem] text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                    />
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-relaxed text-forest-soft">
                These are indicative areas under the Trust&apos;s objectives, not currently
                operational programmes. Questions? Write to{" "}
                <a href={`mailto:${contact.email}`} className="link-underline text-forest-deep">
                  {contact.email}
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={90}>
              {done ? (
                <SuccessPanel
                  title="Thank you for registering your interest."
                  body="Your details have been recorded. A member of the Trust will contact you by email as volunteer initiatives are established."
                />
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="border border-forest-deep/12 bg-card p-8 lg:p-12"
                >
                  <h2 className="font-display text-2xl text-forest-deep">
                    Volunteer registration
                  </h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <Field label="Full name" htmlFor="fullName" required error={errors["fullName"]}>
                      <input id="fullName" name="fullName" className={inputClass} maxLength={100} autoComplete="name" />
                    </Field>
                    <Field label="Email" htmlFor="email" required error={errors["email"]}>
                      <input id="email" name="email" type="email" className={inputClass} maxLength={255} autoComplete="email" />
                    </Field>
                    <Field label="Phone" htmlFor="phone" required error={errors["phone"]}>
                      <input id="phone" name="phone" type="tel" className={inputClass} maxLength={20} autoComplete="tel" />
                    </Field>
                    <Field label="City" htmlFor="city" required error={errors["city"]}>
                      <input id="city" name="city" className={inputClass} maxLength={80} />
                    </Field>
                    <Field label="Age group" htmlFor="ageGroup">
                      <select id="ageGroup" name="ageGroup" className={inputClass} defaultValue="">
                        <option value="">Select</option>
                        <option>Under 18</option>
                        <option>18–25</option>
                        <option>26–40</option>
                        <option>41–60</option>
                        <option>60+</option>
                      </select>
                    </Field>
                    <Field label="Area of interest" htmlFor="interest" required error={errors["interest"]}>
                      <select id="interest" name="interest" className={inputClass} defaultValue="">
                        <option value="">Select</option>
                        {areasOfInterest.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Skills / expertise" htmlFor="skills" className="sm:col-span-2">
                      <input id="skills" name="skills" className={inputClass} maxLength={200} />
                    </Field>
                    <Field label="Availability" htmlFor="availability">
                      <select id="availability" name="availability" className={inputClass} defaultValue="">
                        <option value="">Select</option>
                        <option>Weekdays</option>
                        <option>Weekends</option>
                        <option>A few hours a month</option>
                        <option>Flexible</option>
                      </select>
                    </Field>
                    <Field label="Preferred mode" htmlFor="mode">
                      <select id="mode" name="mode" className={inputClass} defaultValue="Either">
                        <option>In person</option>
                        <option>Remote</option>
                        <option>Either</option>
                      </select>
                    </Field>
                    <Field label="Message" htmlFor="message" className="sm:col-span-2">
                      <textarea id="message" name="message" rows={4} className={inputClass} maxLength={1000} />
                    </Field>
                  </div>

                  <div className="mt-8 flex items-start gap-3">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-[oklch(0.732_0.096_87.5)]"
                      aria-describedby={errors["consent"] ? "consent-error" : undefined}
                    />
                    <label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                      I agree to be contacted by Rajavasantha Welfare Trust regarding volunteer
                      opportunities. <span className="text-gold">*</span>
                    </label>
                  </div>
                  {errors["consent"] && (
                    <p id="consent-error" role="alert" className="mt-2 text-xs text-destructive">
                      {errors["consent"]}
                    </p>
                  )}

                  <SubmitRow
                    label={sending ? "Sending..." : "Join the volunteer network"}
                    note="Your details are used only to contact you about volunteering."
                  />
                  {submitError && (
                    <p role="alert" className="mt-4 text-sm text-destructive">
                      We couldn&apos;t send your registration. Please try again.
                    </p>
                  )}
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection heading="Prefer to support in other ways?" />
    </>
  );
}
