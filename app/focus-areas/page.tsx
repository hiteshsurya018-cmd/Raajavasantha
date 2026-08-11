import type { Metadata } from "next";
import FocusAreas from "@/components/lovable-pages/focus-areas";

export const metadata: Metadata = {
  title: "Our Focus Areas",
  description:
    "Twelve focus areas drawn from the Rajavasantha Welfare Trust Deed - education, healthcare, nutrition, community and rural development, renewable energy, environment, sports, elderly care, animal welfare and disaster relief.",
  alternates: { canonical: "/focus-areas" },
};

export default function FocusAreasPage() {
  return <FocusAreas />;
}
