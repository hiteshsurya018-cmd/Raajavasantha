import Link from "next/link";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { contact, mapsUrl } from "@/data/site";
import { lovableAssets } from "@/lib/lovable-assets";

const logo = lovableAssets.logo;

const columns = [
  {
    heading: "Quick Links",
    links: [
      { label: "About", to: "/about" },
      { label: "Our Focus Areas", to: "/focus-areas" },
      { label: "Principles", to: "/principles" },
      { label: "Support", to: "/support" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Support the Trust", to: "/support" },
      { label: "Volunteer", to: "/volunteer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-forest-deep text-ivory">
      <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr] lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ivory">
                <img
                  src={logo.url}
                  alt="Rajavasantha Welfare Trust emblem"
                  width={40}
                  height={36}
                  loading="lazy"
                  className="h-9 w-auto"
                />
              </span>
              <span className="font-display text-xl tracking-[0.14em] uppercase">
                Rajavasantha
                <span className="block text-[0.55rem] tracking-[0.34em] text-gold">
                  Welfare Trust
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/70">
              Working towards inclusive social development through education, healthcare,
              community welfare, environmental sustainability and humanitarian action.
            </p>
            <Link
              href="/founding-team"
              className="link-underline mt-6 inline-flex text-sm font-medium text-gold"
            >
              Meet our Founding Team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="eyebrow-plain">{col.heading}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.to}
                      className="text-sm text-ivory/75 transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h2 className="eyebrow-plain">Contact</h2>

<a
  href={`mailto:${contact.email}`}
  className="mt-5 inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors hover:text-gold"
>
  <Mail className="h-4 w-4 text-gold" />
  {contact.email}
</a>

<a
  href="tel:+91 8861249999"
  className="mt-3 inline-flex items-center gap-2 text-sm text-ivory/80 transition-colors hover:text-gold"
>
  ☏ +91 8861249999
</a>

            <h2 className="eyebrow-plain mt-8">Office</h2>
            <address className="mt-5 flex gap-2 text-sm leading-relaxed text-ivory/75 not-italic">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {contact.addressLines.join(", ")}
                <span className="mt-1 block text-ivory/55">
                  Landmark: {contact.landmark}
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline mt-3 inline-flex text-gold"
                >
                  Open in Google Maps
                </a>
              </span>
            </address>
          </div>
        </div>


        <p className="mt-12 border-t border-ivory/15 pt-8 text-xs tracking-[0.08em] text-ivory/50">
          © 2026 Rajavasantha Welfare Trust. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
