"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen } from "lucide-react"

export function AgreementPage() {
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
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Author Agreement
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            The specific terms governing author campaigns and manuscript distribution on Liberelo.
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-sans leading-relaxed space-y-12">
           <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">1. Copyright and Ownership</h2>
            <p>
              You retain all ownership, copyright, and distribution rights to your work. Liberelo acts solely as a secure facilitator between you and the reader. We do not claim any exclusive rights to your manuscript.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">2. Service Guarantees</h2>
            <p>
              Liberelo guarantees <strong>reader reach</strong> commensurate with your purchased campaign tier. We guarantee that your book will be placed in the library and claimed by the specified number of genre-matched readers. 
            </p>
            <p>
              We <strong>do not</strong> guarantee a specific number of reviews, nor do we guarantee the star rating or sentiment of any review. The conversion of a "reach" into a "review" is dependent solely on the merit and appeal of your book.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">3. Retailer Compliance</h2>
            <p>
              It is your responsibility to ensure that your use of Liberelo complies with the Terms of Service of your primary retailer (e.g., KDP Select/Kindle Unlimited). If your book is enrolled in an exclusivity program like KDP Select, you must not upload the full manuscript to our platform; instead, you must link directly to the Amazon page for active distribution, ensuring page reads are captured by Amazon.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-medium text-foreground mb-4">4. Campaign Finality</h2>
            <p>
              Once a campaign has commenced and distribution has begun to readers, the campaign fee is non-refundable. If we fail to meet our guaranteed reach metric within 90 days, a prorated refund will be issued.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
