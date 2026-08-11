import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rajavasantha.org"),
  title: {
    default: "Rajavasantha Welfare Trust | Community Welfare & Social Development",
    template: "%s | Rajavasantha Welfare Trust",
  },
  description:
    "Rajavasantha Welfare Trust is a Bengaluru-based welfare trust working towards inclusive social development through education, healthcare, community welfare, environmental sustainability and humanitarian action.",
  keywords: [
    "Rajavasantha Welfare Trust",
    "Bengaluru welfare trust",
    "Karnataka charitable trust",
    "community welfare",
    "education healthcare environment NGO",
  ],
  openGraph: {
    title: "Rajavasantha Welfare Trust | Community Welfare & Social Development",
    description:
      "A Bengaluru-based welfare trust working towards inclusive social development through education, healthcare, community welfare, environmental sustainability and humanitarian action.",
    url: "https://rajavasantha.org",
    siteName: "Rajavasantha Welfare Trust",
    images: [
      {
        url: "/logo.jpeg",
        width: 800,
        height: 800,
        alt: "Rajavasantha Welfare Trust logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajavasantha Welfare Trust | Community Welfare & Social Development",
    description:
      "Rajavasantha Welfare Trust is a Bengaluru-based welfare trust working towards inclusive social development.",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Rajavasantha Welfare Trust" }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#073B24",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Rajavasantha Welfare Trust",
              url: "https://rajavasantha.org",
              description:
                "A Bengaluru-based welfare trust established for charitable, educational, welfare and public-benefit purposes.",
              email: "info@rajavasanthatrust.org",
              foundingDate: "2026",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "No.1516/B (46/3), 2nd Floor, RAJAVASANTHA, 8th Main Road, A Block, 2nd Stage, Rajajinagar",
                addressLocality: "Bengaluru",
                addressRegion: "Karnataka",
                postalCode: "560010",
                addressCountry: "IN",
              },
            }),
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-forest-deep focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
