"use client"

import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, PenTool, Award } from "lucide-react"

export function AboutPage() {
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
          <h1 className="font-serif text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight">
            Our Story
          </h1>
          <div className="w-24 h-[1px] bg-primary mx-auto mb-8" />
          <p className="text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
            Born from a writer's frustration with the publishing industry's endless loops and gatekeepers.
          </p>
        </header>

        <section className="space-y-16">
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-sans leading-relaxed">
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">The Endless Loop</h2>
            <p>
              Every author knows the trap: you need reviews to get sales, but you need sales to get reviews. Traditional platforms demand proven track records before they'll promote your work. Review services charge exorbitant fees and make promises they can't legally keep.
            </p>
            <p>
              Liberelo was founded on a simple premise: great books die in silence every day, not because they aren't worth reading, but because they can't break through the initial visibility barrier.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 p-10 bg-card rounded-2xl border border-border/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            
            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">Author First</h3>
              <p className="text-sm text-foreground/70">Built by authors who know the sting of a silent launch day.</p>
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">Reader Led</h3>
              <p className="text-sm text-foreground/70">We never pay for reviews. We guarantee reach; readers decide the rest.</p>
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto text-chart-3">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground">Premium Quality</h3>
              <p className="text-sm text-foreground/70">A curated experience that respects the literary craft.</p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 font-sans leading-relaxed">
            <h2 className="font-serif text-3xl font-medium text-foreground mb-6">Our Promise</h2>
            <p>
              We don't guarantee five-star reviews. We guarantee that your life's work will be placed directly in front of readers who devour your specific genre. We strip away the noise, the fake engagement, and the pay-to-play review farms.
            </p>
            <p>
              At Liberelo, we believe that an author's only job should be writing the next great book. Leave the discovery to us.
            </p>
          </div>
        </section>

        <div className="mt-24 text-center">
          <Button 
            size="lg"
            className="h-14 px-10 rounded-xl font-medium text-lg tracking-wide"
            onClick={() => setCurrentView("signup")}
          >
            Join Our Community
          </Button>
        </div>
      </div>
    </div>
  )
}
