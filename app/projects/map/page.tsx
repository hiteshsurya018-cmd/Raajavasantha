import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectMap } from "@/components/projects/ProjectMap";
import { getMappableProjects, getProjects } from "@/lib/projects";

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
  const projects = await getProjects();
  const mappableProjects = getMappableProjects(projects);

  return (
    <>
      <section className="bg-forest-deep pt-36 pb-16 text-ivory lg:pt-44 lg:pb-20">
        <div className="mx-auto max-w-[80rem] px-5 lg:px-10">
          <Link
            href="/projects"
            className="mb-10 inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-gold uppercase transition-colors hover:text-gold-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>
          <p className="eyebrow">Project locations</p>
          <h1 className="display-lg mt-6 max-w-4xl text-ivory">
            A map for verified project records.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory/75">
            This view plots only records that include approved coordinates.
            Current mapped records: {mappableProjects.length}.
          </p>
        </div>
      </section>

      <ProjectMap projects={projects} />
    </>
  );
}
