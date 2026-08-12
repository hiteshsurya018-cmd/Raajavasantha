import { ExternalLink } from "lucide-react";
import { contact, mapsUrl } from "@/data/site";
import { ActionAnchor } from "./Action";

export function MapPreview() {
const latitude = 13.0074852;
const longitude = 77.5567491;

  const mapsEmbedUrl =
    `https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;

  return (
    <div className="grid overflow-hidden border border-forest-deep/12 bg-card md:grid-cols-2">
      {/* Actual Google Maps */}
      <div className="relative min-h-[420px] overflow-hidden">
        <iframe
          title="Rajavasantha Welfare Trust location"
          src={mapsEmbedUrl}
          width="100%"
          height="100%"
          style={{
            border: 0,
            minHeight: "420px",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Trust Information */}
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

          <span className="mt-3 block text-forest-soft">
            Landmark: {contact.landmark}
          </span>
        </address>

        <ActionAnchor
          href={mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          variant="outline"
          className="mt-8"
        >
          Open in Google Maps
          <ExternalLink className="h-4 w-4" />
        </ActionAnchor>
      </div>
    </div>
  );
}