import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Rajavasantha Welfare Trust.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy and information handling."
        intro="How Rajavasantha Welfare Trust handles information submitted through this website."
      />
      <section className="bg-ivory">
        <div className="mx-auto max-w-3xl px-5 py-20 lg:py-28">
          <Reveal className="space-y-6 text-[1.05rem] leading-relaxed text-muted-foreground">
            <p>
              Rajavasantha Welfare Trust collects contact information only when a visitor
              submits a form or contacts the Trust directly. This information is used to
              respond to enquiries, volunteer interest, donation interest or partnership
              requests.
            </p>
            <p>
              Public project, gallery and document content will be published only after
              review for accuracy, consent and appropriate visibility.
            </p>
            <p>
              For privacy questions, contact{" "}
              <a href={`mailto:${contact.email}`} className="link-underline text-forest-deep">
                {contact.email}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
