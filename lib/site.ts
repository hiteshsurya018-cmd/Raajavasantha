import { Phone } from "lucide-react";

export const siteConfig = {
  name: "Rajavasantha Welfare Trust",
  shortName: "Rajavasantha",
  canonicalOrigin: "https://rajavasantha.org",

  description:
    "Rajavasantha Welfare Trust is a Bengaluru-based charitable trust preparing transparent community programmes across education, health, livelihoods, environment and relief.",

  phone: "+91 88612 49999",
  phoneHref: "tel:+918861249999",

  phoneNumbers: [
    {
      label: "Mobile",
      number: "+91 88612 49999",
      href: "tel:+918861249999",
    },
    {
      label: "Landline",
      number: "+91 80-23479369",
      href: "tel:+918023479369",
    },
  ],

  email: "info@rajavasanthatrust.org",

  location:
    "No.1516/B (46/3), 2nd Floor, RAJAVASANTHA, 8th Main Road, A Block, 2nd Stage, Rajajinagar, Bengaluru - 560010",

  foundingYear: 2026,
} as const;

export const publicFacts = {
  trustIndicators: [
    {
      label: "Registered charitable trust",
      sub: "Registration details pending public document upload",
    },
    {
      label: "Bengaluru based",
      sub: "Rajajinagar, Karnataka",
    },
    {
      label: "Founder led",
      sub: "Community service platform in setup",
    },
    {
      label: "Document first",
      sub: "Certifications shown only after verification",
    },
    {
      label: "Public reporting planned",
      sub: "Annual reports will be published when available",
    },
    {
      label: "Media archive in setup",
      sub: "Trust-controlled storage is planned",
    },
  ],

  foundingSnapshot: [
    { value: "2026", label: "Year established" },
    { value: "9", label: "Focus areas planned" },
    { value: "0", label: "Public projects completed" },
    { value: "0", label: "Published impact reports" },
  ],
} as const;