"use client";

import dynamic from "next/dynamic";
import type { TrustProject } from "@/data/projects";

const LeafletProjectMap = dynamic(
  () =>
    import("./LeafletProjectMap").then(
      (module) => module.LeafletProjectMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[32rem] items-center justify-center bg-forest-deep text-ivory">
        Loading project map…
      </div>
    ),
  },
);

export function ProjectMap({
  projects,
}: {
  projects: TrustProject[];
}) {
  return <LeafletProjectMap projects={projects} />;
}