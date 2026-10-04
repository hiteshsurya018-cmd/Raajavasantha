import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Map } from "lucide-react";
import { ProjectDiscovery } from "@/components/projects/ProjectDiscovery";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  getFeaturedProject,
  getProjectArchiveStats,
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
  const [projects, featuredProject, stats, facets] = await Promise.all([
    getProjects(),
    getFeaturedProject(),
    getProjectArchiveStats(),
    getProjectFacets(),
  ]);

  return (
    <>
      <section className="relative isolate min-h-[78svh] overflow-hidden bg-forest-deep text-ivory">
        <Image
          src={lovableAssets.community.url}
          alt="Community members gathered for a welfare discussion"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--forest-deep)_95%,transparent)_0%,color-mix(in_oklab,var(--forest-deep)_78%,transparent)_48%,color-mix(in_oklab,var(--forest-deep)_45%,transparent)_100%)]"
        />

        <div className="relative mx-auto flex min-h-[78svh] max-w-[80rem] flex-col justify-end px-5 pt-40 pb-16 lg:px-10 lg:pt-48 lg:pb-24">
          <p className="eyebrow">Our work</p>
          <h1 className="display-xl mt-6 max-w-4xl text-ivory">
            Turning intention
            <span className="block text-gold-soft">into lasting impact.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/80">
            Rajavasantha Welfare Trust works across communities and locations
            through focused initiatives. This archive is designed to publish
            verified project records, photographs, impact notes and locations
            as the Trust&apos;s work develops.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#project-discovery"
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-gold px-6 py-3 text-[0.78rem] font-semibold tracking-[0.16em] text-forest-deep uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-soft"
            >
              Explore projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/projects/map"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-ivory/40 px-6 py-3 text-[0.78rem] font-semibold tracking-[0.16em] text-ivory uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
            >
              View map
              <Map className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-forest-deep/10 bg-card">
        <div className="mx-auto max-w-[80rem] px-5 py-12 lg:px-10">
          <dl className="grid gap-px overflow-hidden border border-forest-deep/10 bg-forest-deep/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card p-6 lg:p-8">
                <dt className="text-[0.68rem] font-semibold tracking-[0.18em] text-forest-soft uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-4 font-display text-4xl text-forest-deep">
                  {stat.value}
                </dd>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stat.note}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {featuredProject && (
        <section className="bg-ivory">
          <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-24">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">Featured record</p>
                <h2 className="display-lg mt-6 max-w-2xl text-forest-deep">
                  A project archive built for verified public records.
                </h2>
              </div>
              <Link
                href="/projects/map"
                className="link-underline font-medium text-forest-deep"
              >
                See location map
                <Map className="h-4 w-4 text-gold" aria-hidden="true" />
              </Link>
            </div>

            <ProjectCard
              project={featuredProject}
              priority
              className="lg:grid lg:grid-cols-[0.95fr_1.05fr]"
            />
          </div>
        </section>
      )}

      <ProjectDiscovery projects={projects} facets={facets} />
    </>
  );
}
