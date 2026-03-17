"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export function PricingPage() {
  const { setCurrentView } = useAppStore()

  const tiers = [
    {
      name: "Debut",
      category: "ARC / Pre-Launch",
      price: "$29",
      description: "For new authors seeking their first wave of genuine reader feedback.",
      reach: "500",
      features: [
        "Reach exactly 500 genre-matched readers",
        "Secure ARC distribution",
        "Amazon retail linking",
        "Basic engagement analytics",
      ],
      highlight: false
    },
    {
      name: "Author",
      category: "Published Authors",
      price: "$79",
      description: "For established authors looking to reliably scale their launch.",
      reach: "2,500",
      features: [
        "Reach exactly 2,500 genre-matched readers",
        "Priority feed placement",
        "Advanced sub-genre/trope targeting",
        "Real-time analytics dashboard",
      ],
      highlight: true
    },
    {
      name: "Publisher",
      category: "Published Authors",
      price: "$199",
      description: "For high-volume imprints demanding maximum market penetration.",
      reach: "10,000",
      features: [
        "Reach exactly 10,000 genre-matched readers",
        "Dedicated campaign manager",
        "Custom email blast to reader network",
        "White-glove listing setup",
      ],
      highlight: false
    },
    {
      name: "Elite",
      category: "Published Authors",
      price: "$349",
      description: "The ultimate reach package for guaranteed placement on bestseller radars.",
      reach: "20,000",
      features: [
        "Reach exactly 20,000 genre-matched readers",
        "Top-level site wide promotion",
        "Guaranteed cross-platform syndication pushing",
        "1-on-1 strategy call with team",
      ],
      highlight: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-6 lg:px-8 py-20 max-w-6xl mx-auto">
        <Button
          variant="ghost"
          className="self-start -ml-4 mb-12 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
          onClick={() => setCurrentView("landing")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <header className="mb-20 text-center">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Investment</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Transparent Pricing
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Stop paying per click. Liberelo charges per submission, guaranteeing the exact number of readers your book will reach. We guarantee readers and feedback, not reviews.
          </p>
        </header>

        <div className="mb-20 text-center">
          <span className="inline-block bg-secondary/10 text-secondary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            Readers: 100% Free to Join & Read
          </span>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${
                tier.highlight 
                  ? 'bg-secondary/5 border-primary shadow-lg scale-105 z-10' 
                  : 'bg-card border-border/50 hover:border-primary/50'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest font-semibold bg-primary text-primary-foreground px-4 py-1 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <span className="text-secondary text-xs uppercase tracking-widest font-semibold">{tier.category}</span>
                <h3 className="font-serif text-2xl font-medium text-foreground mt-1 mb-2">{tier.name}</h3>
                <p className="text-foreground/60 font-sans text-sm h-14">{tier.description}</p>
              </div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="font-serif text-5xl font-semibold">{tier.price}</span>
                <span className="text-foreground/50 font-sans">/submission</span>
              </div>

              <div className="mb-8 pb-8 border-b border-border/50">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Guaranteed Reach</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-medium text-foreground">{tier.reach}</span>
                  <span className="text-foreground/60 text-sm">Readers</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-foreground/80 font-sans text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full h-12 rounded-xl font-medium tracking-wide ${
                  tier.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary/10 text-foreground hover:bg-secondary/20'
                }`}
                onClick={() => setCurrentView("signup")}
              >
                Launch Campaign
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center max-w-2xl mx-auto">
          <p className="text-foreground/50 text-sm font-sans italic">
            * Note: We charge based on guaranteed reader reach. We do not compensate reviewers, ensuring strict adherence to Amazon's platform rules. A reach guarantees that the selected number of readers will see your book and be prompted to give feedback.
          </p>
        </div>
      </div>
    </div>
  )
}
