import "server-only";

import { sql } from "@/lib/db";
import type { TrustProject } from "@/data/projects";
import {
  getProjectDateLabel,
  getProjectLocationLabel,
  getStatusLabel,
} from "@/lib/project-format";

export {
  getProjectDateLabel,
  getProjectLocationLabel,
  getStatusLabel,
};

export type ProjectArchiveStat = {
  label: string;
  value: string;
  note: string;
  pending?: boolean;
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  location: string;
  district: string | null;
  state: string | null;
  country: string;
  latitude: number | string | null;
  longitude: number | string | null;
  year: number | null;
  start_date: string | null;
  end_date: string | null;
  cover_image: string | null;
  cover_image_alt: string | null;
  status: TrustProject["status"];
  featured: boolean;
  is_public: boolean;
  beneficiaries: string | null;
  created_at: string;
  updated_at: string;
};

type ObjectiveRow = {
  project_id: string;
  objective: string;
  sort_order: number;
};

type ImpactMetricRow = {
  project_id: string;
  label: string;
  value: string;
  pending: boolean;
  sort_order: number;
};

type GalleryImageRow = {
  project_id: string;
  src: string;
  alt: string;
  caption: string | null;
  source: string;
  sort_order: number;
  resource_type: string | null;
  mime_type: string | null;
};

type ReferenceRow = {
  project_id: string;
  label: string;
  href: string;
  sort_order: number;
};

function compareProjects(a: TrustProject, b: TrustProject) {
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }

  const aYear = typeof a.year === "number" ? a.year : 0;
  const bYear = typeof b.year === "number" ? b.year : 0;

  return bYear - aYear || a.title.localeCompare(b.title);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function toNumberOrNull(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function mapImageSource(
  source: string,
): "local" | "google-photos" | "external" {
  if (source === "google-photos") {
    return "google-photos";
  }

  if (source === "external") {
    return "external";
  }

  return "local";
}

function mapProject(
  row: ProjectRow,
  objectives: ObjectiveRow[],
  impactMetrics: ImpactMetricRow[],
  gallery: GalleryImageRow[],
  references: ReferenceRow[],
): TrustProject {
  const latitude = toNumberOrNull(row.latitude);
  const longitude = toNumberOrNull(row.longitude);

  const mappedGallery = [...gallery]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => ({
      src: image.src,
      alt: image.alt,
      caption: image.caption ?? undefined,
      source: mapImageSource(image.source),
      resourceType: image.resource_type === "video" ? "video" as const : "image" as const,
      mimeType: image.mime_type ?? undefined,
    }));

  const coverImage = row.cover_image
    ? {
        src: row.cover_image,
        alt:
          row.cover_image_alt ??
          `${row.title} — Rajavasantha Welfare Trust`,
        source: "local" as const,
      }
    : mappedGallery.find((item) => item.resourceType !== "video") ?? null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,

    location: row.location,
    district: row.district ?? undefined,
    state: row.state ?? undefined,
    country: row.country,

    latitude,
    longitude,

    year: row.year ?? "Pending",

    startDate: row.start_date,
    endDate: row.end_date,

    coverImage,

    status: row.status,
    featured: row.featured,

    objectives: [...objectives]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.objective),

    impactMetrics: [...impactMetrics]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        label: item.label,
        value: item.value,
        pending: item.pending,
      })),

    beneficiaries: row.beneficiaries ?? undefined,

    gallery: mappedGallery,

    references: [...references]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((reference) => ({
        label: reference.label,
        href: reference.href,
      })),

    createdAt: row.created_at,
    updatedAt: row.updated_at,

    isPlaceholder:
      row.slug === "verified-project-record-pending" ||
      row.status === "pending",
  };
}

async function loadProjectsFromDatabase(): Promise<TrustProject[]> {
  const projectRows = (await sql`
    SELECT
      id,
      slug,
      title,
      description,
      short_description,
      category,
      location,
      district,
      state,
      country,
      latitude,
      longitude,
      year,
      start_date,
      end_date,
      cover_image,
      cover_image_alt,
      status,
      featured,
      is_public,
      beneficiaries,
      created_at,
      updated_at
    FROM projects
    WHERE is_public = true
    ORDER BY
      featured DESC,
      year DESC NULLS LAST,
      title ASC
  `) as ProjectRow[];

  if (projectRows.length === 0) {
    return [];
  }

  const [objectiveRows, impactMetricRows, galleryRows, referenceRows] =
    await Promise.all([
      sql`
        SELECT
          project_id,
          objective,
          sort_order
        FROM project_objectives
        ORDER BY sort_order ASC
      ` as PromiseLike<unknown>,

      sql`
        SELECT
          project_id,
          label,
          value,
          pending,
          sort_order
        FROM project_impact_metrics
        ORDER BY sort_order ASC
      ` as PromiseLike<unknown>,

      sql`
        SELECT
          project_id,
          src,
          alt,
          caption,
          source,
          sort_order,
          resource_type,
          mime_type
    FROM project_gallery_images
    WHERE approved = true
    ORDER BY sort_order ASC
      ` as PromiseLike<unknown>,

      sql`
        SELECT
          project_id,
          label,
          href,
          sort_order
        FROM project_references
        ORDER BY sort_order ASC
      ` as PromiseLike<unknown>,
    ]);

  const objectives = (await objectiveRows) as ObjectiveRow[];
  const impactMetrics = (await impactMetricRows) as ImpactMetricRow[];
  const gallery = (await galleryRows) as GalleryImageRow[];
  const references = (await referenceRows) as ReferenceRow[];

  return projectRows
    .map((project) =>
      mapProject(
        project,
        objectives.filter((item) => item.project_id === project.id),
        impactMetrics.filter((item) => item.project_id === project.id),
        gallery.filter((item) => item.project_id === project.id),
        references.filter((item) => item.project_id === project.id),
      ),
    )
    .sort(compareProjects);
}

