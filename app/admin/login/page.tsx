import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdmin } from "@/lib/auth/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <section className="min-h-screen bg-ivory px-5 pt-36 pb-20">
      <div className="mx-auto max-w-md border border-forest-deep/15 bg-card p-8">
        <p className="eyebrow">Administration</p>
        <h1 className="mt-5 font-display text-4xl text-forest-deep">Secure sign in</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Sign in to manage approved project photographs.
        </p>
        <Suspense><AdminLoginForm /></Suspense>
      </div>
    </section>
  );
}
