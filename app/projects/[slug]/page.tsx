import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProjectMediaGallery } from "@/components/projects/ProjectMediaGallery";
import {
  getProjectBySlug,
  getProjectDateLabel,
  getProjectLocationLabel,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      alternates: { canonical: `/projects/${slug}` },
    };
  }

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} | Rajavasantha Welfare Trust`,
      description: project.shortDescription,
      url: `/projects/${project.slug}`,
      images: project.coverImage
        ? [
            {
              url: project.coverImage.src,
              width: 1600,
              height: 1104,
              alt: project.coverImage.alt,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const hasCoordinates =
    typeof project.latitude === "number" &&
    typeof project.longitude === "number";

  return (
    <main className="min-h-screen bg-ivory">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-5 pb-16 pt-24 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:px-10 lg:pb-24 lg:pt-28">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-forest-soft uppercase transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>

          <h1 className="mt-8 font-display text-4xl leading-tight text-forest-deep">
            {project.title}
          </h1>

          <p className="eyebrow mt-10">Project record</p>
          <dl className="mt-6 divide-y divide-forest-deep/10 border-y border-forest-deep/10">
            <DetailMeta label="Category" value={project.category || "Pending"} />
            <DetailMeta
              label="Location"
              value={getProjectLocationLabel(project)}
            />
            <DetailMeta label="Date" value={getProjectDateLabel(project)} />
            <DetailMeta
              label="Coordinates"
              value={
                hasCoordinates
                  ? `${project.latitude}, ${project.longitude}`
                  : "Pending verification"
              }
            />
          </dl>
        </aside>

        <section aria-labelledby="project-photographs">
          <div className="flex items-end justify-between gap-4 border-b border-forest-deep/10 pb-5">
            <div>
              <p className="eyebrow">Photographs</p>
              <h2
                id="project-photographs"
                className="mt-3 font-display text-3xl text-forest-deep"
              >
                {project.gallery.length}{" "}
                {project.gallery.length === 1 ? "item" : "items"}
              </h2>
            </div>
          </div>

          {project.gallery.length > 0 ? (
            <ProjectMediaGallery media={project.gallery} />
          ) : (
            <div className="mt-6 border border-forest-deep/15 bg-card px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No photographs have been published for this project yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <dt className="text-[0.64rem] font-semibold tracking-[0.16em] text-gold uppercase">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {value}
      </dd>
    </div>
  );
}
