import type { Metadata } from "next";
import { LaunchGate } from "@/components/launch/LaunchGate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Launching Soon",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LaunchPage() {
  return <LaunchGate now={Date.now()} />;
}
