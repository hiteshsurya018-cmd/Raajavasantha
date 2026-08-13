"use client";

import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { MapPreview } from "@/components/site/MapPreview";
import { ActionLink, ActionAnchor } from "@/components/site/Action";
import {
  Field,
  SubmitRow,
  SuccessPanel,
  handleValidate,
  inputClass,
  type FieldError,
} from "@/components/site/form-parts";
import { contact, mapsUrl } from "@/data/site";
import { submitDemoForm } from "@/lib/demo-form";

export default function Contact() {
  const [errors, setErrors] = useState<FieldError>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { ok, errors: found } = handleValidate(e, [
      { name: "name", label: "Name" },
      { name: "email", label: "Email", email: true },
      { name: "subject", label: "Subject" },
      { name: "message", label: "Message" },
    ]);

    setErrors(found);
    setSubmitError(false);

    if (!ok) return;

    setSending(true);

    try {
      await submitDemoForm(
        e.currentTarget,
        "New contact message - Rajavasantha Welfare Trust"
      );

      setDone(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        intro="We welcome enquiries about the Trust, volunteering and future collaboration."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            {/* =========================
                CONTACT INFORMATION
            ========================== */}
            <Reveal>
              <p className="eyebrow">Contact the Trust</p>

              <h2 className="display-md mt-5 text-forest-deep">
                Rajavasantha Welfare Trust
              </h2>

              <div className="mt-8 space-y-8">
                {/* Email + Phone */}
                <div className="flex gap-4">
                  <Mail
                    className="mt-1 h-5 w-5 shrink-0 text-gold"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-forest-soft uppercase">
                      Email
                    </p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="link-underline mt-2 inline-flex text-[1.05rem] text-forest-deep"
                    >
                      {contact.email}
                    </a>

                    {/* Mobile */}
                    <a
                      href="tel:+918861249999"
                      className="mt-3 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-forest-deep"
                    >
                      <Phone
                        className="h-4 w-4 text-gold"
                        aria-hidden="true"
                      />
                      <span>Phone: +91 88612 49999</span>
                    </a>

                    {/* Landline */}
                    <a
                      href="tel:+918023479369"
                      className="mt-2 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-forest-deep"
                    >
                      <Phone
                        className="h-4 w-4 text-gold"
                        aria-hidden="true"
                      />
                      <span>Landline: +91 80-23479369</span>
                    </a>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex gap-4">
                  <MapPin
                    className="mt-1 h-5 w-5 shrink-0 text-gold"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-[0.7rem] font-semibold tracking-[0.18em] text-forest-soft uppercase">
                      Office address
                    </p>

                    <address className="mt-2 text-[1.02rem] leading-relaxed text-muted-foreground not-italic">
                      {contact.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}

                      <span className="mt-2 block text-forest-soft">
                        Landmark: {contact.landmark}
                      </span>
                    </address>
                  </div>
                </div>
              </div>

              {/* =========================
                  ACTION BUTTONS
              ========================== */}
              <div className="mt-10 flex flex-wrap gap-3">
                <ActionAnchor
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="outline"
                >
                  Get directions
                  <ArrowUpRight className="h-4 w-4" />
                </ActionAnchor>

                <ActionLink to="/volunteer" variant="outline">
                  Volunteer
                </ActionLink>

                <ActionLink to="/support" variant="gold">
                  Support the Trust
                </ActionLink>
              </div>

              {/* Founding Team */}
              <ActionLink
                to="/founding-team"
                variant="maroon"
                className="mt-10"
              >
                Meet our Founding Team
                <ArrowUpRight className="h-4 w-4" />
              </ActionLink>
            </Reveal>

            {/* =========================
                CONTACT FORM
            ========================== */}
            <Reveal delay={90}>
              {done ? (
                <SuccessPanel
                  title="Message received."
                  body="Thank you for writing to Rajavasantha Welfare Trust. We will respond to you by email."
                />
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="border border-forest-deep/12 bg-card p-8 lg:p-12"
                >
                  <h2 className="font-display text-2xl text-forest-deep">
                    Send a message
                  </h2>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <Field
                      label="Name"
                      htmlFor="name"
                      required
                      error={errors["name"]}
                    >
                      <input
                        id="name"
                        name="name"
                        className={inputClass}
                        maxLength={100}
                        autoComplete="name"
                      />
                    </Field>

                    {/* Email */}
                    <Field
                      label="Email"
                      htmlFor="email"
                      required
                      error={errors["email"]}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className={inputClass}
                        maxLength={255}
                        autoComplete="email"
                      />
                    </Field>

                    {/* Phone */}
                    <Field label="Phone" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={inputClass}
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </Field>

                    {/* Subject */}
                    <Field
                      label="Subject"
                      htmlFor="subject"
                      required
                      error={errors["subject"]}
                    >
                      <input
                        id="subject"
                        name="subject"
                        className={inputClass}
                        maxLength={140}
                      />
                    </Field>

                    {/* Message */}
                    <Field
                      label="Message"
                      htmlFor="message"
                      required
                      error={errors["message"]}
                      className="sm:col-span-2"
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className={inputClass}
                        maxLength={1000}
                      />
                    </Field>
                  </div>

                  <SubmitRow
                    label={sending ? "Sending..." : "Send message"}
                  />

                  {submitError && (
                    <p
                      role="alert"
                      className="mt-4 text-sm text-destructive"
                    >
                      We couldn&apos;t send your message. Please try again.
                    </p>
                  )}
                </form>
              )}
            </Reveal>
          </div>

          {/* =========================
              MAP PREVIEW
          ========================== */}
          <Reveal className="mt-20">
            <MapPreview />
          </Reveal>
        </div>
      </section>
    </>
  );
}