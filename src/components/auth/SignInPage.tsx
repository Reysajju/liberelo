"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SignInPageProps {
  onAuthSuccess: (user: any) => void
}

export function SignInPage({ onAuthSuccess }: SignInPageProps) {
  const { setCurrentView, guestEmail } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    if (guestEmail) {
      setFormData(prev => ({ ...prev, email: guestEmail }))
    }
  }, [guestEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      // Sync with Prisma backend
      if (data.user) {
        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.user.email }),
        })
        
        if (response.ok) {
          const profile = await response.json()
          onAuthSuccess(profile)
        } else {
          // Even if sync fails, let them in if Supabase succeeded
          // The session endpoint will handle it
          toast({
            title: "Welcome back",
            description: "Redirecting to your dashboard...",
          })
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Sign in error:", error)
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
        <div className="mb-10 flex flex-col items-center">
          <Button
            variant="ghost"
            className="self-start -ml-4 mb-6 text-foreground/60 hover:text-foreground hover:bg-transparent tracking-wide"
            onClick={() => setCurrentView("landing")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <div className="mb-6 flex justify-center">
            <span className="font-serif text-3xl font-semibold tracking-tight text-foreground">
              Liberelo
            </span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-foreground text-center mb-3">
            Welcome back
          </h1>
          <p className="text-foreground/60 text-center font-sans">
            Enter your credentials to access your account
          </p>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                <button 
                  type="button" 
                  onClick={() => setCurrentView("forgot-password")}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                  required
                  disabled={loading}
                />
                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-foreground/40 pointer-events-none" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 mt-6 rounded-xl font-medium tracking-wide shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-foreground/60 text-sm">
              Don't have an account?{" "}
              <button 
                onClick={() => setCurrentView("signup")}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
