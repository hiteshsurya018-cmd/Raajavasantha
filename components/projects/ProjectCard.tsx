import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { TrustProject } from "@/data/projects";
import {
  getProjectDateLabel,
  getProjectLocationLabel,
  getStatusLabel,
} from "@/lib/project-format";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  priority = false,
  className,
}: {
  project: TrustProject;
  priority?: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col border border-forest-deep/15 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_24px_60px_color-mix(in_oklab,var(--forest-deep)_10%,transparent)]",
        className,
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-forest-deep/10"
        aria-label={`View project: ${project.title}`}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-105",
              project.isPlaceholder && "opacity-75 grayscale-[0.15]",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-forest-deep/10 px-8 text-center text-sm text-muted-foreground">
            Project image pending
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-forest-deep/80 to-transparent px-5 pt-16 pb-4">
          <span className="text-[0.65rem] font-semibold tracking-[0.18em] text-gold uppercase">
            {project.category}
          </span>
          {project.isPlaceholder && (
            <span className="border border-ivory/35 px-2 py-1 text-[0.58rem] font-semibold tracking-[0.14em] text-ivory uppercase">
              Placeholder
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="flex flex-wrap gap-3 text-[0.72rem] font-medium tracking-[0.08em] text-forest-soft uppercase">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {getProjectLocationLabel(project)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {getProjectDateLabel(project)}
          </span>
        </div>

        <h3 className="mt-5 font-display text-2xl leading-tight text-forest-deep">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-6 border-t border-forest-deep/10 pt-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium text-forest-soft">
              {getStatusLabel(project.status)}
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-forest-deep uppercase transition-colors hover:text-gold"
            >
              View project
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
