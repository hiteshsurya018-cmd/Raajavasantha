import type { Metadata } from "next";
import Contact from "@/components/lovable-pages/contact";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Rajavasantha Welfare Trust - Rajajinagar, Bengaluru 560 010, Karnataka. Write to info@rajavasanthatrust.org.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
