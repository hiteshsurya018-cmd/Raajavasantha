import "server-only";
import { sql } from "@/lib/db";
export type MapProperties = { id: string; type: "project" | "photo"; projectId: string; slug: string; title: string; category: string; location: string; year: number | null; photoCount: number; thumbnail: string | null; };
export type MapFeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Point, MapProperties>;
function validCoordinate(latitude: number, longitude: number) { return Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude === 0 && longitude === 0); }
function publicCoordinate(value: number, visibility: string) { if (visibility === "exact") return value; if (visibility === "approximate") return Math.round(value * 100) / 100; if (visibility === "area") return Math.round(value * 10) / 10; return null; }
export async function getPublicMapGeoJson(): Promise<MapFeatureCollection> {
  const rows = await sql`
    SELECT p.id, p.slug, p.title, p.category, p.location, p.year, p.latitude, p.longitude, p.location_visibility,
      COUNT(g.id) FILTER (WHERE g.approved = true)::int AS photo_count,
      COALESCE(p.cover_image, MIN(g.src) FILTER (WHERE g.approved = true AND COALESCE(g.resource_type, 'image') = 'image')) AS thumbnail
    FROM projects p LEFT JOIN project_gallery_images g ON g.project_id = p.id
    WHERE p.is_public = true GROUP BY p.id ORDER BY p.featured DESC, p.updated_at DESC
  ` as Record<string, unknown>[];
  const features: MapFeatureCollection["features"] = [];
  for (const row of rows) {
    const visibility = String(row.location_visibility ?? "hidden");
    const latitude = publicCoordinate(Number(row.latitude), visibility); const longitude = publicCoordinate(Number(row.longitude), visibility);
    if (latitude === null || longitude === null || !validCoordinate(latitude, longitude)) continue;
    features.push({ type: "Feature", geometry: { type: "Point", coordinates: [longitude, latitude] }, properties: {
      id: String(row.id), type: "project", projectId: String(row.id), slug: String(row.slug), title: String(row.title), category: String(row.category),
      location: String(row.location), year: row.year === null ? null : Number(row.year), photoCount: Number(row.photo_count ?? 0), thumbnail: row.thumbnail ? String(row.thumbnail) : null,
    }});
  }
  const mediaRows = await sql`
    SELECT g.id, g.project_id, g.latitude, g.longitude, g.location_visibility, g.src AS thumbnail,
      p.slug, p.title, p.category, p.location, p.year
    FROM project_gallery_images g
    JOIN projects p ON p.id = g.project_id
    WHERE p.is_public = true AND g.approved = true
      AND g.latitude IS NOT NULL AND g.longitude IS NOT NULL
      AND g.location_visibility <> 'hidden'
  ` as Record<string, unknown>[];
  for (const row of mediaRows) {
    const visibility = String(row.location_visibility);
    const latitude = publicCoordinate(Number(row.latitude), visibility); const longitude = publicCoordinate(Number(row.longitude), visibility);
    if (latitude === null || longitude === null || !validCoordinate(latitude, longitude)) continue;
    features.push({ type: "Feature", geometry: { type: "Point", coordinates: [longitude, latitude] }, properties: {
      id: String(row.id), type: "photo", projectId: String(row.project_id), slug: String(row.slug), title: String(row.title),
      category: String(row.category), location: String(row.location), year: row.year === null ? null : Number(row.year),
      photoCount: 1, thumbnail: row.thumbnail ? String(row.thumbnail) : null,
    }});
  }
  return { type: "FeatureCollection", features };
}
