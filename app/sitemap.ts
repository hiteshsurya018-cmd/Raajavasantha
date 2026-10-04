import type { MetadataRoute } from "next";
import { getPublicMediaFolders } from "@/lib/media/library";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

const routes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/focus-areas", priority: 0.9 },
  { path: "/projects", priority: 0.8 },
  { path: "/projects/map", priority: 0.5 },
  { path: "/gallery", priority: 0.8 },
  { path: "/principles", priority: 0.7 },
  { path: "/founding-team", priority: 0.6 },
  { path: "/support", priority: 0.8 },
  { path: "/volunteer", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://rajavasanthatrust.org";
  const projectRoutes = (await getProjects()).map((project) => ({
    path: `/projects/${project.slug}`,
    priority: project.isPlaceholder ? 0.2 : 0.7,
  }));
  const galleryRoutes = (await getPublicMediaFolders()).map((folder) => ({ path: `/gallery/${folder.slug}`, priority: 0.6 }));

  return [...routes, ...projectRoutes, ...galleryRoutes].map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
