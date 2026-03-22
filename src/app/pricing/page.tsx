import { PricingPage } from "@/components/pages/PricingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Royalty Packages & Pricing | Liberelo",
  description: "Liberelo charges zero upfront publishing fees. Explore our transparent commission-based royalty packages, from Standard to Elite.",
};

export default function Page() {
  return <PricingPage />;
}
