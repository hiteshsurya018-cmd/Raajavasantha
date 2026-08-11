"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { lovableAssets } from "@/lib/lovable-assets";
import { ActionLink } from "./Action";

const logo = lovableAssets.logo;

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Our Focus", to: "/focus-areas" },
  { label: "Principles", to: "/principles" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-ivory/95 shadow-[0_1px_0_0_color-mix(in_oklab,var(--forest-deep)_12%,transparent)] backdrop-blur"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[80rem] items-center justify-between gap-4 px-5 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 py-3"
          aria-label="Rajavasantha Welfare Trust — home"
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-500",
              light ? "h-12 w-12 bg-ivory" : "h-11 w-11 bg-transparent",
            )}
          >
            <img
              src={logo.url}
              alt="Rajavasantha Welfare Trust emblem"
              width={44}
              height={40}
              className={cn("w-auto transition-all duration-500", light ? "h-8" : "h-9")}
            />
          </span>
          <span className="leading-tight">
            <span
              className={cn(
                "block font-display text-[0.95rem] font-semibold tracking-[0.16em] uppercase transition-colors sm:text-[1.05rem]",
                light ? "text-ivory" : "text-forest-deep",
              )}
            >
              Rajavasantha
            </span>
            <span
              className={cn(
                "block text-[0.55rem] font-medium tracking-[0.34em] uppercase transition-colors",
                light ? "text-gold" : "text-forest-soft/80",
              )}
            >
              Welfare Trust
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "link-underline text-[0.8rem] font-medium tracking-[0.1em] uppercase transition-colors",
                light ? "text-ivory/85 hover:text-ivory" : "text-forest-deep/85 hover:text-forest-deep",
                (item.to === "/" ? pathname === "/" : pathname?.startsWith(item.to)) &&
                  (light ? "text-gold" : "text-forest-deep"),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ActionLink
            to="/volunteer"
            variant={light ? "outlineLight" : "outline"}
            className="px-5 py-2.5"
          >
            Volunteer
          </ActionLink>
          <ActionLink to="/support" variant="gold" className="px-5 py-2.5">
            Support the Trust
          </ActionLink>
        </div>


        <div className="flex items-center gap-2 lg:hidden">
          <ActionLink
            to="/support"
            variant="gold"
            className="px-4 py-2.5 text-[0.65rem] tracking-[0.14em]"
          >
            Support
          </ActionLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "flex h-11 w-11 items-center justify-center transition-colors",
              light ? "text-ivory" : "text-forest-deep",
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-forest-deep/10 bg-ivory px-6 pt-6 pb-16 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className="border-b border-forest-deep/10 py-4 font-display text-2xl text-forest-deep"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/founding-team"
              className="border-b border-forest-deep/10 py-4 text-sm tracking-[0.12em] text-forest-soft uppercase"
            >
              Founding Team
            </Link>
            <Link
              href="/support"
              className="border-b border-forest-deep/10 py-4 text-sm tracking-[0.12em] text-forest-soft uppercase"
            >
              Support the Trust
            </Link>
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <ActionLink to="/volunteer" variant="forest">
              Become a Volunteer
            </ActionLink>
            <ActionLink to="/support" variant="gold">
              Support the Trust
            </ActionLink>
          </div>
        </div>
      )}
    </header>
  );
}
