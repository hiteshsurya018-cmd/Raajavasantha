import { getPublicMapGeoJson } from "@/lib/geography";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return Response.json(await getPublicMapGeoJson(), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }); }
  catch { return Response.json({ type: "FeatureCollection", features: [], error: "Map data is temporarily unavailable." }, { status: 503 }); }
}
