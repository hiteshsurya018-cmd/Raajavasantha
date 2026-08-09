"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

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
          "container flex items-center justify-between rounded-[14px] border px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled
            ? "border-[#1F3827]/15 bg-[#F7F2E7]/96 shadow-[0_12px_34px_rgba(31,56,39,0.08)]"
            : "border-[#1F3827]/12 bg-[#F7F2E7]/90"
        )}
      >
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3.5 rounded-[10px] focus-visible:outline-none sm:gap-4"
          aria-label="Rajavasantha Welfare Trust home"
        >
          <span className="flex min-w-[205px] items-center gap-3 sm:min-w-[226px]">
            <span className="shrink-0">
              <Image
                src="/logo.jpeg"
                alt="Rajavasantha Welfare Trust logo"
                width={52}
                height={52}
                priority
                className="h-12 w-12 object-contain"
              />
            </span>
            <BrandText />
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
                  className="flex items-center gap-1 rounded-[10px] px-3 py-2 text-sm font-medium text-[#1F3827]/82 transition-colors duration-200 hover:bg-[#1F3827]/5 hover:text-[#B34E2D] focus-visible:outline-none"
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
                      className="absolute left-1/2 top-full mt-4 w-[560px] -translate-x-1/2 rounded-[14px] border border-[#1F3827]/12 bg-[#F7F2E7]/98 p-5 shadow-[0_18px_46px_rgba(31,56,39,0.12)]"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {FOCUS_AREAS.map((area) => (
                          <Link
                            key={area.name}
                            href={area.href}
                            className="rounded-[10px] p-3 transition-colors duration-200 hover:bg-[#1F3827]/5"
                          >
                            <p className="font-display text-[0.95rem] font-semibold text-[#1F3827]">
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
                className="rounded-[10px] px-3 py-2 text-sm font-medium text-[#1F3827]/82 transition-colors duration-200 hover:bg-[#1F3827]/5 hover:text-[#B34E2D]"
              >
                {link.name}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href="tel:+918971993133"
            className="flex items-center gap-1.5 rounded-[10px] px-2 py-2 text-sm font-medium text-[#4D574D] transition-colors duration-200 hover:text-[#B34E2D]"
            aria-label="Call Rajavasantha Welfare Trust at +91 89719 93133"
          >
            <Phone className="h-3.5 w-3.5" /> +91 89719 93133
          </a>
          <Button
            size="sm"
            className="gap-1.5 rounded-[10px] bg-[#B34E2D] px-5 text-white shadow-none transition-all duration-200 hover:bg-[#963F24]"
            asChild
          >
            <Link href="/donate">
              <Heart className="h-4 w-4" /> Donate Now
            </Link>
          </Button>
        </div>

        <button
          className="rounded-[10px] p-2 text-[#1F3827] transition-colors duration-200 hover:bg-[#1F3827]/5 xl:hidden"
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
            className="fixed inset-0 z-[60] bg-[#163021]/35 backdrop-blur-sm xl:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[82%] max-w-sm flex-col bg-[#F7F2E7] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.jpeg"
                    alt="Rajavasantha Welfare Trust logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                  <span className="flex flex-col leading-none">
                    <span className="font-display text-lg font-bold text-[#1F3827]">RAJAVASANTHA</span>
                    <span className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#B34E2D]">
                      WELFARE TRUST (R)
                    </span>
                  </span>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-[10px] p-2 text-[#1F3827] hover:bg-[#1F3827]/5">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-[10px] px-3 py-3 text-base font-medium text-[#1F3827] transition-colors duration-200 hover:bg-[#1F3827]/5 hover:text-[#B34E2D]"
                  >
                    {link.name === "Documents" && <FileText className="mr-2 inline h-4 w-4 text-[#B34E2D]" />}
                    {link.name}
                  </Link>
                ))}
              </nav>
              <a
                href="tel:+918971993133"
                className="mt-8 flex items-center gap-2 rounded-[10px] bg-[#EEE5CF] px-4 py-3 text-sm font-semibold text-[#1F3827]"
              >
                <Phone className="h-4 w-4 text-[#B34E2D]" /> +91 89719 93133
              </a>
              <Button
                className="mt-auto gap-1.5 rounded-[10px] bg-[#B34E2D] text-white shadow-none hover:bg-[#963F24]"
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
      <span className="font-display text-[1.05rem] font-bold uppercase text-[#1F3827] sm:text-[1.16rem]">
        RAJAVASANTHA
      </span>
      <span className="mt-1 text-[0.57rem] font-semibold uppercase tracking-[0.22em] text-[#B34E2D] sm:text-[0.61rem]">
        WELFARE TRUST (R)
      </span>
      <span className="mt-1 text-[0.56rem] font-medium uppercase tracking-[0.18em] text-[#5C665A]">
        Est. 2026
      </span>
    </span>
  );
}
