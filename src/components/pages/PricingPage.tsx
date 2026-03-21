"use client"

import Link from "next/link"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function PricingPage() {
  const { setCurrentView } = useAppStore()
  const router = useRouter()

  const tiers = [
    {
      name: "Standard",
      category: "Wide Distribution",
      price: "50%",
      description: "Our entry-level partnership covering standard publication and minimal marketing.",
      reach: "Wide (Amazon, B&N)",
      features: [
        "Professional formatting & cover review",
        "Wide distribution across all retailers",
        "Basic launch marketing campaign",
        "No upfront publishing fees"
      ],
      highlight: false
    },
    {
      name: "Plus",
      category: "Wide & Exclusive",
      price: "60%",
      description: "Enhanced marketing spend for authors with a proven audience.",
      reach: "Wide + Liberelo",
      features: [
        "Advanced ad-campaign management",
        "Priority placement on Liberelo platform",
        "Genre-matched email blasts",
        "Account management support"
      ],
      highlight: true
    },
    {
      name: "Professional",
      category: "Exclusive Distribution",
      price: "75%",
      description: "For serious authors utilizing our proprietary selling machine exclusively.",
      reach: "Liberelo Exclusive",
      features: [
        "Exclusive Liberelo platform sales",
        "Dedicated marketing manager",
        "Custom promotional graphics",
        "Maximum organic reach algorithms"
      ],
      highlight: false
    },
    {
      name: "Elite",
      category: "Bestseller Priority",
      price: "90%",
      description: "Maximum author royalties for established bestsellers moving massive volume.",
      reach: "Exclusive VIP",
      features: [
        "Whitelabel publishing imprint options",
        "Top-level site wide promotion",
        "1-on-1 strategy calls with our team",
        "Lowest commission fees applied"
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
          asChild
        >
          <Link href="/">
            Back to Home
          </Link>
        </Button>

        <header className="mb-20 text-center">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Partnership</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Royalty Packages
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            We don't charge upfront publishing or marketing fees. Your royalty percentage depends on the partnership tier you select when submitting your manuscript. You receive an exact percentage of net revenue after costs and taxes.
          </p>
        </header>

        <div className="mb-20 text-center">
          <span className="inline-block bg-secondary/10 text-secondary text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            Authors: 100% Free to Submit & Publish
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
                <span className="text-foreground/50 font-sans">Royalty</span>
              </div>

              <div className="mb-8 pb-8 border-b border-border/50">
                <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">Distribution Path</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-medium text-foreground">{tier.reach}</span>
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
                className={`w-full h-12 rounded-xl font-medium text-base tracking-wide ${
                  tier.highlight 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                asChild
              >
                <Link href="/signup">Submit Manuscript</Link>
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
