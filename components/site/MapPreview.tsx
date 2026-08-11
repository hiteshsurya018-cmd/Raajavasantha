import { MapPin, ExternalLink } from "lucide-react";
import { contact, mapsUrl } from "@/data/site";
import { ActionAnchor } from "./Action";

export function MapPreview() {
  return (
    <div className="grid overflow-hidden border border-forest-deep/12 bg-card md:grid-cols-2">
      <div
        className="relative min-h-64 bg-forest-deep"
        role="img"
        aria-label="Illustrative map marker for the Trust office in Rajajinagar, Bengaluru"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklab, var(--gold) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--gold) 60%, transparent) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-gold/30"
        />
        <div aria-hidden="true" className="absolute inset-y-0 left-1/3 w-px bg-gold/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/50">
            <MapPin className="h-6 w-6 text-gold" />
          </span>
          <p className="font-display text-xl text-ivory">Rajajinagar, Bengaluru</p>
          <p className="text-xs tracking-[0.2em] text-ivory/60 uppercase">Karnataka, India</p>
        </div>
      </div>

      <div className="p-8 lg:p-12">
        <p className="eyebrow">Visit the Trust</p>
        <h3 className="mt-5 font-display text-2xl text-forest-deep">
          Rajavasantha Welfare Trust
        </h3>
        <address className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground not-italic">
          {contact.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="mt-3 block text-forest-soft">Landmark: {contact.landmark}</span>
        </address>
        <ActionAnchor
          href={mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          variant="outline"
          className="mt-8"
        >
          Open in Google Maps <ExternalLink className="h-4 w-4" />
        </ActionAnchor>
      </div>
    </div>
  );
}
