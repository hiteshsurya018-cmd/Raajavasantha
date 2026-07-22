import { Hero } from "@/components/sections/hero";
import { TrustIndicators } from "@/components/sections/trust-indicators";
import { ImpactCounters } from "@/components/sections/impact-counters";
import { FocusAreas } from "@/components/sections/focus-areas";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Testimonials } from "@/components/sections/testimonials";
import { LatestNews } from "@/components/sections/latest-news";
import { Gallery } from "@/components/sections/gallery";
import { VolunteerCta } from "@/components/sections/volunteer-cta";
import { DonateSection } from "@/components/sections/donate-section";
import { Newsletter } from "@/components/sections/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustIndicators />
      <ImpactCounters />
      <FocusAreas />
      <FeaturedProjects />
      <Testimonials />
      <LatestNews />
      <Gallery />
      <VolunteerCta />
      <DonateSection />
      <Newsletter />
    </>
  );
}
