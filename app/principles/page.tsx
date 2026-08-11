import type { Metadata } from "next";
import Principles from "@/components/lovable-pages/principles";

export const metadata: Metadata = {
  title: "Principles",
  description:
    "The principles guiding Rajavasantha Welfare Trust - inclusion, human dignity, access to opportunity, community empowerment, education, health, environmental responsibility, sustainability, collaboration and responsible governance.",
  alternates: { canonical: "/principles" },
};

export default function PrinciplesPage() {
  return <Principles />;
}
