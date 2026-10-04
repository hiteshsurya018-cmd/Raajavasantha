import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import {
  getProjectBySlug,
  getProjectDateLabel,
  getProjectLocationLabel,
  getRelatedProjects,
  getStatusLabel,
} from "@/lib/projects";
import { isAdmin } from "@/lib/auth/admin-session";

export const dynamic = "force-dynamic";

type ProjectDetailProps = {
  params: Promise<{
    slug: string;
  }>;
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

  const relatedProjects = await getRelatedProjects(project);
  const admin = await isAdmin();
  const hasCoordinates =
    typeof project.latitude === "number" && typeof project.longitude === "number";

  return (
    <>
      <section className="relative isolate min-h-[78svh] overflow-hidden bg-forest-deep text-ivory">
        {project.coverImage ? (
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
        ) : (
          <div className="absolute inset-0 bg-forest-deep" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_oklab,var(--forest-deep)_96%,transparent)_0%,color-mix(in_oklab,var(--forest-deep)_82%,transparent)_48%,color-mix(in_oklab,var(--forest-deep)_42%,transparent)_100%)]"
        />

        <div className="relative mx-auto flex min-h-[78svh] max-w-[80rem] flex-col justify-end px-5 pt-40 pb-16 lg:px-10 lg:pt-48 lg:pb-24">
          <Link
            href="/projects"
            className="mb-10 inline-flex w-fit items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-gold uppercase transition-colors hover:text-gold-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to projects
          </Link>
          <p className="eyebrow">{project.category}</p>
          <h1 className="display-xl mt-6 max-w-4xl text-ivory">
            {project.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/80">
            {project.shortDescription}
          </p>
          <dl className="mt-10 flex flex-wrap gap-3 text-[0.72rem] font-semibold tracking-[0.12em] text-ivory/80 uppercase">
            <div className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2">
              <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd>{getProjectLocationLabel(project)}</dd>
            </div>
            <div className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2">
              <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
              <dt className="sr-only">Date</dt>
              <dd>{getProjectDateLabel(project)}</dd>
            </div>
            <div className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2">
              <dt className="sr-only">Status</dt>
              <dd>{getStatusLabel(project.status)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[80rem] gap-12 px-5 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:px-10 lg:py-24">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Project record</p>
            <dl className="mt-8 divide-y divide-forest-deep/10 border-y border-forest-deep/10">
              <DetailMeta label="Category" value={project.category} />
              <DetailMeta label="Location" value={getProjectLocationLabel(project)} />
              <DetailMeta label="Date" value={getProjectDateLabel(project)} />
              <DetailMeta label="Status" value={getStatusLabel(project.status)} />
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

          <div>
            <h2 className="display-lg text-forest-deep">Project overview</h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              <section>
                <p className="eyebrow-plain">Objectives</p>
                <ul className="mt-6 space-y-3">
                  {project.objectives.map((objective) => (
                    <li
                      key={objective}
                      className="flex gap-3 border-b border-forest-deep/10 pb-3 text-[0.95rem] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                      />
                      {objective}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="eyebrow-plain">Impact metrics</p>
                <dl className="mt-6 grid gap-px border border-forest-deep/10 bg-forest-deep/10">
                  {project.impactMetrics.map((metric) => (
                    <div key={metric.label} className="bg-card p-5">
                      <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-forest-soft uppercase">
                        {metric.label}
                      </dt>
                      <dd className="mt-2 font-display text-3xl text-forest-deep">
                        {metric.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {project.beneficiaries && (
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {project.beneficiaries}
                  </p>
                )}
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-forest-deep/10 bg-card">
        <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2 className="display-lg mt-6 text-forest-deep">
                Photographs and field documentation.
              </h2>
            </div>
            {admin && (
              <Link href={`/admin/projects/${project.slug}/import-images`} className="inline-flex w-fit border border-forest-deep/20 px-5 py-3 text-xs font-semibold tracking-[0.12em] text-forest-deep uppercase">
                Import images
              </Link>
            )}
          </div>

          {project.gallery.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {project.gallery.map((image) => (
                <figure
                  key={`${image.src}-${image.alt}`}
                  className="border border-forest-deep/10 bg-ivory"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    {image.resourceType === "video" ? (
                      <video controls preload="metadata" playsInline aria-label={image.alt} className="h-full w-full object-contain">
                        <source src={image.src} type={image.mimeType ?? "video/mp4"} />
                      </video>
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  {image.caption && (
                    <figcaption className="p-4 text-xs leading-relaxed text-muted-foreground">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="border border-forest-deep/15 bg-ivory px-6 py-12 text-center">
              <p className="eyebrow-plain">Gallery pending</p>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Project photographs will be added after approved images and alt
                text are available.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[80rem] gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="eyebrow">Location</p>
            <h2 className="display-lg mt-6 text-forest-deep">
              Mapped after coordinate verification.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
              Project maps use only approved coordinates from the project data
              layer. Records without coordinates remain unpublished on the map.
            </p>
          </div>

          <div className="min-h-[22rem] border border-forest-deep/15 bg-forest-deep p-8 text-ivory">
            {hasCoordinates ? (
              <div className="flex h-full flex-col justify-between">
                <div>
                  <p className="eyebrow-plain">Verified coordinates</p>
                  <p className="mt-4 font-display text-3xl text-ivory">
                    {project.latitude}, {project.longitude}
                  </p>
                </div>
                <Link
                  href="/projects/map"
                  className="mt-8 inline-flex w-fit items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] text-gold uppercase hover:text-gold-soft"
                >
                  Open project map
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <p className="eyebrow-plain">Coordinates pending</p>
                <h3 className="mt-5 font-display text-3xl text-ivory">
                  This record is not displayed as a map marker yet.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/70">
                  Add verified latitude and longitude values to the project
                  record when the Trust approves location publication.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {project.references && project.references.length > 0 && (
        <section className="bg-card">
          <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10">
            <p className="eyebrow">References</p>
            <div className="mt-8 grid gap-3">
              {project.references.map((reference) => (
                <a
                  key={reference.href}
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-forest-deep hover:text-gold"
                >
                  {reference.label}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-forest-deep text-ivory">
        <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Related projects</p>
              <h2 className="display-lg mt-6 text-ivory">
                More records from the archive.
              </h2>
            </div>
            <Link
              href="/projects"
              className="link-underline font-medium text-gold"
            >
              Back to all projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {relatedProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {relatedProjects.map((relatedProject) => (
                <ProjectCard key={relatedProject.slug} project={relatedProject} />
              ))}
            </div>
          ) : (
            <div className="border border-ivory/15 p-8">
              <p className="text-sm leading-relaxed text-ivory/70">
                Additional related project records will appear here after the
                archive contains more verified entries.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function DetailMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] lg:grid-cols-1">
      <dt className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold uppercase">
        {label}
      </dt>
      <dd className="text-sm leading-relaxed text-muted-foreground">{value}</dd>
    </div>
  );
}
