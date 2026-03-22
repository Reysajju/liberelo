"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, PenTool, BookOpen, User, Mail, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SignUpPageProps {
  onAuthSuccess: (user: any) => void
}

export function SignUpPage({ onAuthSuccess }: SignUpPageProps) {
  const { setCurrentView, guestEmail } = useAppStore()
  const { toast } = useToast()
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedType, setSelectedType] = useState<"NEW_AUTHOR" | "PUBLISHED_AUTHOR">("NEW_AUTHOR")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    if (guestEmail) {
      setFormData(prev => ({ 
        ...prev, 
        email: guestEmail,
        name: guestEmail.split("@")[0]
      }))
      // If we have a guest email, they are likely an author
      setSelectedType("NEW_AUTHOR")
      setStep("details")
    }
  }, [guestEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_type: selectedType,
          }
        }
      })

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Automatically register user in Prisma backend
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          userType: "AUTHOR",
        }),
      })

      toast({
        title: "Account created!",
        description: data.user?.identities?.length === 0 
          ? "Check your email for a confirmation link."
          : "Redirecting to your dashboard...",
      })

      if (data.session) {
        // Sync API handles finding/creating the profile
        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        })
        
        if (response.ok) {
          const profile = await response.json()
          onAuthSuccess(profile)
        } else {
          window.location.reload()
        }
      } else {
        // Require email confirmation
        setCurrentView("signin")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(184,150,62,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(184,150,62,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Button
            variant="ghost"
            className="self-start -ml-4 mb-6 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
            onClick={() => step === "details" ? setStep("role") : setCurrentView("landing")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {step === "details" ? "Back to roles" : "Home"}
          </Button>
          
          <h1 className="font-serif text-3xl font-medium text-foreground text-center mb-3">
            Join Liberelo
          </h1>
          <p className="text-foreground/60 text-center font-sans">
            {step === "role" 
              ? "Select how you'll use the platform" 
              : "Tell us a bit about yourself"}
          </p>
        </div>

        {step === "role" ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedType("PUBLISHED_AUTHOR")}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
                selectedType === "PUBLISHED_AUTHOR"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-card border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-all ${
                  selectedType === "PUBLISHED_AUTHOR"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/5 text-secondary/50 group-hover:bg-primary/5 group-hover:text-primary/70"
                }`}>
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-medium text-foreground text-lg mb-1">Published Author</h3>
                  <p className="text-sm text-foreground/60 font-sans leading-relaxed">
                    My book is live. I want to scale my reach and guarantee a dedicated reading audience.
                  </p>
                </div>
                <div className={`mt-2 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedType === "PUBLISHED_AUTHOR"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {selectedType === "PUBLISHED_AUTHOR" && <div className="w-2 h-2 rounded-full bg-background" />}
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedType("NEW_AUTHOR")}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 group ${
                selectedType === "NEW_AUTHOR"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-card border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl transition-all ${
                  selectedType === "NEW_AUTHOR"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary/5 text-secondary/50 group-hover:bg-primary/5 group-hover:text-primary/70"
                }`}>
                  <PenTool className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-medium text-foreground text-lg mb-1">New Author</h3>
                  <p className="text-sm text-foreground/70 font-sans leading-relaxed">
                    I'm preparing to launch. I need a publishing partner and guaranteed marketing reach.
                  </p>
                </div>
                <div className={`mt-2 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                  selectedType === "NEW_AUTHOR"
                    ? "border-primary bg-primary"
                    : "border-border"
                }`}>
                  {selectedType === "NEW_AUTHOR" && <div className="w-2 h-2 rounded-full bg-background" />}
                </div>
              </div>
            </button>



            <Button 
              onClick={() => setStep("details")}
              className="w-full h-14 mt-8 rounded-xl font-medium tracking-wide shadow-sm text-lg"
            >
              Continue
            </Button>
            
            <p className="text-center text-sm text-foreground/60 mt-6 pb-8 border-b border-border/30">
              Already have an account?{" "}
              <button 
                onClick={() => setCurrentView("signin")}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/80 font-medium">Full name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Austen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                    required
                    disabled={loading}
                  />
                  <User className="absolute left-3.5 top-3.5 h-5 w-5 text-foreground/40 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="author@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-foreground/40 pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-foreground/40 pointer-events-none" />
                </div>
                <p className="text-xs text-foreground/40 mt-1">Must be at least 8 characters</p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-6 rounded-xl font-medium tracking-wide shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                Create Account
              </Button>
            </form>
            
            <p className="text-xs text-center text-foreground/40 mt-6 px-4">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
