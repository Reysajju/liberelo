"use client"

import Link from "next/link"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"

export function PrivacyPolicy() {
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
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Privacy Policy
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Your trust is our paramount concern. This document outlines how we protect and utilize your data.
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-sans leading-relaxed space-y-12">
          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">1. Data Collection</h2>
            <p>
              Liberelo collects only the information strictly necessary to facilitate the connection between authors and readers. For authors, this includes pen names, contact information, and manuscript metadata. For readers, this includes genre preferences, reading history on the platform, and verifying cross-platform reading engagement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">2. Anonymity and Protection</h2>
            <p>
              Reader identities are legally protected. Authors receive aggregate data regarding their campaigns (e.g., "75 readers claimed your book. 45 have completed it.") but will never receive the direct contact information or personal identities of individual readers. We comply with GDPR, CCPA, and all applicable global privacy standards.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">3. Platform Integration</h2>
            <p>
              To verify reader reach and completion, Liberelo integrates with public APIs of major retail platforms (e.g., Amazon, Goodreads). We do not request, store, or have access to your passwords for these third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">4. Manuscript Security</h2>
            <p>
              Unpublished manuscripts are hosted on our proprietary review infrastructure. Manuscripts are encrypted at rest and watermarked during access to prevent unauthorized redistribution or piracy. We do not claim any copyright or ownership over your intellectual property.
            </p>
          </section>

          <section className="p-8 bg-card border border-border/50 rounded-2xl">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Questions Regarding Privacy?</h3>
            <p className="mb-6">Our legal and compliance team is available to address any concerns.</p>
            <Button 
              variant="outline"
              asChild
            >
              <Link href="/contact">Contact Privacy Team</Link>
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
