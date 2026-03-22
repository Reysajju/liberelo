import { AboutPage } from "@/components/pages/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Liberelo",
  description: "Liberelo is a premium book marketing and publishing partnership. We liberate authors from vanity presses through a pure commission model.",
};

export default function Page() {
  return <AboutPage />;
}
