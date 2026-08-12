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

  // Controls the large → regular homepage navbar transition.
  const [heroExpanded, setHeroExpanded] = useState(true);

  const pathname = usePathname();

  /*
   * ==========================================================
   * PAGE TYPE
   * ==========================================================
   *
   * Homepage:
   * "/" → special large hero navbar
   *
   * Other pages:
   * "/" → regular navbar
   */

  const isHomePage = pathname === "/";

  /*
   * ==========================================================
   * RESET NAVBAR WHEN PAGE CHANGES
   * ==========================================================
   *
   * Homepage starts expanded.
   *
   * Internal pages always start regular.
   */

  useEffect(() => {
    setOpen(false);

    if (pathname === "/") {
      setHeroExpanded(true);
    } else {
      setHeroExpanded(false);
    }
  }, [pathname]);

  /*
   * ==========================================================
   * SCROLL DETECTION
   * ==========================================================
   *
   * Any homepage scroll collapses the large navbar.
   */

  useEffect(() => {
    const onScroll = () => {
      const hasScrolled = window.scrollY > 24;

      setScrolled(hasScrolled);

      if (hasScrolled && isHomePage) {
        setHeroExpanded(false);
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHomePage]);

  /*
   * ==========================================================
   * MOBILE BODY LOCK
   * ==========================================================
   */

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /*
   * ==========================================================
   * HOMEPAGE NAVBAR STATES
   * ==========================================================
   *
   * Large:
   * Homepage + not scrolled + not clicked
   *
   * Regular:
   * Homepage after scroll/click
   * OR every internal page
   */

  const heroLarge =
    isHomePage &&
    heroExpanded &&
    !scrolled &&
    !open;

  /*
   * Transparent only while the large hero navbar
   * is sitting over the homepage hero.
   */

  const transparentHero =
    isHomePage &&
    !scrolled &&
    !open;

  /*
   * ==========================================================
   * BRAND COLOR STATE
   * ==========================================================
   */

  const brandLight = transparentHero;

  return (
    <header
      onClick={() => {
        /*
         * Any navbar click collapses the large homepage
         * navbar into the regular size.
         *
         * This does NOT alter the mobile navigation.
         */
        if (isHomePage && heroExpanded) {
          setHeroExpanded(false);
        }
      }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",

        transparentHero
          ? "bg-transparent"
          : "bg-ivory/95 shadow-[0_1px_0_0_color-mix(in_oklab,var(--forest-deep)_12%,transparent)] backdrop-blur",
      )}
    >
      {/* =====================================================
          HEADER CONTAINER
      ====================================================== */}

      <div
        className={cn(
          "flex w-full items-center gap-4 px-5 transition-all duration-500 lg:px-6",

          /*
           * LARGE HOMEPAGE STATE
           */
          heroLarge
            ? "py-3 lg:py-5"
            : "py-0",
        )}
      >
        {/* =====================================================
            LOGO + BRAND
        ====================================================== */}

        <Link
          href="/"
          className={cn(
            "flex shrink-0 items-center gap-3 py-3 transition-all duration-500 lg:ml-7",

            /*
             * Slightly larger gap when hero navbar is expanded.
             */
            heroLarge
              ? "lg:gap-4"
              : "lg:gap-3",
          )}
          aria-label="Rajavasantha Welfare Trust — home"
        >
          {/* =================================================
              LOGO
          ================================================== */}

          <span
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-500",

              /*
               * LARGE HERO LOGO
               */
              heroLarge
                ? "h-16 w-16 bg-ivory lg:h-[4.75rem] lg:w-[4.75rem]"
                : brandLight
                  ? "h-12 w-12 bg-ivory"
                  : "h-11 w-11 bg-transparent",
            )}
          >
            <img
              src={logo.url}
              alt="Rajavasantha Welfare Trust emblem"
              width={42}
              height={38}
              className={cn(
                "w-auto transition-all duration-500",

                /*
                 * LARGE HERO LOGO IMAGE
                 */
                heroLarge
                  ? "h-11 lg:h-12"
                  : brandLight
                    ? "h-8"
                    : "h-9",
              )}
            />
          </span>

          {/* =================================================
              BRAND TEXT
          ================================================== */}

          <span
            className={cn(
              "leading-tight transition-all duration-500",

              heroLarge
                ? "lg:scale-105 lg:origin-left"
                : "scale-100",
            )}
          >
            {/* =================================================
                RAJAVASANTHA
            ================================================== */}

            <span
              className={cn(
                "block font-display font-semibold tracking-[0.16em] uppercase transition-all duration-500",

                /*
                 * LARGE HERO NAME
                 */
                heroLarge
                  ? "text-[1.2rem] sm:text-[1.35rem] lg:text-[1.45rem]"
                  : "text-[0.95rem] sm:text-[1.05rem]",

                brandLight
                  ? "text-ivory"
                  : "text-forest-deep",
              )}
            >
              Rajavasantha
            </span>

            {/* =================================================
                WELFARE TRUST
            ================================================== */}

            <span
              className={cn(
                "block font-medium uppercase transition-all duration-500",

                heroLarge
                  ? "text-[0.68rem] tracking-[0.38em]"
                  : "text-[0.55rem] tracking-[0.34em]",

                brandLight
                  ? "text-gold"
                  : "text-forest-soft/80",
              )}
            >
              Welfare Trust
            </span>

            {/* =================================================
                REGISTRATION DETAILS
            ================================================== */}

            <span
              className={cn(
                "hidden whitespace-nowrap font-semibold tracking-[0.07em] uppercase text-gold transition-all duration-500 lg:block",

                heroLarge
                  ? "mt-2 text-[0.6rem]"
                  : "mt-1.5 text-[0.52rem]",
              )}
            >
              Registered Charitable Trust
              <span
                className={cn(
                  heroLarge
                    ? "mx-2"
                    : "mx-1.5",
                )}
              >
                •
              </span>
              RJN-4-00372-2026-27
            </span>
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav
          aria-label="Primary"
          className={cn(
            "hidden shrink-0 items-center lg:ml-auto lg:flex",

            heroLarge
              ? "gap-9"
              : "gap-8",
          )}
        >
          {nav.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.to);

            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "link-underline font-medium tracking-[0.1em] uppercase transition-all duration-500",

                  /*
                   * Slightly larger navigation during
                   * initial hero state.
                   */
                  heroLarge
                    ? "text-[0.85rem]"
                    : "text-[0.8rem]",

                  brandLight
                    ? "text-ivory/90 hover:text-ivory"
                    : "text-forest-deep/85 hover:text-forest-deep",

                  active &&
                    (brandLight
                      ? "text-gold"
                      : "text-forest-deep"),
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* =====================================================
            DESKTOP ACTION BUTTONS
        ====================================================== */}

        <div
          className={cn(
            "hidden shrink-0 items-center lg:flex",

            heroLarge
              ? "gap-3.5"
              : "gap-3",
          )}
        >
          {/* Volunteer */}

          <ActionLink
            to="/volunteer"
            variant={
              brandLight
                ? "outlineLight"
                : "outline"
            }
            className={cn(
              "transition-all duration-500",

              heroLarge
                ? "px-5 py-3"
                : "px-5 py-2.5",
            )}
          >
            Volunteer
          </ActionLink>

          {/* Support */}

          <ActionLink
            to="/support"
            variant="gold"
            className={cn(
              "transition-all duration-500",

              heroLarge
                ? "px-5 py-3"
                : "px-5 py-2.5",
            )}
          >
            Support the Trust
          </ActionLink>
        </div>

        {/* =====================================================
            MOBILE HEADER
            UNCHANGED
        ====================================================== */}

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
            onClick={(event) => {
              /*
               * Prevent the header click handler from
               * interfering with the mobile menu.
               */
              event.stopPropagation();

              setOpen((v) => !v);
            }}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={
              open
                ? "Close menu"
                : "Open menu"
            }
            className={cn(
              "flex h-11 w-11 items-center justify-center transition-colors",

              brandLight
                ? "text-ivory"
                : "text-forest-deep",
            )}
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* =======================================================
          MOBILE NAVIGATION
          COMPLETELY UNCHANGED
      ======================================================== */}

      {open && (
        <div
          id="mobile-nav"
          className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-forest-deep/10 bg-ivory px-6 pt-6 pb-16 lg:hidden"
          onClick={(event) => event.stopPropagation()}
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col"
          >
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
            <ActionLink
              to="/volunteer"
              variant="forest"
            >
              Become a Volunteer
            </ActionLink>

            <ActionLink
              to="/support"
              variant="gold"
            >
              Support the Trust
            </ActionLink>
          </div>
        </div>
      )}
    </header>
  );
}