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

export const contact = {
  email: "info@rajavasanthatrust.org",
  addressLines: [
    "No.1516/B (46/3), 2nd Floor,",
    '"RAJAVASANTHA",',
    "8th Main Road, 'A' Block,",
    "2nd Stage, Rajajinagar,",
    "Bengaluru – 560 010",
    "Karnataka, India",
  ],
  landmark: "Behind Vishal Bhavan",
  mapsQuery:
    "No.1516/B (46/3), 2nd Floor, RAJAVASANTHA, 8th Main Road, A Block, 2nd Stage, Rajajinagar, Bengaluru 560010, Karnataka, India",
};

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  contact.mapsQuery,
)}`;

export type FocusArea = {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  points: string[];
};

export const focusAreas: FocusArea[] = [
  {
    slug: "education",
    title: "Education & Skill Development",
    icon: GraduationCap,
    summary:
      "The Trust's objectives include establishing educational institutions, vocational training and skill development facilities for students, youth and the wider public.",
    points: [
      "Schools, colleges, coaching and vocational training centres",
      "Digital literacy and computer education programmes",
      "Computer laboratories, digital learning centres and smart classrooms",
      "Training in Artificial Intelligence, Robotics and STEM subjects",
      "Career guidance, employment readiness and entrepreneurship development",
      "Scholarships, fellowships and educational assistance for deserving students",
      "Research and innovation centres for knowledge sharing",
    ],
  },
  {
    slug: "healthcare",
    title: "Healthcare Support",
    icon: HeartPulse,
    summary:
      "The Trust seeks to promote accessible primary healthcare and health awareness, with particular attention to underserved children, adolescent girls and women.",
    points: [
      "Primary healthcare access in rural, tribal and slum areas",
      "Health awareness programmes for underprivileged communities",
      "Medical assistance for persons who are unwell, disabled or in need",
      "Health care centres, clinics, diagnostic and rehabilitation services",
      "Health camps including eye, dental and general check-up camps",
      "Support for child health, adolescent and women's health",
    ],
  },
  {
    slug: "women-and-child",
    title: "Women Empowerment & Child Development",
    icon: Users,
    summary:
      "The Trust is established to support women's empowerment and child development, including early childhood education and the protection of vulnerable women and girls.",
    points: [
      "Early childhood education and holistic child development",
      "Nutrition strategies for children and mothers",
      "Self-help groups and community savings initiatives",
      "Economic empowerment of women and their families",
      "Work against child marriage, gender bias and dowry harassment",
      "Prevention of trafficking, with rescue, rehabilitation and re-integration",
      "Shelter, food, clothing and care for marginalised women and girls",
    ],
  },
  {
    slug: "nutrition",
    title: "Nutrition & Food Security",
    icon: Utensils,
    summary:
      "The Trust's objectives include nutritional support for children in Anganwadis and government schools, and food security programmes for vulnerable communities.",
    points: [
      "Nutritious meals, milk, fruits and supplements for children",
      "Food distribution programmes and community kitchens",
      "Support to Anganwadi centres, hostels, orphanages and old age homes",
      "Programmes to reduce malnutrition and improve child health",
      "Nutrition awareness among vulnerable communities",
    ],
  },
  {
    slug: "community-development",
    title: "Community Development",
    icon: Building2,
    summary:
      "The Trust may undertake community infrastructure and welfare facilities that improve educational, social and economic conditions.",
    points: [
      "Community halls, multipurpose centres and welfare facilities",
      "Libraries, reading rooms and learning centres",
      "Skill development centres for local communities",
      "Village adoption and rural community development initiatives",
      "Programmes promoting participation, inclusion and sustainability",
    ],
  },
  {
    slug: "agriculture",
    title: "Agriculture & Rural Development",
    icon: Sprout,
    summary:
      "The Trust seeks to support sustainable agriculture, farmer education and rural livelihoods.",
    points: [
      "Organic farming and environmentally sustainable practices",
      "Education, training and technical assistance for farmers",
      "Dairy development and livestock improvement",
      "Horticulture, agro-forestry and allied activities",
      "Watershed management, water conservation and irrigation",
      "Rural livelihood enhancement and economic development",
    ],
  },
  {
    slug: "renewable-energy",
    title: "Renewable Energy",
    icon: Sun,
    summary:
      "The Trust is established to develop renewable energy projects and to widen access to clean, affordable energy in underserved communities.",
    points: [
      "Solar parks, solar power plants and rooftop solar systems",
      "Wind energy and other sustainable generation initiatives",
      "Rural electrification and clean energy access",
      "Energy conservation and energy efficiency programmes",
      "Awareness, training and capacity building on renewable energy",
    ],
  },
  {
    slug: "environment",
    title: "Environmental Sustainability & Waste Management",
    icon: Recycle,
    summary:
      "The Trust's objectives include integrated waste management, recycling and environmental awareness for public benefit.",
    points: [
      "Solid waste management and integrated waste projects",
      "Waste segregation, collection, processing and disposal systems",
      "E-waste recycling and responsible disposal mechanisms",
      "Composting units, recycling centres and circular economy projects",
      "Sanitation drives and environmental awareness campaigns",
      "Conservation initiatives and pollution prevention",
    ],
  },
  {
    slug: "sports-youth",
    title: "Sports & Youth Development",
    icon: Trophy,
    summary:
      "The Trust may develop sporting facilities and youth programmes that build discipline, fitness and leadership.",
    points: [
      "Indoor stadiums, sports complexes and playgrounds",
      "Football academies and athletic development programmes",
      "Coaching, mentoring and scholarships for talented sportspersons",
      "Sports competitions, tournaments and cultural programmes",
      "Youth leadership and personality development programmes",
    ],
  },
  {
    slug: "elderly-care",
    title: "Elderly & Senior Care",
    icon: HandHeart,
    summary:
      "The Trust seeks to improve the quality of life of senior citizens from economically and socially neglected sections of society.",
    points: [
      "Free access to basic amenities such as food and medical care",
      "Care support assessed by doctors and experts",
      "Support shaped around each individual's needs",
    ],
  },
  {
    slug: "animal-welfare",
    title: "Animal Welfare",
    icon: PawPrint,
    summary:
      "The Trust's objectives include veterinary care, livestock welfare and responsible animal care.",
    points: [
      "Veterinary camps and animal healthcare programmes",
      "Cattle welfare, livestock health and animal husbandry development",
      "Animal rescue, rehabilitation and shelter facilities",
      "Awareness on animal welfare and responsible care",
    ],
  },
  {
    slug: "disaster-relief",
    title: "Disaster Relief & Rehabilitation",
    icon: LifeBuoy,
    summary:
      "The Trust is established to provide humanitarian assistance and rehabilitation support during floods, drought and other disasters.",
    points: [
      "Flood relief, rescue operations and rehabilitation support",
      "Drought relief, drinking water support and livelihood assistance",
      "Emergency assistance during earthquakes and natural disasters",
      "Emergency shelters, relief camps and temporary accommodation",
      "Food, clothing, medicines and healthcare during emergencies",
      "Disaster preparedness, risk reduction and community resilience",
    ],
  },
];

export type Principle = { title: string; body: string };

export const principles: Principle[] = [
  {
    title: "Inclusion",
    body: "The Trust Deed states that the benefits of the Trust's charitable and benevolent services shall be available to all people without discrimination of caste, creed, colour, community, religion or sex.",
  },
  {
    title: "Human Dignity",
    body: "The Trust's objectives are directed towards vulnerable, underserved and economically or socially disadvantaged persons, with care offered in a manner that respects the dignity of every individual.",
  },
  {
    title: "Access to Opportunity",
    body: "The deed provides for education, vocational training, scholarships and skill development so that opportunity is not limited by circumstance.",
  },
  {
    title: "Community Empowerment",
    body: "Community halls, learning centres, self-help groups and village development initiatives are set out in the deed as means of strengthening communities from within.",
  },
  {
    title: "Education",
    body: "Education runs through the deed — from early childhood and school education to digital literacy, AI, robotics, STEM and research and innovation.",
  },
  {
    title: "Health & Wellbeing",
    body: "The deed provides for primary healthcare, health awareness, medical assistance and health camps, with particular attention to children, adolescent girls and women.",
  },
  {
    title: "Environmental Responsibility",
    body: "Waste management, recycling, e-waste handling, sanitation and pollution prevention are expressly included among the Trust's objectives.",
  },
  {
    title: "Sustainability",
    body: "Renewable energy, sustainable agriculture, water conservation and sustainable community development are written into the deed as long-term commitments.",
  },
  {
    title: "Collaboration",
    body: "The deed contemplates working with government departments, local authorities, educational institutions and other charitable organisations to further its objectives.",
  },
  {
    title: "Responsible Governance",
    body: "The deed sets out provisions for trustees, officers, quorum, accounts and audit — the framework through which the Trust intends to remain accountable.",
  },
];

export const homePrinciples = [
  {
    title: "Inclusion",
    body: "Charitable benefits are intended for all people, without discrimination of caste, creed, colour, community, religion or sex.",
  },
  {
    title: "Service",
    body: "The Trust exists for charitable, educational, welfare and public-benefit purposes.",
  },
  {
    title: "Dignity",
    body: "Attention is directed towards vulnerable, underserved and disadvantaged communities.",
  },
  {
    title: "Access",
    body: "Promoting access to education, healthcare, nutrition and community resources.",
  },
  {
    title: "Sustainability",
    body: "Renewable energy, environmental sustainability, sustainable agriculture and community development.",
  },
  {
    title: "Accountability",
    body: "The deed contains provisions relating to trustees, accounts, auditing and administration.",
  },
];

export type Trustee = { name: string; role: string };

export const leadership: Trustee[] = [
  { name: "Shruthi R", role: "President" },
  { name: "Vasantha Raj", role: "Secretary" },
  { name: "Shashank Rajgopal", role: "Treasurer" },
];

export const trustees: Trustee[] = [
  { name: "H Raj Gopal", role: "Trustee" },
  { name: "Umesh G", role: "Trustee" },
  { name: "Mamatha B", role: "Trustee" },
  { name: "Nagalambika B", role: "Trustee" },
  { name: "Chaluvaraya Swamy", role: "Trustee" },
];

export const upcomingWork = [
  {
    title: "Renewable Energy & EV Charging Points",
    body: "The Trust intends to work towards clean energy access — rooftop solar, rural electrification and electric-vehicle charging points as part of its renewable energy objectives.",
  },
  {
    title: "Child Nutrition Programme",
    body: "Nutritional support for children in Anganwadis and government schools — meals, milk, fruits and supplements — is an early priority within the Trust's nutrition objectives.",
  },
  {
    title: "Sustainable Energy & Awareness",
    body: "Energy conservation, efficiency and awareness initiatives that help households and institutions adopt sustainable technologies.",
  },
  {
    title: "Volunteer Network",
    body: "Building a volunteer network of people willing to contribute skills, time and local knowledge as the Trust's initiatives take shape.",
  },
];

export const areasOfInterest = focusAreas.map((f) => f.title);
