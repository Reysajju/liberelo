"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQPage() {
  const { setCurrentView } = useAppStore()

  const authorFaqs = [
    {
      q: "Do you guarantee returns or reviews?",
      a: "No. We guarantee reach. We place your book in front of the exact number of readers you pay for. If your cover, blurb, and writing are strong, those readers will claim the book and review it. We never pay for reviews, ensuring you stay compliant with Amazon's Terms of Service."
    },
    {
      q: "Is my book safe from piracy?",
      a: "Yes. For pre-launch ARCs, we use secure, non-distributable formats and watermark files. For published books, we direct readers straight to your Amazon page."
    },
    {
      q: "How long does a campaign run?",
      a: "Depending on your tier, campaigns run between 7 and 30 days. Most authors see the bulk of their engagement within the first 72 hours of launch."
    },
    {
      q: "Can I target specific sub-genres?",
      a: "Yes. Our Growth and Publisher tiers allow for granular targeting (e.g., 'Sci-Fi Romance' rather than just 'Romance' or 'Sci-Fi')."
    }
  ]

  const reviewerFaqs = [
    {
      q: "Is it really free for reviewers?",
      a: "Always. Reviewers never pay for books. In exchange, we ask for honest, thoughtful reviews cross-posted to Amazon and Goodreads."
    },
    {
      q: "Do I have to leave a positive review?",
      a: "Absolutely not. We ask for honesty. A well-written 3-star review is often more helpful to a prospective buyer than a generic 5-star review."
    },
    {
      q: "What happens if I don't finish a book?",
      a: "Life happens. If you cannot finish or review a book, simply mark it as 'Did Not Finish' (DNF) in your dashboard. Repeatedly ghosting on claimed books will lower your reviewer rating."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-6 lg:px-8 py-20 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="self-start -ml-4 mb-12 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
          onClick={() => setCurrentView("landing")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <header className="mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about the Liberelo platform.
          </p>
        </header>

        <div className="space-y-16">
          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-8">For Authors</h2>
            <Accordion type="single" collapsible className="w-full">
              {authorFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`author-${i}`} className="border-border/50">
                  <AccordionTrigger className="text-left font-serif text-xl hover:text-primary transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 font-sans text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-8">For Reviewers</h2>
            <Accordion type="single" collapsible className="w-full">
              {reviewerFaqs.map((faq, i) => (
                <AccordionItem key={i} value={`reviewer-${i}`} className="border-border/50">
                  <AccordionTrigger className="text-left font-serif text-xl hover:text-primary transition-colors py-6">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 font-sans text-base leading-relaxed pb-6">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        <div className="mt-24 p-12 bg-card border border-border/50 rounded-2xl text-center">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Still have questions?</h3>
          <p className="text-foreground/70 mb-8">Our concierge team is ready to assist you.</p>
          <Button 
            variant="outline"
            className="h-12 px-8 rounded-xl font-medium tracking-wide"
            onClick={() => setCurrentView("contact")}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}
