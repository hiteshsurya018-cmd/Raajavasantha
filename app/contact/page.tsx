"use client";
import { FormEvent, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitDemoForm } from "@/lib/demo-form";
export const dynamic = "force-dynamic";
export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      await submitDemoForm(event.currentTarget, "New contact message — Rajavasantha Welfare Trust");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return <section className="container grid gap-12 pb-24 pt-40 lg:grid-cols-[.85fr_1.15fr]"><div><p className="eyebrow">Get in touch</p><h1 className="mt-4 font-display text-5xl font-semibold text-primary">Let&apos;s make good happen.</h1><p className="mt-6 leading-8 text-ink-soft">Questions, partnerships and community ideas are always welcome.</p><div className="mt-10 space-y-5 text-ink-soft"><p className="flex gap-3"><Mail className="h-5 w-5 text-secondary-600"/>hello@rajavasanthawelfaretrust.org</p><p className="flex gap-3"><Phone className="h-5 w-5 text-secondary-600"/>+91 89719 93133</p><p className="flex gap-3"><MapPin className="h-5 w-5 text-secondary-600"/>Bengaluru, Karnataka, India</p></div></div><form onSubmit={handleSubmit} className="rounded-3xl bg-accent p-7 sm:p-10"><h2 className="font-display text-3xl font-semibold text-primary">Send a message</h2><div className="mt-7 grid gap-5 sm:grid-cols-2"><Field label="Your name" name="name" required/><Field label="Email address" name="email" type="email" required/><label className="sm:col-span-2 text-sm font-medium text-ink">How can we help?<textarea name="message" required rows={5} className="mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-3" /></label></div>{status === "sent" ? <p className="mt-5 rounded-xl bg-primary/10 p-4 text-sm text-primary">Thank you. Your message has been sent.</p> : <><Button type="submit" disabled={status === "sending"} className="mt-6">{status === "sending" ? "Sending…" : "Send message"}</Button>{status === "error" && <p role="alert" className="mt-3 text-sm text-red-700">We couldn&apos;t send your message. Please try again.</p>}</>}</form></section>
}
function Field({label,name,type="text",required=false}:{label:string;name:string;type?:string;required?:boolean}){return <label className="text-sm font-medium text-ink">{label}<input name={name} type={type} required={required} className="mt-2 w-full rounded-xl border border-line bg-canvas px-4 py-3"/></label>}