export async function getProjects(): Promise<TrustProject[]> {
  return loadProjectsFromDatabase();
}

export async function getProjectBySlug(
  slug: string,
  includePrivate = false,
): Promise<TrustProject | null> {
  const projectRows = (await sql`
    SELECT
      id,
      slug,
      title,
      description,
      short_description,
      category,
      location,
      district,
      state,
      country,
      latitude,
      longitude,
      year,
      start_date,
      end_date,
      cover_image,
      cover_image_alt,
      status,
      featured,
      is_public,
      beneficiaries,
      created_at,
      updated_at
    FROM projects
    WHERE slug = ${slug}
      AND (${includePrivate} = true OR is_public = true)
    LIMIT 1
  `) as ProjectRow[];

  if (projectRows.length === 0) {
    return null;
  }

  const project = projectRows[0];

  const [objectivesResult, impactResult, galleryResult, referencesResult] =
    await Promise.all([
      sql`
        SELECT
          project_id,
          objective,
          sort_order
        FROM project_objectives
        WHERE project_id = ${project.id}
        ORDER BY sort_order ASC
      `,

      sql`
        SELECT
          project_id,
          label,
          value,
          pending,
          sort_order
        FROM project_impact_metrics
        WHERE project_id = ${project.id}
        ORDER BY sort_order ASC
      `,

      sql`
        SELECT
          project_id,
          src,
          alt,
          caption,
          source,
          sort_order,
          resource_type,
          mime_type
        FROM project_gallery_images
        WHERE project_id = ${project.id}
          AND approved = true
        ORDER BY sort_order ASC
      `,

      sql`
        SELECT
          project_id,
          label,
          href,
          sort_order
        FROM project_references
        WHERE project_id = ${project.id}
        ORDER BY sort_order ASC
      `,
    ]);

  return mapProject(
    project,
    objectivesResult as ObjectiveRow[],
    impactResult as ImpactMetricRow[],
    galleryResult as GalleryImageRow[],
    referencesResult as ReferenceRow[],
  );
}

export async function getProjectSlugs(): Promise<string[]> {
  const result = (await sql`
    SELECT slug
    FROM projects
    WHERE is_public = true
    ORDER BY
      featured DESC,
      year DESC NULLS LAST,
      title ASC
  `) as { slug: string }[];

  return result.map((project) => project.slug);
}

export async function getFeaturedProject(): Promise<TrustProject | null> {
  const allProjects = await getProjects();

  return (
    allProjects.find((project) => project.featured) ??
    allProjects[0] ??
    null
  );
}

export async function getRelatedProjects(
  project: TrustProject,
  limit = 3,
): Promise<TrustProject[]> {
  const allProjects = await getProjects();

  return allProjects
    .filter((candidate) => candidate.slug !== project.slug)
    .sort((a, b) => {
      const categoryMatch =
        Number(b.category === project.category) -
        Number(a.category === project.category);

      return categoryMatch || compareProjects(a, b);
    })
    .slice(0, limit);
}

export async function getProjectFacets() {
  const allProjects = await getProjects();

  return {
    categories: unique(
      allProjects.map((project) => project.category),
    ),

    locations: unique(
      allProjects.map((project) => project.location),
    ),

    years: unique(
      allProjects.map((project) => String(project.year)),
    ),
  };
}

export async function getProjectArchiveStats(): Promise<
  ProjectArchiveStat[]
> {
  const allProjects = await getProjects();

  const verifiedProjects = allProjects.filter(
    (project) => !project.isPlaceholder,
  );

  const verifiedWithCoordinates = verifiedProjects.filter(
    (project) =>
      typeof project.latitude === "number" &&
      typeof project.longitude === "number",
  );

  if (verifiedProjects.length === 0) {
    return [
      {
        label: "Projects",
        value: "Pending",
        note: "Awaiting verified project records",
        pending: true,
      },
      {
        label: "Communities reached",
        value: "Pending",
        note: "Will be published after verification",
        pending: true,
      },
      {
        label: "People impacted",
        value: "Pending",
        note: "No public impact count has been approved",
        pending: true,
      },
      {
        label: "Locations",
        value: "Pending",
        note: "Coordinates are not yet available",
        pending: true,
      },
    ];
  }

  return [
    {
      label: "Projects",
      value: String(verifiedProjects.length),
      note: "Verified records in the archive",
    },
    {
      label: "Communities reached",
      value: "Pending",
      note: "Will be published after verification",
      pending: true,
    },
    {
      label: "People impacted",
      value: "Pending",
      note: "Will be published after verification",
      pending: true,
    },
    {
      label: "Locations",
      value: String(verifiedWithCoordinates.length),
      note: "Records with verified coordinates",
      pending: verifiedWithCoordinates.length === 0,
    },
  ];
}

export function getMappableProjects(
  projectList: TrustProject[],
): TrustProject[] {
  return projectList.filter(
    (project) =>
      !project.isPlaceholder &&
      typeof project.latitude === "number" &&
      typeof project.longitude === "number",
  );
}
