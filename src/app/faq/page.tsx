import { FAQPage } from "@/components/pages/FAQPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Liberelo",
  description: "Frequently asked questions about the Liberelo platform for authors and reviewers.",
};

export default function Page() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do you guarantee returns or reviews?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. We guarantee reach. We place your book in front of the exact number of readers you pay for."
        }
      },
      {
        "@type": "Question",
        "name": "Is it really free for reviewers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Always. Reviewers never pay for books. In exchange, we ask for honest, thoughtful reviews."
        }
      }
    ]
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
