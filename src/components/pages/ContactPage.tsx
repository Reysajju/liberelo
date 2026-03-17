"use client"

import { useState } from "react"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Mail, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ContactPage() {
  const { setCurrentView } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Message sent elegantly",
        description: "We will return your correspondence within 24 hours.",
      })
      ;(e.target as HTMLFormElement).reset()
    }, 1000)
  }

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

        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h1 className="font-serif text-5xl font-medium text-foreground mb-6 leading-tight">
              Get in Touch
            </h1>
            <div className="w-16 h-[1px] bg-primary mb-8" />
            <p className="text-lg text-foreground/70 font-sans mb-12 leading-relaxed">
              Whether you are an author preparing for a major launch, or a publisher seeking a bespoke partnership, our team is at your disposal.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-1">Direct Correspondence</h3>
                  <a href="mailto:concierge@liberelo.com" className="text-foreground/70 hover:text-primary transition-colors">
                    concierge@liberelo.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-foreground mb-1">Headquarters</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    1200 Literary Avenue, Suite 400<br />
                    New York, NY 10011
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 p-8 md:p-10 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80 font-medium">Name</Label>
                  <Input 
                    id="name" 
                    required 
                    className="h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 font-medium">Email address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground/80 font-medium">Subject</Label>
                <Input 
                  id="subject" 
                  required 
                  className="h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground/80 font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  required 
                  rows={6}
                  className="resize-none bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl p-4"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-medium tracking-wide"
                disabled={loading}
              >
                {loading ? "Sending..." : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
