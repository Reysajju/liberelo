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

import { authorFaqs } from "@/config/faqs"

export function FAQPage() {
  const { setCurrentView } = useAppStore()

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
