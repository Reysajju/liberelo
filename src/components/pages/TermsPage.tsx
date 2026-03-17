"use client"

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
          onClick={() => setCurrentView("landing")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
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
              Liberelo operates as a literary discovery facilitation service. We provide a platform that connects authors (both published and pre-publication) with readers who have expressed interest in reviewing books within specific genres.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">3. Prohibition of Compensated Reviews</h2>
            <p>
              <strong>Liberelo explicitly prohibits the purchasing of reviews.</strong> Authors pay for <em>guaranteed reader reach</em> and distribution software, not for favorable feedback. Reviewers are never compensated financially for their opinions. This policy is strictly enforced to maintain compliance with Amazon's Terms of Service and FTC guidelines.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">4. User Responsibilities</h2>
            <p>
              <strong>Authors:</strong> Must possess the legal right to distribute the manuscripts they upload. Authors must not contact reviewers directly outside the platform or attempt to influence their honest opinions.
            </p>
            <p>
              <strong>Reviewers:</strong> Must claim only books they reasonably intend to read. Reviews must be honest, original, and cross-posted to the agreed-upon retail platforms. Repeated failure to read claimed books will result in account suspension.
            </p>
          </section>

          <section className="p-8 bg-card border border-border/50 rounded-2xl mt-12">
            <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Legal Inquiries</h3>
            <p className="mb-6">For formal legal correspondence regarding these terms, please contact our counsel.</p>
            <Button 
              variant="outline"
              onClick={() => setCurrentView("contact")}
            >
              Contact Legal
            </Button>
          </section>
        </div>
      </div>
    </div>
  )
}
