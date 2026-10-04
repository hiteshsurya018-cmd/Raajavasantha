import {
  GraduationCap,
  HeartPulse,
  Users,
  Utensils,
  Building2,
  Sprout,
  Sun,
  Recycle,
  Trophy,
  HandHeart,
  PawPrint,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export const TRUST_NAME = "Rajavasantha Welfare Trust";

export type Trustee = {
  name: string;
  role: string;
  image?: string;
};

export type FoundingMember = {
  name: string;
  role: string;
  image?: string;
};

export const leadership: Trustee[] = [
  {
    name: "Shruthi R",
    role: "President",
  },
  {
    name: "Vasantha Raj",
    role: "Secretary",
  },
  {
    name: "Shashank Rajgopal",
    role: "Treasurer",
    image: "/images/team/shashank-rajgopal.jpg",
  },
];

export const trustees: Trustee[] = [
  {
    name: "H Raj Gopal",
    role: "Trustee",
  },
  {
    name: "Umesh G",
    role: "Trustee",
  },
  {
    name: "Mamatha B",
    role: "Trustee",
  },
  {
    name: "Nagalambika B",
    role: "Trustee",
  },
  {
    name: "Chaluvaraya Swamy",
    role: "Trustee",
  },
];

export const foundingMembers: FoundingMember[] = [];