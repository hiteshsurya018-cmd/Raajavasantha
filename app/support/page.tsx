import type { Metadata } from "next";
import Support from "@/components/lovable-pages/support";

export const metadata: Metadata = {
  title: "Support the Trust",
  description:
    "Support Rajavasantha Welfare Trust through contributions, volunteering or collaboration. Send a support enquiry to the Trust in Bengaluru.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return <Support />;
}
