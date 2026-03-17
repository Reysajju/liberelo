"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Target, Users, TrendingUp } from "lucide-react"

export function HowItWorksPage() {
  const { setCurrentView } = useAppStore()

  const steps = [
    {
      num: "01",
      title: "Submit Your Manuscript",
      desc: "Upload your pre-launch ARC or link your published Amazon page. Our system securely processes your work.",
      icon: BookOpen,
    },
    {
      num: "02",
      title: "Select Your Guaranteed Reach",
      desc: "Choose exactly how many genre-matched readers you want your book placed in front of. Real readers, real guarantees.",
      icon: Target,
    },
    {
      num: "03",
      title: "Targeted Distribution",
      desc: "Our algorithm matches your book to verified reviewers based on their demonstrated reading history and preferences.",
      icon: Users,
    },
    {
      num: "04",
      title: "Track Authentic Results",
      desc: "Monitor your dashboard as readers claim, read, and cross-post their honest reviews to Amazon and Goodreads.",
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-6 lg:px-8 py-20 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          className="self-start -ml-4 mb-12 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
          onClick={() => setCurrentView("landing")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <header className="mb-24 text-center">
          <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Process</span>
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            How Liberelo Works
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            A refined, transparent process designed to put your book in the hands of readers who actually want to read it.
          </p>
        </header>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-border/50 -translate-x-1/2" />

          <div className="space-y-24">
            {steps.map((step, i) => {
              const Icon = step.icon
              const isEven = i % 2 !== 0

              return (
                <div key={step.num} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-background border-2 border-primary rounded-full items-center justify-center z-10 shadow-sm">
                    <span className="font-serif text-primary font-medium">{step.num}</span>
                  </div>

                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border/50 text-secondary mb-6 shadow-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-3xl font-medium text-foreground mb-4">{step.title}</h3>
                    <p className="text-lg text-foreground/70 leading-relaxed font-sans">{step.desc}</p>
                  </div>

                  {/* Empty space for the other side of timeline */}
                  <div className="hidden md:block w-1/2" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-32 p-12 bg-secondary text-secondary-foreground rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6 relative z-10">
            Ready to break the silence?
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of authors who have traded hope-based marketing for guaranteed reader reach.
          </p>
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 rounded-xl font-medium text-lg tracking-wide relative z-10"
            onClick={() => setCurrentView("signup")}
          >
            Launch Your Campaign
          </Button>
        </div>
      </div>
    </div>
  )
}
