import type { TrustProject } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

export function ProjectDiscovery({
  projects,
  featuredProjects,
}: {
  projects: TrustProject[];
  featuredProjects: TrustProject[];
}) {
  return (
    <section className="bg-ivory" id="project-discovery">
      <div className="mx-auto max-w-[80rem] px-5 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-28">
        {featuredProjects.length > 0 && (
          <div className="mt-16 border-y border-forest-deep/10 py-12 lg:py-16">
            <p className="eyebrow">Featured projects</p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        )}

        <div className={featuredProjects.length > 0 ? "mt-16" : "mt-12"}>
          <p className="eyebrow">All projects</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-y border-forest-deep/10 py-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {projects.length}{" "}
            {projects.length === 1 ? "record" : "records"} shown
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-forest-deep/15 bg-card px-6 py-14 text-center">
            <p className="eyebrow-plain">No records yet</p>
            <h3 className="mt-4 font-display text-3xl text-forest-deep">
              Project records will appear here.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Verified project records will be added to the archive as the Trust publishes them.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
