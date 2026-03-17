import { AboutPage } from "@/components/pages/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | Liberelo",
  description: "Learn about Liberelo's mission to liberate authors from algorithms and connect them with real readers.",
};

export default function Page() {
  return <AboutPage />;
}
