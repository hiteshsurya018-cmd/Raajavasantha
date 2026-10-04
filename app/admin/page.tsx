import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth/admin-session";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const projects = await getProjects();
  return (
    <section className="min-h-screen bg-ivory px-5 pt-36 pb-20 lg:px-10">
      <div className="mx-auto max-w-[70rem]">
        <p className="eyebrow">Administration</p>
        <h1 className="display-lg mt-6 text-forest-deep">Project photographs</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">Choose the project that should receive approved photographs.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/admin/projects/${project.slug}/import-images`} className="border border-forest-deep/15 bg-card p-6 transition-colors hover:border-gold">
              <span className="font-display text-2xl text-forest-deep">{project.title}</span>
              <span className="mt-2 block text-sm text-muted-foreground">Import images →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
