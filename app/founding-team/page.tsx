import type { Metadata } from "next";
import FoundingTeam from "@/components/lovable-pages/founding-team";

export const metadata: Metadata = {
  title: "Founding Team",
  description:
    "The founding trustees entrusted with guiding Rajavasantha Welfare Trust, Bengaluru.",
  alternates: { canonical: "/founding-team" },
};

export default function FoundingTeamPage() {
  return <FoundingTeam />;
}
