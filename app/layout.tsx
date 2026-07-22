import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rajavasanthawelfaretrust.org"),
  title: {
    default: "Rajavasantha Welfare Trust — Service is our duty, Society is our family",
    template: "%s | Rajavasantha Welfare Trust",
  },
  description:
    "Rajavasantha Welfare Trust builds a kinder, more inclusive society through education, healthcare, women's empowerment, environmental sustainability and community development across Karnataka.",
  keywords: [
    "NGO Bengaluru", "charity trust India", "80G donation", "CSR eligible NGO",
    "women empowerment NGO", "education NGO Karnataka",
  ],
  openGraph: {
    title: "Rajavasantha Welfare Trust",
    description: "Service is our duty, Society is our family.",
    url: "https://rajavasanthawelfaretrust.org",
    siteName: "Rajavasantha Welfare Trust",
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-canvas"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
