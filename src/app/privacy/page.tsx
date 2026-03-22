import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Liberelo",
  description: "Review our strict commitment to data security, privacy, and intellectual property protection for all authors utilizing our publishing and distribution engine.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
