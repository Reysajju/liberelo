"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAppStore, ViewMode } from "@/stores/app-store"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { LandingPage } from "@/components/auth/LandingPage"
import { SignInPage } from "@/components/auth/SignInPage"
import { SignUpPage } from "@/components/auth/SignUpPage"
import { ForgotPasswordPage } from "@/components/auth/ForgotPasswordPage"
import { AboutPage } from "@/components/pages/AboutPage"
import { ContactPage } from "@/components/pages/ContactPage"
import { HowItWorksPage } from "@/components/pages/HowItWorksPage"
import { FAQPage } from "@/components/pages/FAQPage"
import { TermsPage } from "@/components/pages/TermsPage"
import { AgreementPage } from "@/components/pages/AgreementPage"
import { PricingPage } from "@/components/pages/PricingPage"
import { AuthorDashboard } from "@/components/dashboard/AuthorDashboard"
import { ReviewerDashboard } from "@/components/dashboard/ReviewerDashboard"
import { CampaignWizard } from "@/components/campaign/CampaignWizard"
import { DiscoverPage } from "@/components/reviewer/DiscoverPage"
import { LibraryPage } from "@/components/reviewer/LibraryPage"
import { CampaignDetailPage } from "@/components/campaign/CampaignDetailPage"
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy"
import { AnimatePresence, motion } from "framer-motion"

interface User {
  id: string
  name: string | null
  email: string
  userType: string
  image?: string | null
  totalReviewsGiven?: number
  reviewerRating?: number
  preferredGenres?: string | null
}

function HomeContent() {
  const { currentView, selectedCampaignId, setCurrentView, setGuestEmail } = useAppStore()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
            // Only redirect to dashboard if we're currently on landing or auth pages
            if (["landing", "auth", "signin", "signup"].includes(currentView)) {
              setCurrentView("dashboard")
            }
          }
        }
      } catch {
        // No existing session
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [setCurrentView])

  useEffect(() => {
    const view = searchParams.get("view")
    const email = searchParams.get("email")
    if (view && ["landing", "auth", "signin", "signup", "campaign-new"].includes(view)) {
      setCurrentView(view as any)
    }
    if (email) {
      setGuestEmail(email)
    }
  }, [searchParams, setCurrentView, setGuestEmail])

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser)
    setCurrentView("dashboard")
  }

  const handleCampaignComplete = () => {
    setCurrentView("dashboard")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 rounded-full border-2 border-fuchsia-500 border-b-transparent animate-spin" />
              </div>
            </div>
            <p className="text-white/40 text-sm">Loading Liberelo...</p>
          </div>
        </main>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage />
      case "auth":
      case "signin":
        return <SignInPage onAuthSuccess={handleAuthSuccess} />
      case "signup":
        return <SignUpPage onAuthSuccess={handleAuthSuccess} />
      case "forgot-password":
        return <ForgotPasswordPage />
      case "dashboard":
        if (!user) return <SignInPage onAuthSuccess={handleAuthSuccess} />
        return user.userType === "AUTHOR" ? (
          <AuthorDashboard user={user} />
        ) : user.userType === "BOTH" ? (
          <AuthorDashboard user={user} />
        ) : (
          <ReviewerDashboard user={user} />
        )
      case "campaign-new":
        // Allow guests to start a campaign
        return <CampaignWizard user={user} onComplete={handleCampaignComplete} />
      case "discover":
        if (!user) return <SignInPage onAuthSuccess={handleAuthSuccess} />
        return <DiscoverPage user={user} />
      case "library":
        if (!user) return <SignInPage onAuthSuccess={handleAuthSuccess} />
        return <LibraryPage user={user} />
      case "campaign-detail":
        if (!user || !selectedCampaignId) return <SignInPage onAuthSuccess={handleAuthSuccess} />
        return <CampaignDetailPage campaignId={selectedCampaignId} user={user} />
      default:
        return <LandingPage />
    }
  }

  const showFooter = ["landing"].includes(currentView)
  
  const showHeader = !["signin", "signup", "forgot-password"].includes(currentView)

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {showHeader && <Header user={user} />}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </main>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
