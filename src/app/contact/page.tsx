import { ContactPage } from "@/components/pages/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Liberelo",
  description: "Get in touch with the Liberelo team for support or inquiries.",
};

export default function Page() {
  return <ContactPage />;
}
