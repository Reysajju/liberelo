import { TermsPage } from "@/components/pages/TermsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Liberelo",
  description: "Official terms and conditions for author partnerships, manuscript submission, and commission-based royalty distribution at Liberelo.",
};

export default function Page() {
  return <TermsPage />;
}
