import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  BookOpen, 
  Star, 
  Shield, 
  Target, 
  TrendingUp,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  const { setCurrentView } = useAppStore()

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden mx-4 lg:mx-8">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(184,150,62,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(184,150,62,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        <div className="container relative z-10 max-w-5xl mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium uppercase tracking-[0.2em] mb-4">
              <Star className="h-3.5 w-3.5 fill-primary" />
              <span>For Sophisticated Authors</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground leading-[1.1]">
              Literary Discovery, <br />
              <span className="text-primary italic">Elevated.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed">
              Liberate your work from the relentless noise of self-publishing. We secure authentic, genre-matched readers for your manuscript—guaranteed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-8 rounded-xl font-medium font-sans text-lg tracking-wide shadow-sm"
                onClick={() => setCurrentView("signup")}
              >
                Launch Your Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link 
                href="/how-it-works"
                className="w-full sm:w-auto h-14 px-8 rounded-xl font-medium font-sans text-lg bg-transparent border border-foreground/20 hover:bg-secondary/5 flex items-center justify-center transition-colors"
                onClick={() => setCurrentView("how-it-works")}
              >
                Explore the Process
              </Link>
            </div>
            
            <div className="pt-12 flex items-center justify-center gap-8 text-sm text-foreground/50 font-sans tracking-wide">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Verified Reviewers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Amazon Compliant</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Zero Bots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-card border-y border-border/50">
        <div className="container px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-secondary font-medium tracking-widest uppercase text-sm">Philosophy</span>
                <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-tight">
                  Stop hoping.<br />Start reaching.
                </h2>
              </div>
              <p className="text-lg text-foreground/70 font-sans leading-relaxed">
                The current publishing ecosystem is fractured. Brilliant manuscripts languish in obscurity because visibility is gatekept by algorithms that reward established momentum.
              </p>
              <p className="text-lg text-foreground/70 font-sans leading-relaxed">
                Liberelo circumvents the algorithm. We pair authors directly with readers who possess a proven history of devouring and thoughtfully critiquing your exact sub-genre. 
              </p>
              <div className="pt-4">
                <Link 
                  href="/about"
                  className="px-0 text-primary font-medium hover:text-primary/80 font-sans text-lg flex items-center gap-2"
                  onClick={() => setCurrentView("about")}
                >
                  Read our story <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl transform rotate-3" />
              <div className="absolute inset-0 bg-secondary/10 rounded-3xl transform -rotate-3" />
              <div className="relative bg-background border border-border/50 p-10 rounded-3xl shadow-sm space-y-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-foreground">The Liberelo Guarantee</h3>
                <p className="text-foreground/70 font-sans leading-relaxed">
                  We do not sell reviews—doing so would violate Amazon's terms of service and compromise the integrity of the literary critique. 
                </p>
                <div className="p-6 bg-secondary/5 border border-secondary/20 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                  <p className="relative z-10 text-foreground font-serif text-lg italic tracking-wide">
                    "We guarantee that your work will be placed directly in the hands of readers demanding exactly what you write."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 mx-4 lg:mx-8">
        <div className="container px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm">Capabilities</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-tight">
              A refined suite for serious authors.
            </h2>
            <p className="text-lg text-foreground/70 font-sans leading-relaxed">
              Every feature designed to honor the craft and secure the audience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-10 rounded-3xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Precision Targeting</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Connect exclusively with readers who have a demonstrated history in your specific sub-genre and trope preferences.
              </p>
            </div>

            <div className="bg-card border border-border/50 p-10 rounded-3xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Secure Distribution</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                For pre-launch ARCs, our proprietary viewer ensures your manuscript cannot be copied, downloaded, or shared maliciously.
              </p>
            </div>

            <div className="bg-card border border-border/50 p-10 rounded-3xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-foreground mb-4">Transparent Metrics</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Monitor reader progress, track cross-posts to retail platforms, and view engagement analytics in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mb-24 mx-4 md:mx-auto max-w-5xl">
        <div className="bg-foreground text-background rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
              Ready to break the silence?
            </h2>
            <p className="text-xl text-background/80 font-sans leading-relaxed">
              Join the exclusive tier of authors securing guaranteed visibility for their life's work.
            </p>
            <div className="pt-8">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 px-10 rounded-xl font-medium font-sans text-lg tracking-wide shadow-lg border-none"
                onClick={() => setCurrentView("signup")}
              >
                Commence Registration
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
