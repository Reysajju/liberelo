import { PricingPage } from "@/components/pages/PricingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Liberelo",
  description: "Transparent pricing for authors. Choose the tier that fits your launch strategy.",
};

export default function Page() {
  return <PricingPage />;
}
