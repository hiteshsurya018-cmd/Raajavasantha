import type { Metadata } from "next";
import About from "@/components/lovable-pages/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "Rajavasantha Welfare Trust was established in Bengaluru as a charitable trust for public, educational, cultural, welfare and charitable purposes.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <About />;
}
