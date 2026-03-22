import { FAQPage } from "@/components/pages/FAQPage";
import { authorFaqs } from "@/config/faqs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publishing FAQ | Liberelo",
  description: "Answers to common questions about Liberelo's commission-based publishing model, royalties, and guaranteed marketing reach.",
};

export default function Page() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": authorFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <FAQPage />
    </>
  );
}
