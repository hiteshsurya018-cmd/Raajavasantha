# Rajavasantha Welfare Trust — Website

Production Next.js 15 / React 19 / TypeScript / Tailwind codebase.

## Design plan

**Palette** — Primary `#7A1E22` (Kumkum maroon), Secondary `#D4A437` (Marigold),
Canvas `#FFFDF8` (Parchment), Accent `#F8F3EA` (Sand), Ink `#2C2C2C`, plus two
neutrals derived from the same hues (`ink-soft`, `line`) so nothing outside the
brief's palette appears.

**Type** — Playfair Display for every heading (`font-display`), Inter for body
copy, and a small tracked-caps Inter treatment (`.eyebrow`) as the utility face
for labels and dates.

**Layout** — Alternating rhythm of maroon "statement" sections (Impact, Donate)
and warm parchment/sand sections, generous whitespace, `rounded-3xl`/`4xl`
cards, soft multi-layer shadows instead of hard borders.

**Signature element — the Root & Branch line** (`components/ui/root-line.tsx`):
a single hand-drawn organic line, half root half branch, that draws itself in
as the reader scrolls past the Focus Areas grid. It echoes the banyan tree at
the centre of the trust's own crest and the tagline "Society is our family" —
every programme is one continuous act of growth, not a stack of disconnected
panels. The same growth idea resurfaces as a literal filling "sapling" bar in
the donation calculator, so giving more visibly grows the tree.

## Structure

```
app/
  layout.tsx        Fonts, metadata, skip-link, Navbar/Footer shell
  page.tsx           Homepage — composes all sections in order
  loading.tsx         Route-level skeleton
  error.tsx            Branded error boundary
  globals.css           Tokens, focus states, reduced-motion, signature CSS
components/
  navbar.tsx          Glass nav, mega menu, mobile drawer
  footer.tsx            Quick links, contact, map slot
  ui/                    Reusable primitives: Button, Reveal, AnimatedCounter,
                          RootLine, SectionHeading
  sections/             hero, trust-indicators, impact-counters, focus-areas,
                         featured-projects, testimonials, latest-news, gallery,
                         volunteer-cta, donate-section, newsletter
lib/utils.ts            cn(), formatIndianNumber(), formatINR()
```

Every section is a self-contained, independently reusable component — drop
any of them into another route without touching the rest of the page.

## Motion

- **Reveal** (`components/ui/reveal.tsx`) — scroll-triggered fade/slide via
  Framer Motion `whileInView`, with an optional `stagger` mode for grids.
  Respects `prefers-reduced-motion` globally through `useReducedMotion` and a
  CSS fallback in `globals.css`.
- **Hero parallax** — `useScroll` + `useTransform` on the background image and
  content layers, opacity fade as the reader scrolls past.
- **AnimatedCounter** — spring-driven count-up, fires once via
  `useInView`, formatted with Indian digit grouping (`12,500` not `12500`).
- **RootLine** — `stroke-dashoffset` draw-in, triggered by the same
  `useInView` pattern, with leaf nodes that pop in after the line completes.
- **Button ripple** — pointer-position ripple on click, CSS keyframe, cleans
  itself up after 700ms.

## Accessibility

- Skip-to-content link, visible focus rings (`:focus-visible`) in the brand
  gold, `aria-label`/`aria-live`/`aria-modal` on the testimonial carousel and
  gallery lightbox, full keyboard support (Esc/←/→) in the lightbox.
- All decorative SVGs are `aria-hidden`; all content images carry descriptive
  `alt` text.
- Color contrast: body text `#2C2C2C` on `#FFFDF8` and `#F8F3EA` clears AA at
  all sizes used; maroon-on-canvas CTA text clears AA for large text.

## Before shipping

1. `npm install`
2. Replace the placeholder image paths (`/public/hero`, `/public/projects`,
   `/public/gallery`, `/public/testimonials`, `/public/news`) with real
   photography — the layout, `sizes`, and `fill` props are already wired for
   `next/image` optimization.
3. Wire `DonateSection` and `VolunteerCta`'s `handleSubmit` to your payment
   gateway / CRM endpoint (Razorpay recommended for 80G receipting in India).
4. Add `app/(routes)` pages for About, Our Work, Projects, Gallery, News,
   Contact — the Navbar and Footer already link to these paths.
5. Dark mode is wired via Tailwind's `class` strategy and dark tokens in
   `tailwind.config.ts` / `globals.css`; add a theme toggle where desired.

## Lighthouse notes

- `next/font` self-hosts Playfair Display + Inter (no render-blocking Google
  Fonts request).
- `next/image` handles AVIF/WEBP, responsive `sizes`, and lazy-loading below
  the fold automatically.
- Sections below the hero are code-split per-route by the App Router; no
  manual `dynamic()` needed unless you add heavy client-only widgets.
