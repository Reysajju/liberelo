"use client"

import { useState } from "react"
import { useAppStore } from "@/stores/app-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export function ForgotPasswordPage() {
  const { setCurrentView } = useAppStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })

      if (error) {
        toast({
          title: "Failed to send reset link",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      setSuccess(true)
    } catch (error) {
      console.error("Reset error:", error)
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
            onClick={() => setCurrentView("signin")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
          
          <h1 className="font-serif text-3xl font-medium text-foreground text-center mb-3">
            Reset Password
          </h1>
          <p className="text-foreground/60 text-center font-sans">
            We'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-sm">
          {success ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-3">Check your inbox</h3>
              <p className="text-foreground/60 font-sans mb-8 leading-relaxed">
                We sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Click the link to set a new password.
              </p>
              <Button 
                variant="outline"
                className="w-full h-12 rounded-xl font-medium"
                onClick={() => setCurrentView("signin")}
              >
                Return to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground/80 font-medium">Email address</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="author@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-transparent border-input focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
                    required
                    disabled={loading}
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-foreground/40 pointer-events-none" />
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
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
