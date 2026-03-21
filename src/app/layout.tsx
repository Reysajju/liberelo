import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://liberelo.com"),
  title: {
    default: "Liberelo | The Commission-Based Publishing Partner",
    template: "%s | Liberelo"
  },
  description: "Liberate your manuscript from algorithms. Connect with passionate, verified readers who love your specific genre. We provide complete marketing, wide and exclusive distribution, and transparent royalties.",
  keywords: [
    "book publishing", "manuscript submission", "author marketing", "book launch", 
    "indie author", "publishing agency", "book promotion"
  ],
  authors: [{ name: "Liberelo Team" }],
  creator: "Liberelo",
  publisher: "Liberelo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Liberelo | Premium Literary Discovery",
    description: "Connect with passionate, verified readers who love your specific genre. We guarantee reach and authentic engagement for your book launch.",
    url: "https://liberelo.com",
    siteName: "Liberelo",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Liberelo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberelo | The Commission-Based Publishing Partner",
    description: "Liberate your manuscript from the algorithm. Secure manuscript submission and performance marketing.",
    creator: "@liberelo_app",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://liberelo.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
        >
          {children}
          <Toaster />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
