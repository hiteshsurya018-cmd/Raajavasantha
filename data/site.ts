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
    "No.1516/B (46/3), 2nd Floor",
    "RAJAVASANTHA",
    "8th Main Road, 'A' Block",
    "2nd Stage, Rajajinagar",
    "Bengaluru – 560 010",
    "Karnataka, India",
  ],

  landmark: "Behind Vishal Bhavan",

  mapsQuery:
    "No.1516/B (46/3), 2nd Floor, RAJAVASANTHA, 8th Main Road, A Block, 2nd Stage, Rajajinagar, Bengaluru 560010, Karnataka, India",
};

/*
 * Exact Rajavasantha Google Maps PLACE listing.
 *
 * This intentionally uses the place URL instead of generating
 * a search URL from mapsQuery.
 *
 * Clicking "Open in Google Maps" will therefore open the
 * Rajavasantha listing itself rather than a coordinate/address search.
 */
export const mapsUrl =
  "https://www.google.com/maps/place/Rajavasantha/@13.0074904,77.5541688,943m/data=!3m2!1e3!4m6!3m5!1s0x3bae3d001fe5c3dd:0xc3ac89a96768943d!8m2!3d13.0074852!4d77.5567491!16s%2Fg%2F11yb9n159y";

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
      "We seek to expand access to education, vocational training and future-ready skills for students, young people and communities.",
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
      "We work towards accessible primary healthcare and health awareness, with particular attention to underserved children, adolescent girls and women.",
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
      "We aim to strengthen women's empowerment and child development through education, nutrition, protection, opportunity and community support.",
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
      "We seek to strengthen nutrition and food security for children and vulnerable communities through practical, community-focused support.",
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
      "We seek to strengthen communities through inclusive infrastructure, learning spaces, skill development and sustainable local initiatives.",
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
      "We support sustainable agriculture, farmer education and rural livelihoods with an emphasis on long-term community resilience.",
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
      "We champion clean and accessible energy solutions that contribute to sustainable development and stronger communities.",
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
      "We promote responsible environmental practices through waste management, recycling, sanitation, conservation and public awareness.",
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
      "We seek to empower young people through sport, mentorship, leadership and opportunities that encourage discipline, confidence and healthy development.",
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
      "We seek to improve the quality of life of senior citizens from economically and socially neglected sections through compassionate, needs-based support.",
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
      "We promote responsible animal care through veterinary support, livestock welfare, rescue, rehabilitation and awareness.",
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
      "We seek to provide timely humanitarian assistance, relief and rehabilitation support to communities affected by natural disasters and emergencies.",
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

export type Principle = {
  title: string;
  body: string;
};

export const principles: Principle[] = [
  {
    title: "Inclusion",
    body:
      "We believe charitable support should be accessible to all, without discrimination based on caste, creed, colour, community, religion or sex.",
  },

  {
    title: "Human Dignity",
    body:
      "We place the dignity of every individual at the heart of our work, with particular attention to vulnerable, underserved and socially or economically disadvantaged communities.",
  },

  {
    title: "Access to Opportunity",
    body:
      "We seek to create pathways to education, vocational training, scholarships and skill development so that opportunity can extend beyond circumstance.",
  },

  {
    title: "Community Empowerment",
    body:
      "We believe lasting progress begins within communities, supported by learning spaces, self-help initiatives, local development and meaningful participation.",
  },

  {
    title: "Education",
    body:
      "Education is a cornerstone of our vision — spanning early childhood and school education, digital literacy, AI, robotics, STEM, vocational learning and research.",
  },

  {
    title: "Health & Wellbeing",
    body:
      "We are committed to advancing access to primary healthcare, health awareness, medical assistance and community health initiatives, with particular attention to children, adolescent girls and women.",
  },

  {
    title: "Environmental Responsibility",
    body:
      "We champion responsible environmental practices through waste management, recycling, e-waste management, sanitation, conservation and pollution prevention.",
  },

  {
    title: "Sustainability",
    body:
      "We promote long-term solutions through renewable energy, sustainable agriculture, water conservation and environmentally responsible community development.",
  },

  {
    title: "Collaboration",
    body:
      "We believe meaningful social impact is strengthened through collaboration with government departments, local authorities, educational institutions, charitable organisations and community partners.",
  },

  {
    title: "Responsible Governance",
    body:
      "We uphold responsible governance through defined leadership, sound administration, financial oversight, proper record-keeping and accountability.",
  },
];

export const homePrinciples = [
  {
    title: "Inclusion",
    body:
      "Creating a culture where charitable support is accessible to all, without discrimination.",
  },

  {
    title: "Service",
    body:
      "Advancing charitable, educational, welfare and public-benefit initiatives with purpose.",
  },

  {
    title: "Dignity",
    body:
      "Putting people first and extending thoughtful support to vulnerable and underserved communities.",
  },

  {
    title: "Access",
    body:
      "Expanding access to education, healthcare, nutrition, skills and community resources.",
  },

  {
    title: "Sustainability",
    body:
      "Building long-term solutions through clean energy, environmental responsibility, sustainable agriculture and community development.",
  },

  {
    title: "Accountability",
    body:
      "Maintaining responsible leadership, transparent administration, financial oversight and sound governance.",
  },
];

export type Trustee = {
  name: string;
  role: string;
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

export const upcomingWork = [
  {
    title: "Renewable Energy & EV Charging Points",
    body:
      "We intend to work towards clean energy access through rooftop solar, rural electrification and electric-vehicle charging points as part of our renewable energy vision.",
  },

  {
    title: "Child Nutrition Programme",
    body:
      "Nutritional support for children in Anganwadis and government schools — including meals, milk, fruits and supplements — is an early priority within our nutrition initiatives.",
  },

  {
    title: "Sustainable Energy & Awareness",
    body:
      "We aim to encourage energy conservation, efficiency and awareness initiatives that help households and institutions adopt sustainable technologies.",
  },

  {
    title: "Volunteer Network",
    body:
      "We are building a volunteer network of people who can contribute their skills, time and local knowledge as the Trust's initiatives take shape.",
  },
];

export const areasOfInterest = focusAreas.map((f) => f.title);