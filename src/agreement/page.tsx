import { AgreementPage } from "@/components/pages/AgreementPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Author Agreement | Liberelo",
  description: "Standard agreement for authors using the Liberelo platform.",
};

export default function Page() {
  return <AgreementPage />;
}
