import { ContactPage } from "@/components/pages/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Liberelo",
  description: "Contact the Liberelo team. Submit your manuscript or inquire about our premium, commission-based book marketing partnership.",
};

export default function Page() {
  return <ContactPage />;
}
