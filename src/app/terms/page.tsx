import { TermsPage } from "@/components/pages/TermsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Liberelo",
  description: "Terms and conditions for using the Liberelo platform.",
};

export default function Page() {
  return <TermsPage />;
}
