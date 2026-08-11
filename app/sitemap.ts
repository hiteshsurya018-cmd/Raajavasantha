import type { MetadataRoute } from "next";

const routes = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/focus-areas", priority: 0.9 },
  { path: "/principles", priority: 0.7 },
  { path: "/founding-team", priority: 0.6 },
  { path: "/support", priority: 0.8 },
  { path: "/volunteer", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/privacy-policy", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://rajavasantha.org";
  return routes.map(({ path, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
