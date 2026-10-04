import { lovableAssets } from "@/lib/lovable-assets";

export type ProjectStatus =
  | "planning"
  | "active"
  | "completed"
  | "paused"
  | "pending";

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
  source?: "local" | "cloudinary" | "google-photos" | "external";
  resourceType?: "image" | "video";
  mimeType?: string;
};

export type ProjectMetric = {
  label: string;
  value: string;
  pending?: boolean;
};

export type ProjectReference = {
  label: string;
  href: string;
};

export type TrustProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  location: string;
  district?: string;
  state?: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  locationVisibility?: "exact" | "approximate" | "area" | "hidden";
  year: number | "Pending";
  startDate?: string | null;
  endDate?: string | null;
  coverImage?: ProjectImage | null;
  status: ProjectStatus;
  featured: boolean;
  objectives: string[];
  impactMetrics: ProjectMetric[];
  beneficiaries?: string;
  gallery: ProjectImage[];
  references?: ProjectReference[];
  createdAt: string;
  updatedAt: string;
  isPlaceholder?: boolean;
};

const placeholderImage = {
  src: lovableAssets.community.url,
  alt: "Replaceable placeholder image for the Rajavasantha Welfare Trust project archive",
  caption: "Project photography will be added after verified records are available.",
  source: "local" as const,
};

export const projects: TrustProject[] = [
  {
    id: "project-record-placeholder",
    slug: "verified-project-record-pending",
    title: "Verified project record pending",
    shortDescription:
      "The Trust is preparing its public project archive. Verified project details will appear here after internal review.",
    description:
      "This entry is a publishing placeholder for the Rajavasantha Welfare Trust project archive. It does not represent a completed or active field project. Once verified project records, photographs, impact notes and location data are approved, this record can be replaced without changing the page components.",
    category: "Institutional archive",
    location: "Location pending",
    district: undefined,
    state: "Karnataka",
    country: "India",
    latitude: null,
    longitude: null,
    year: "Pending",
    startDate: null,
    endDate: null,
    coverImage: placeholderImage,
    status: "pending",
    featured: true,
    objectives: [
      "Publish only verified project information approved by the Trust.",
      "Maintain a consistent record for objectives, beneficiaries, impact notes, photographs and location details.",
      "Allow future project records to be added through data updates rather than UI rewrites.",
    ],
    impactMetrics: [
      {
        label: "Verified impact metrics",
        value: "Pending",
        pending: true,
      },
      {
        label: "Beneficiary information",
        value: "Pending",
        pending: true,
      },
    ],
    beneficiaries:
      "Beneficiary information will be shown only after project records are verified.",
    gallery: [
      placeholderImage,
    ],
    references: [],
    createdAt: "2026-08-13T00:00:00+05:30",
    updatedAt: "2026-08-13T00:00:00+05:30",
    isPlaceholder: true,
  },
];
