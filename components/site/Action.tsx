"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 rounded-none";

const variants = {
  gold: "bg-gold text-forest-deep hover:bg-gold-soft hover:-translate-y-0.5",
  forest: "bg-forest-deep text-ivory hover:bg-forest-soft hover:-translate-y-0.5",
  outline:
    "border border-forest-deep/30 text-forest-deep hover:border-gold hover:text-forest hover:-translate-y-0.5",
  outlineLight:
    "border border-ivory/40 text-ivory hover:border-gold hover:text-gold hover:-translate-y-0.5",
} as const;

export type ActionVariant = keyof typeof variants;

export function ActionLink({
  to,
  variant = "gold",
  className,
  children,
  ...rest
}: { to: string; variant?: ActionVariant; className?: string; children: ReactNode } & Omit<
  ComponentProps<typeof Link>,
  "href" | "children" | "className"
>) {
  return (
    <Link href={to} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </Link>
  );
}

export function ActionButton({
  variant = "gold",
  className,
  children,
  ...rest
}: { variant?: ActionVariant } & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

export function ActionAnchor({
  variant = "outline",
  className,
  children,
  ...rest
}: { variant?: ActionVariant } & ComponentProps<"a">) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </a>
  );
}
