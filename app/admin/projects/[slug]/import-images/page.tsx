import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GooglePhotosImporter } from "@/components/admin/GooglePhotosImporter";
import { isAdmin } from "@/lib/auth/admin-session";
import { getProjectBySlug } from "@/lib/projects";
import { hasGooglePhotosConnection } from "@/lib/google/photos-connection";

export const dynamic = "force-dynamic";

export default async function ImportImagesPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ google?: string }>;
}) {
  const { slug } = await params;
  if (!(await isAdmin())) redirect(`/admin/login?next=${encodeURIComponent(`/admin/projects/${slug}/import-images`)}`);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const query = await searchParams;
  const connected = query.google === "connected" || await hasGooglePhotosConnection();
  return (
    <section className="min-h-screen bg-card px-5 pt-36 pb-20 lg:px-10">
      <div className="mx-auto max-w-[70rem]">
        <Link href="/admin" className="text-xs font-semibold tracking-[0.14em] text-forest-soft uppercase">← Projects</Link>
        <p className="eyebrow mt-10">{project.title}</p>
        <h1 className="display-lg mt-6 text-forest-deep">Import Images</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Import approved photographs from Google Photos into the Rajavasantha project gallery.</p>
        <GooglePhotosImporter projectId={project.id} projectSlug={project.slug} projectTitle={project.title} connected={connected} />
      </div>
    </section>
  );
}
