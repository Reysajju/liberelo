import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Liberelo",
  description: "How we handle and protect your data at Liberelo.",
};

export default function Page() {
  return <PrivacyPolicy />;
}
