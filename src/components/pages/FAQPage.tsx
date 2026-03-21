"use client"

import Link from "next/link"
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
      q: "How does commission-based book publishing work?",
      a: "Instead of charging you thousands of dollars upfront for vanity publishing packages, we invest in your success. We handle the formatting, distribution, and extensive marketing. In exchange, we take a standard percentage commission on the royalties your book generates."
    },
    {
      q: "Do I have to pay to publish my book?",
      a: "No. Unlike vanity presses, Liberelo does not charge upfront fees for our marketing or distribution services. If you are accepted into our Partnership program, you pay an administrative $99 annual contract fee to maintain your active distribution and analytics infrastructure."
    },
    {
      q: "How do authors make money with Liberelo?",
      a: "You earn a percentage of net royalties based on your selected partnership package. Depending on whether you choose Standard, Plus, Professional, or Elite, you can earn anywhere from 50% to 90% of your book's net revenue."
    },
    {
      q: "What is the difference between Wide and Exclusive distribution?",
      a: "Wide distribution means we push your book to every major retailer (Amazon, Barnes & Noble, Apple Books, Kobo, etc). Exclusive distribution means your book is sold solely through our proprietary, high-converting Liberelo sales platform."
    },
    {
      q: "How long until I hear back about my manuscript?",
      a: "Due to high submission volume, our editorial and analytics team typically requires 5 to 7 business days to review your manuscript and assess its market viability."
    },
    {
      q: "Do you guarantee book sales?",
      a: "While we employ maximum marketing spend and precise algorithms, actual sales depend on reader reception to your story. We guarantee our marketing effort and transparent commission splits, not specific sales volumes."
    },
    {
      q: "Who retains the copyright to my book?",
      a: "You do. At Liberelo, authors retain 100% of their copyright and intellectual property rights at all times. We simply act as your distributor and marketing partner."
    },
    {
      q: "Do you offer professional editing services?",
      a: "Our team assesses your manuscript for market readiness. High-tier packages (Professional and Elite) include structural and line editing to polish your manuscript before launch."
    },
    {
      q: "Can I transfer an already published book to Liberelo?",
      a: "Yes. If you hold the publishing rights to an existing title and are free from platform exclusivity constraints (like Amazon KDP Select), you can bring your backlist to Liberelo."
    },
    {
      q: "How do you market books to readers?",
      a: "We use a multi-channel approach: dynamic metadata optimization, proprietary audience matching, email newsletter blasts to highly targeted genre fans, and paid advertising campaigns out of our own budget."
    },
    {
      q: "What genres perform best on Liberelo?",
      a: "Currently, our platform sees the highest engagement in Romance, Sci-Fi/Fantasy, Thriller, and LitRPG genres, but our marketing algorithms adapt to any commercially viable manuscript."
    },
    {
      q: "Do you distribute print books or just eBooks?",
      a: "Our primary focus is digital reach (eBooks and audiobooks), but our Elite distribution package includes Print-on-Demand (POD) setup for paperbacks across major retailers."
    },
    {
      q: "What happens if my book is rejected?",
      a: "If your manuscript isn't a fit for our current marketing capabilities, we will send you a polite decline. You are free to query us again with future projects."
    },
    {
      q: "Can I use my own cover art?",
      a: "Absolutely. If you have professionally designed cover art that meets industry standards, we will use it. Otherwise, our Plus and higher tiers include custom cover design."
    },
    {
      q: "How are royalty payments processed?",
      a: "Royalties are calculated at the end of each calendar month and disbursed straight to your connected bank account or PayPal once they meet the minimum threshold."
    },
    {
      q: "Are there hidden fees in the contract?",
      a: "Transparency is our foundation. Aside from the $99 annual contract maintenance fee and the agreed-upon royalty split, there are zero hidden charges."
    },
    {
      q: "Can I break my contract if I'm unhappy?",
      a: "Yes. Our standard terms allow authors to terminate the partnership agreement with 60 days written notice, allowing us time to de-list the title from our distribution network."
    },
    {
      q: "How do you track sales and analytics?",
      a: "Authors get an exclusive, real-time dashboard tracking daily reach, downloads across platforms, and accrued estimated royalties."
    },
    {
      q: "Do I handle my own ISBNs?",
      a: "Liberelo provides free platform-specific ISBNs for all partners. However, you are welcome to provide your own independently purchased ISBN."
    },
    {
      q: "Does Liberelo translate manuscripts?",
      a: "We currently focus on English language distribution. International translation rights remain fully yours to exploit independently."
    },
    {
      q: "Can I still do my own marketing on social media?",
      a: "We encourage it! Your personal marketing efforts multiply the effectiveness of our paid campaigns. Our dashboard provides custom tracking links for your own use."
    },
    {
      q: "What is an author 'reach'?",
      a: "Reach refers to the verified number of targeted genre readers our marketing platform guarantees will view your book's listing."
    },
    {
      q: "How do I submit my manuscript?",
      a: "Click 'Submit Manuscript' on our pricing page, fill out the lead questionnaire, and attach your .docx or .epub file for our editorial team to review."
    },
    {
      q: "Why do you use a commission model?",
      a: "Because we believe publishing partners should only make money when the author makes money. It aligns our incentives perfectly with your success."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-6 lg:px-8 py-20 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="self-start -ml-4 mb-12 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
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
        </div>

        <div className="mt-24 p-12 bg-card border border-border/50 rounded-2xl text-center">
          <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Still have questions?</h3>
          <p className="text-foreground/70 mb-8">Our concierge team is ready to assist you.</p>
          <Button 
            variant="outline"
            className="h-12 px-8 rounded-xl font-medium tracking-wide"
            asChild
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
