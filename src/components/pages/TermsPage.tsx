"use client"

import Link from "next/link"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText } from "lucide-react"

export function TermsPage() {
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
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Terms of Service
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            The operational guidelines and mutual agreements governing the use of the Liberelo platform.
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-sans leading-relaxed space-y-12">
           <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Liberelo platform, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the platform or use any services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">2. Description of Service</h2>
            <p>
              Liberelo operates as a hybrid commission-based publishing and marketing service. We evaluate submitted manuscripts and offer partnership packages to distribute, market, and sell selected titles across wide and exclusive distribution channels.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">3. Partnership and Fees</h2>
            <p>
              <strong>Commission Model:</strong> Liberelo provides publishing, marketing, and distribution services on a commission-based partnership model. We do not charge upfront publishing or marketing fees. Royalties are split according to the author's selected partnership package based on net revenue received.
            </p>
            <p className="mt-4">
              <strong>Annual Contract Fee:</strong> Authors accepted into the Liberelo partnership program agree to a $99 annual contract maintenance fee. This is not an upfront publishing fee, but a recurring administrative retainer to maintain the author's portfolio and active distribution status across our network.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">4. User Responsibilities</h2>
            <p>
              <strong>Authors:</strong> Must possess the legal right to distribute the manuscripts they upload. Authors agree to the terms of their selected distribution exclusivity and commission structure.
            </p>
          </section>

          <section className="p-8 bg-card border border-border/50 rounded-2xl mt-12">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Legal Inquiries</h3>
            <p className="mb-6">For formal legal correspondence regarding these terms, please contact our counsel.</p>
            <Button 
              variant="outline"
              asChild
            >
              <Link href="/contact">Contact Legal</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
