import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Work", href: "/work" },
  { name: "Projects", href: "/projects" },
  { name: "Gallery", href: "/gallery" },
];

const OTHER_LINKS = [
  { name: "News & Events", href: "/news" },
  { name: "Documents", href: "/documents" },
  { name: "Donate", href: "/donate" },
  { name: "Volunteer", href: "/volunteer" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 text-canvas/80">
      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/logo.jpeg"
            alt="Rajavasantha Welfare Trust"
            width={72}
            height={72}
            className="h-16 w-16 rounded-full object-cover"
          />
          <p className="mt-4 font-display text-xl font-bold text-canvas">Rajavasantha</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-secondary">Welfare Trust</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Service is our duty, society is our family. Registered charitable trust
            serving Karnataka since 2026.
          </p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas/20 transition-colors hover:border-secondary hover:text-secondary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Quick Links" links={QUICK_LINKS} />
        <FooterCol title="Other Links" links={OTHER_LINKS} />

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
            Contact
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              #46/J (51), 8th Main, A Block, 2nd Stage, Rajajinagar, Bengaluru — 560010
            </li>
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-secondary" /> +91 89719 93133
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-secondary" /> info@rajavasanthawelfaretrust.org
            </li>
          </ul>
          <div className="mt-5 h-28 w-full overflow-hidden rounded-xl border border-canvas/10 bg-canvas/5" aria-label="Map location" />
        </div>
      </div>

      <div className="border-t border-canvas/10 py-6">
        <p className="container text-center text-xs text-canvas/50">
          &copy; {new Date().getFullYear()} Rajavasantha Welfare Trust (R). All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
        {title}
      </h4>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.name}>
            <Link href={l.href} className="text-sm transition-colors hover:text-secondary">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
