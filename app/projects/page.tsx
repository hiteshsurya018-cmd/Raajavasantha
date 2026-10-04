import type { Metadata } from "next";
import { ProjectDiscovery } from "@/components/projects/ProjectDiscovery";
import {
  getProjectFacets,
  getProjects,
} from "@/lib/projects";
import { lovableAssets } from "@/lib/lovable-assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore the Rajavasantha Welfare Trust project archive as verified initiatives, locations, photographs and impact records are published.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Rajavasantha Welfare Trust",
    description:
      "A verified project archive for Rajavasantha Welfare Trust initiatives and future public impact records.",
    url: "/projects",
    images: [
      {
        url: lovableAssets.community.url,
        width: 1600,
        height: 1104,
        alt: "Rajavasantha Welfare Trust project archive",
      },
    ],
  },
};

export default async function ProjectsPage() {
  const [projects, facets] = await Promise.all([
    getProjects(),
    getProjectFacets(),
  ]);
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <ProjectDiscovery
      projects={projects}
      featuredProjects={featuredProjects}
      facets={facets}
    />
  );
}
