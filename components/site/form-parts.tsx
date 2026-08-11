"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionButton } from "./Action";

export type FieldError = Record<string, string>;

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string | undefined;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[0.7rem] font-semibold tracking-[0.16em] text-forest-soft uppercase"
      >
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "min-h-11 w-full border border-forest-deep/20 bg-card px-4 py-3 text-[0.95rem] text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none";

export function SuccessPanel({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-start gap-4 border border-gold/40 bg-card p-10"
    >
      <CheckCircle2 className="h-9 w-9 text-gold" aria-hidden="true" />
      <h3 className="font-display text-2xl text-forest-deep">{title}</h3>
      <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

export function useFormState() {
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  return { errors, setErrors, submitted, setSubmitted };
}

export function SubmitRow({ label, note }: { label: string; note?: string }) {
  return (
    <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
      <ActionButton type="submit" variant="forest">
        {label}
      </ActionButton>
      {note && <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>}
    </div>
  );
}

export function handleValidate(
  e: FormEvent<HTMLFormElement>,
  rules: { name: string; label: string; email?: boolean; checkbox?: boolean }[],
): { ok: boolean; errors: FieldError } {
  const data = new FormData(e.currentTarget);
  const errors: FieldError = {};
  for (const rule of rules) {
    const raw = data.get(rule.name);
    if (rule.checkbox) {
      if (!raw) errors[rule.name] = `Please confirm ${rule.label.toLowerCase()}.`;
      continue;
    }
    const value = String(raw ?? "").trim();
    if (!value) {
      errors[rule.name] = `${rule.label} is required.`;
      continue;
    }
    if (value.length > 1000) errors[rule.name] = `${rule.label} is too long.`;
    if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      errors[rule.name] = "Please enter a valid email address.";
    }
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
