"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ChevronDown, Heart, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FOCUS_AREAS = [
  { name: "Education", href: "/work/education", blurb: "Quality schooling for every child" },
  { name: "Healthcare", href: "/work/healthcare", blurb: "Free camps & clinics" },
  { name: "Women Empowerment", href: "/work/women", blurb: "Skills, credit, dignity" },
  { name: "Environment", href: "/work/environment", blurb: "Tree plantation & water" },
  { name: "Animal Welfare", href: "/work/animals", blurb: "Shelter and care" },
  { name: "Disaster Relief", href: "/work/disaster", blurb: "First response, rebuilding" },
];

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Work", href: "/work", mega: true },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
  { name: "News & Events", href: "/news" },
  { name: "Documents", href: "/documents" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [brandArrived, setBrandArrived] = React.useState(pathname !== "/");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  React.useEffect(() => {
    if (pathname !== "/") {
      setBrandArrived(true);
      return;
    }

    function revealBrand() {
      setBrandArrived(true);
    }

    window.addEventListener("rajavasantha-brand-arrival-start", revealBrand);
    return () => window.removeEventListener("rajavasantha-brand-arrival-start", revealBrand);
  }, [pathname]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial",
        scrolled ? "py-2" : "py-4 sm:py-5"
      )}
    >
      <div
        className={cn(
          "container flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled
            ? "glass border-line/70 shadow-glass"
            : "border-white/20 bg-canvas/8 backdrop-blur-[2px]"
        )}
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3.5 rounded-full focus-visible:outline-none sm:gap-4"
          aria-label="Rajavasantha Welfare Trust home"
        >
          <span className="relative flex min-w-[205px] items-center gap-3 sm:min-w-[226px]">
            <span className="invisible flex items-center gap-3" aria-hidden>
              <Image
                src="/logo.jpeg"
                alt=""
                width={52}
                height={52}
                className="h-12 w-12 rounded-full object-cover"
              />
              <BrandText />
            </span>
            <AnimatePresence>
              {brandArrived && (
                <motion.span
                  layoutId="rajavasantha-brand-block"
                  initial={{ opacity: 0, rotate: -3 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{
                    layout: { type: "spring", stiffness: 95, damping: 20, duration: 1.35 },
                    opacity: { duration: 0.35, delay: 0.2 },
                    rotate: { type: "spring", stiffness: 110, damping: 18 },
                  }}
                  className="absolute inset-y-0 left-0 flex items-center gap-3"
                >
                  <motion.span layoutId="rajavasantha-brand-logo" className="shrink-0">
                    <Image
                      src="/logo.jpeg"
                      alt="Rajavasantha Welfare Trust"
                      width={52}
                      height={52}
                      priority
                      className="h-12 w-12 rounded-full object-cover shadow-soft ring-2 ring-secondary/35"
                    />
                  </motion.span>
                  <BrandText />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.mega ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <button
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-ink/5 hover:text-primary focus-visible:outline-none"
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                >
                  {link.name}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {megaOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="glass absolute left-1/2 top-full mt-4 w-[560px] -translate-x-1/2 rounded-3xl border border-line/60 p-5 shadow-glass"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {FOCUS_AREAS.map((area) => (
                          <Link
                            key={area.name}
                            href={area.href}
                            className="rounded-2xl p-3 transition-colors hover:bg-primary/5"
                          >
                            <p className="font-display text-[0.95rem] font-semibold text-primary">
                              {area.name}
                            </p>
                            <p className="mt-0.5 text-xs text-ink-soft">{area.blurb}</p>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-ink/5 hover:text-primary"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href="tel:+918971993133"
            className="flex items-center gap-1.5 rounded-full px-2 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
            aria-label="Call Rajavasantha Welfare Trust at +91 89719 93133"
          >
            <Phone className="h-3.5 w-3.5" /> +91 89719 93133
          </a>
          <Button
            size="sm"
            className="gap-1.5 bg-[#7A1F1F] px-5 text-canvas hover:bg-secondary hover:text-primary-700"
            asChild
          >
            <Link href="/donate">
              <Heart className="h-4 w-4" /> Donate Now
            </Link>
          </Button>
        </div>

        <button
          className="rounded-full p-2 text-ink transition-colors hover:bg-ink/5 xl:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-primary-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-canvas p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.jpeg"
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-secondary/35"
                  />
                  <span className="flex flex-col leading-none">
                    <span className="font-display text-lg font-bold text-primary">RAJAVASANTHA</span>
                    <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-secondary-600">
                      WELFARE TRUST (R)
                    </span>
                  </span>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-ink/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-accent"
                  >
                    {link.name === "Documents" && <FileText className="mr-2 inline h-4 w-4 text-secondary-600" />}
                    {link.name}
                  </Link>
                ))}
              </nav>
              <a
                href="tel:+918971993133"
                className="mt-8 flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-primary"
              >
                <Phone className="h-4 w-4 text-secondary-600" /> +91 89719 93133
              </a>
              <Button
                className="mt-auto gap-1.5 bg-[#7A1F1F] text-canvas hover:bg-secondary hover:text-primary-700"
                asChild
              >
                <Link href="/donate" onClick={() => setOpen(false)}>
                  <Heart className="h-4 w-4" /> Donate Now
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function BrandText() {
  return (
    <span className="flex min-w-0 flex-col leading-none">
      <span className="font-display text-[1.05rem] font-bold uppercase text-primary sm:text-[1.16rem]">
        RAJAVASANTHA
      </span>
      <span className="mt-1 text-[0.57rem] font-semibold uppercase tracking-[0.22em] text-secondary-600 sm:text-[0.61rem]">
        WELFARE TRUST (R)
      </span>
      <span className="mt-1 text-[0.56rem] font-medium uppercase tracking-[0.18em] text-ink-soft">
        Est. 2026
      </span>
    </span>
  );
}
