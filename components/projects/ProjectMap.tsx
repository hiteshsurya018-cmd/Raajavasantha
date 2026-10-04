"use client";

import dynamic from "next/dynamic";
import type { MapFeatureCollection } from "@/lib/geography";

const MapLibreImpactMap = dynamic(
  () =>
    import("./MapLibreImpactMap").then(
      (module) => module.MapLibreImpactMap,
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
  data,
}: {
  data: MapFeatureCollection;
}) {
  return <MapLibreImpactMap data={data} />;
}
