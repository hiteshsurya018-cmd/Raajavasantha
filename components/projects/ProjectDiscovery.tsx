"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Map, Search, SlidersHorizontal, X } from "lucide-react";
import type { TrustProject } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

type ProjectFacets = {
  categories: string[];
  locations: string[];
  years: string[];
};

const allValue = "all";

export function ProjectDiscovery({
  projects,
  facets,
}: {
  projects: TrustProject[];
  facets: ProjectFacets;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allValue);
  const [location, setLocation] = useState(allValue);
  const [year, setYear] = useState(allValue);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const searchText = [
        project.title,
        project.shortDescription,
        project.description,
        project.category,
        project.location,
        project.district,
        project.state,
        project.country,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!normalizedQuery || searchText.includes(normalizedQuery)) &&
        (category === allValue || project.category === category) &&
        (location === allValue || project.location === location) &&
        (year === allValue || String(project.year) === year)
      );
    });
  }, [category, location, projects, query, year]);

  const hasActiveFilters =
    Boolean(query.trim()) ||
    category !== allValue ||
    location !== allValue ||
    year !== allValue;

  function resetFilters() {
    setQuery("");
    setCategory(allValue);
    setLocation(allValue);
    setYear(allValue);
  }

  return (
    <section className="bg-ivory" id="project-discovery">
      <div className="mx-auto max-w-[80rem] px-5 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="eyebrow">Discover</p>
            <h2 className="display-lg mt-6 text-forest-deep">
              Search the project archive.
            </h2>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-muted-foreground">
              Explore verified initiatives by focus area, location and year as
              the Trust publishes project records.
            </p>
            <Link
              href="/projects/map"
              className="link-underline mt-8 inline-flex font-medium text-forest-deep"
            >
              Open project map
              <Map className="h-4 w-4 text-gold" aria-hidden="true" />
            </Link>
          </div>

          <div className="border border-forest-deep/15 bg-card p-5 lg:p-6">
            <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.18em] text-forest-soft uppercase">
              <SlidersHorizontal className="h-4 w-4 text-gold" aria-hidden="true" />
              Filters
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="sr-only">Search projects</span>
                <span className="relative block">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold"
                    aria-hidden="true"
                  />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by project, place or focus area"
                    className="h-12 w-full border border-forest-deep/15 bg-ivory pl-11 pr-4 text-sm text-forest-deep placeholder:text-muted-foreground/70 focus:border-gold"
                  />
                </span>
              </label>

              <FilterSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={facets.categories}
              />
              <FilterSelect
                label="Location"
                value={location}
                onChange={setLocation}
                options={facets.locations}
              />
              <FilterSelect
                label="Year"
                value={year}
                onChange={setYear}
                options={facets.years}
              />

              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className="flex h-12 items-center justify-center gap-2 border border-forest-deep/15 px-4 text-[0.7rem] font-semibold tracking-[0.14em] text-forest-deep uppercase transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-45"
              >
                <X className="h-4 w-4 text-gold" aria-hidden="true" />
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-y border-forest-deep/10 py-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "record" : "records"} shown
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[0.7rem] font-semibold tracking-[0.16em] text-forest-soft uppercase transition-colors hover:text-forest-deep"
            >
              Reset search
            </button>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-forest-deep/15 bg-card px-6 py-14 text-center">
            <p className="eyebrow-plain">No matching records</p>
            <h3 className="mt-4 font-display text-3xl text-forest-deep">
              No project records match the current filters.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Try a broader search, or return after verified project records
              have been added to the archive.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-8 inline-flex min-h-11 items-center justify-center border border-forest-deep/25 px-6 py-3 text-[0.72rem] font-semibold tracking-[0.16em] text-forest-deep uppercase transition-colors hover:border-gold hover:text-forest"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-2 block text-[0.65rem] font-semibold tracking-[0.16em] text-forest-soft uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-forest-deep/15 bg-ivory px-4 text-sm text-forest-deep focus:border-gold"
      >
        <option value={allValue}>All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
