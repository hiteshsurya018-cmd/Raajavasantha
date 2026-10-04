import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectMap } from "@/components/projects/ProjectMap";
import { getPublicMapGeoJson } from "@/lib/geography";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Map",
  description:
    "View Rajavasantha Welfare Trust project locations after verified coordinates are published.",
  alternates: { canonical: "/projects/map" },
  openGraph: {
    title: "Project Map | Rajavasantha Welfare Trust",
    description:
      "A location view for verified Rajavasantha Welfare Trust project records.",
    url: "/projects/map",
  },
};

export default async function ProjectsMapPage() {
  const data = await getPublicMapGeoJson();

  return (
    <>
      <section className="bg-forest-deep pt-32 pb-12 text-ivory lg:pt-40 lg:pb-16">
        <div className="mx-auto max-w-[80rem] px-5 lg:px-10">
          <Link
            href="/projects"
            className="mb-10 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-gold uppercase transition-colors hover:text-gold-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>
          <p className="eyebrow">Our reach across India</p>
          <h1 className="display-lg mt-6 max-w-4xl text-ivory">
            Every location represents a story.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">
            Explore verified activities, contributions and communities through locations approved by the Trust for public display.
          </p>
        </div>
      </section>

      <ProjectMap data={data} />
    </>
  );
}
