import { HowItWorksPage } from "@/components/pages/HowItWorksPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Liberelo",
  description: "Understand the Liberelo process: from manuscript submission to verified reviewer reach.",
};

export default function Page() {
  return <HowItWorksPage />;
}
