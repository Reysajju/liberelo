import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
    default: "Liberelo | Premium Literary Discovery & Guaranteed Reader Reach",
    template: "%s | Liberelo"
  },
  description: "Liberate your manuscript from algorithms. Connect with passionate, verified readers who love your specific genre. We guarantee reach, secure ARC distribution, and authentic engagement.",
  keywords: [
    "book reviews", "ARC distribution", "author marketing", "book launch", 
    "review platform", "indie authors", "book promotion", "guaranteed readers", 
    "literary discovery", "author services"
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
    title: "Liberelo | Guaranteed Reader Reach for Authors",
    description: "Liberate your manuscript from the algorithm. Secure ARC distribution and verified review boosting.",
    creator: "@liberelo_app",
    images: ["/logo.png"],
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
