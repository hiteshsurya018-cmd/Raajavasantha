import "server-only";

import { sql } from "@/lib/db";
import { slugifyFolderName } from "@/lib/media/media-utils";

export type MediaPhoto = {
  id: string; folder_id: string; original_filename: string; mime_type: string;
  original_bytes: number | string; width: number | null; height: number | null;
  cloudinary_url: string; thumbnail_url: string; source: string; source_ref: string | null;
  alt: string; caption: string | null; created_at: string; approved: boolean;
  resource_type: string | null;
};
export type MediaFolder = {
  id: string; name: string; slug: string; description: string | null;
  cover_photo_id: string | null; is_public: boolean; created_at: string; updated_at: string;
  photo_count: number; cover_url: string | null; cover_alt: string | null;
  category: string; location: string; status: string; featured: boolean;
};
export type CreateProjectInput = {
  name: string; description: string; category: string; location: string; isPublic: boolean;
};

const folderProjection = `
  SELECT p.id, p.title AS name, p.slug, p.description,
    cover.id AS cover_photo_id, p.is_public, p.created_at, p.updated_at,
    COUNT(g.id) FILTER (WHERE g.approved = true)::int AS photo_count,
    COALESCE(p.cover_image, MIN(g.src) FILTER (WHERE g.approved = true AND COALESCE(g.resource_type, 'image') = 'image')) AS cover_url,
    COALESCE(p.cover_image_alt, MIN(g.alt) FILTER (WHERE g.approved = true AND COALESCE(g.resource_type, 'image') = 'image')) AS cover_alt,
    p.category, p.location, p.status, p.featured
  FROM projects p
  LEFT JOIN project_gallery_images g ON g.project_id = p.id
  LEFT JOIN project_gallery_images cover
    ON cover.project_id = p.id AND cover.src = p.cover_image
`;

function mapFolderRows(rows: Record<string, unknown>[]) {
  return rows as unknown as MediaFolder[];
}

export async function getMediaFolders() {
  return mapFolderRows(await sql.query(`${folderProjection}
    GROUP BY p.id, cover.id
    ORDER BY p.updated_at DESC`));
}

export async function getPublicMediaFolders() {
  return mapFolderRows(await sql.query(`${folderProjection}
    WHERE p.is_public = true
    GROUP BY p.id, cover.id
    HAVING COUNT(g.id) FILTER (WHERE g.approved = true) > 0
    ORDER BY p.updated_at DESC`));
}

export async function getMediaFolderById(id: string) {
  const rows = mapFolderRows(await sql.query(`${folderProjection}
    WHERE p.id = $1
    GROUP BY p.id, cover.id
    LIMIT 1`, [id]));
  return rows[0] ?? null;
}

export async function getPublicMediaFolderBySlug(slug: string) {
  const rows = mapFolderRows(await sql.query(`${folderProjection}
    WHERE p.slug = $1 AND p.is_public = true
    GROUP BY p.id, cover.id
    HAVING COUNT(g.id) FILTER (WHERE g.approved = true) > 0
    LIMIT 1`, [slug]));
  return rows[0] ?? null;
}

export async function getFolderPhotos(projectId: string, publicOnly = false) {
  return (await sql`
    SELECT id, project_id AS folder_id, COALESCE(original_filename, 'photograph') AS original_filename,
      COALESCE(mime_type, 'image/unknown') AS mime_type, COALESCE(bytes, 0) AS original_bytes,
      width, height, src AS cloudinary_url, src AS thumbnail_url, source, source_ref,
      alt, caption, created_at, approved, resource_type
    FROM project_gallery_images
    WHERE project_id = ${projectId} AND (${publicOnly} = false OR approved = true)
    ORDER BY sort_order, created_at DESC
  `) as MediaPhoto[];
}

export async function createMediaFolder(input: CreateProjectInput) {
  const base = slugifyFolderName(input.name);
  if (!base) throw Object.assign(new Error("Enter a valid project name."), { status: 400 });
  let slug = base;
  for (let suffix = 1; suffix < 1000; suffix += 1) {
    try {
      const rows = await sql`
        INSERT INTO projects (
          slug, title, description, short_description, category, location,
          country, status, featured, is_public
        ) VALUES (
          ${slug}, ${input.name.trim().slice(0, 120)}, ${input.description},
          ${input.description.slice(0, 320)}, ${input.category}, ${input.location},
          'India', 'planning', false, ${input.isPublic}
        ) RETURNING *
      `;
      return { ...rows[0], name: rows[0].title, photo_count: 0, cover_url: null, cover_alt: null, cover_photo_id: null };
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "23505") throw error;
      slug = `${base}-${suffix + 1}`;
    }
  }
  throw Object.assign(new Error("Unable to create a unique project slug."), { status: 409 });
}
