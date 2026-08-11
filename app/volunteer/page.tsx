import type { Metadata } from "next";
import Volunteer from "@/components/lovable-pages/volunteer";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Join the volunteer network of Rajavasantha Welfare Trust, Bengaluru. Register your interest to contribute time, skills and local knowledge as initiatives develop.",
  alternates: { canonical: "/volunteer" },
};

export default function VolunteerPage() {
  return <Volunteer />;
}
