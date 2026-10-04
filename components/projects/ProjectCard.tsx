import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { TrustProject } from "@/data/projects";
import {
  getProjectDateLabel,
  getProjectLocationLabel,
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
        "group border border-forest-deep/15 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_45px_color-mix(in_oklab,var(--forest-deep)_10%,transparent)]",
        className,
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-square overflow-hidden bg-forest-deep/10"
        aria-label={`View project: ${project.title}`}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
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

        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-forest-deep/95 via-forest-deep/15 to-transparent p-4">
          <p className="text-[0.58rem] font-semibold tracking-[0.16em] text-gold uppercase">
            {project.category || "Project"}
          </p>
          <h3 className="mt-2 line-clamp-2 font-display text-xl leading-tight text-ivory">
            {project.title}
          </h3>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.62rem] text-ivory/75">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gold" aria-hidden="true" />
              {getProjectLocationLabel(project)}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-gold" aria-hidden="true" />
              {getProjectDateLabel(project)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
